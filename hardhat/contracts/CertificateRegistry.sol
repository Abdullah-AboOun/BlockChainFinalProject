// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title CertificateRegistry
 * @dev A comprehensive certificate management platform for issuing, storing, and verifying certificates
 */
contract CertificateRegistry {
    // ==================== Types ====================
    
    enum EntityType {
        ISSUER,
        REQUESTER
    }

    enum EntityStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    struct Certificate {
        uint256 id;
        address issuer;
        address recipient;
        string certificateHash; // IPFS hash or certificate data hash
        string documentHash; // Hash of the electronic copy
        uint256 issuedAt;
        string certificateType; // e.g., "Diploma", "License", etc.
        bool isVerified;
        string metadata; // Additional JSON metadata
    }

    struct Entity {
        address walletAddress;
        string name;
        string organizationName;
        EntityType entityType;
        EntityStatus status;
        uint256 registeredAt;
        string contactEmail;
        bool isActive;
    }

    // ==================== State Variables ====================
    
    address public admin;
    uint256 public certificateCounter;

    mapping(address => Entity) public entities;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public userCertificates;
    mapping(address => uint256[]) public issuedCertificates;
    mapping(string => uint256) public certificateHashToCertificateId;

    // ==================== Events ====================
    
    event EntityRegistered(
        address indexed walletAddress,
        string name,
        EntityType entityType,
        uint256 timestamp
    );

    event EntityStatusChanged(
        address indexed walletAddress,
        EntityStatus newStatus,
        uint256 timestamp
    );

    event CertificateIssued(
        uint256 indexed certificateId,
        address indexed issuer,
        address indexed recipient,
        string certificateType,
        uint256 timestamp
    );

    event CertificateVerified(
        uint256 indexed certificateId,
        bool isVerified,
        uint256 timestamp
    );

    event DocumentStored(
        uint256 indexed certificateId,
        string documentHash,
        uint256 timestamp
    );

    // ==================== Modifiers ====================
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyRegistered() {
        require(entities[msg.sender].walletAddress != address(0), "Entity not registered");
        _;
    }

    modifier onlyApprovedIssuer() {
        require(
            entities[msg.sender].entityType == EntityType.ISSUER &&
            entities[msg.sender].status == EntityStatus.APPROVED,
            "Only approved issuers can call this function"
        );
        _;
    }

    modifier onlyApprovedEntity() {
        require(
            entities[msg.sender].status == EntityStatus.APPROVED,
            "Only approved entities can call this function"
        );
        _;
    }

    // ==================== Constructor ====================
    
    constructor() {
        admin = msg.sender;
        certificateCounter = 1;
        
        // Register admin as an entity
        entities[admin] = Entity(
            admin,
            "Platform Admin",
            "CertifyChain",
            EntityType.ISSUER,
            EntityStatus.APPROVED,
            block.timestamp,
            "admin@certifychain.com",
            true
        );
    }

    // ==================== Admin Functions ====================
    
    /**
     * @dev Register a new entity (issuer or requester) - called by backend/API
     */
    function registerEntity(
        address walletAddress,
        string calldata name,
        string calldata organizationName,
        EntityType entityType,
        string calldata contactEmail
    ) external onlyAdmin {
        require(entities[walletAddress].walletAddress == address(0), "Entity already registered");
        require(walletAddress != address(0), "Invalid wallet address");

        entities[walletAddress] = Entity(
            walletAddress,
            name,
            organizationName,
            entityType,
            EntityStatus.PENDING,
            block.timestamp,
            contactEmail,
            true
        );

        emit EntityRegistered(walletAddress, name, entityType, block.timestamp);
    }

    /**
     * @dev Approve or reject an entity registration
     */
    function updateEntityStatus(address walletAddress, EntityStatus status) external onlyAdmin {
        require(entities[walletAddress].walletAddress != address(0), "Entity not found");
        entities[walletAddress].status = status;
        emit EntityStatusChanged(walletAddress, status, block.timestamp);
    }

    /**
     * @dev Deactivate an entity
     */
    function deactivateEntity(address walletAddress) external onlyAdmin {
        require(entities[walletAddress].walletAddress != address(0), "Entity not found");
        entities[walletAddress].isActive = false;
    }

    // ==================== Certificate Functions ====================
    
    /**
     * @dev Issue a new certificate
     */
    function issueCertificate(
        address recipient,
        string calldata certificateHash,
        string calldata certificateType,
        string calldata metadata
    ) external onlyApprovedIssuer returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(certificateHash).length > 0, "Certificate hash cannot be empty");

        uint256 certificateId = certificateCounter;
        certificateCounter++;

        certificates[certificateId] = Certificate(
            certificateId,
            msg.sender,
            recipient,
            certificateHash,
            "",
            block.timestamp,
            certificateType,
            false,
            metadata
        );

        certificateHashToCertificateId[certificateHash] = certificateId;
        userCertificates[recipient].push(certificateId);
        issuedCertificates[msg.sender].push(certificateId);

        emit CertificateIssued(
            certificateId,
            msg.sender,
            recipient,
            certificateType,
            block.timestamp
        );

        return certificateId;
    }

    /**
     * @dev Verify a certificate (mark as verified)
     */
    function verifyCertificate(uint256 certificateId) external onlyAdmin {
        require(certificates[certificateId].id != 0, "Certificate not found");
        certificates[certificateId].isVerified = true;
        emit CertificateVerified(certificateId, true, block.timestamp);
    }

    /**
     * @dev Store electronic copy of certificate
     */
    function storeDocument(uint256 certificateId, string calldata documentHash) external {
        require(certificates[certificateId].id != 0, "Certificate not found");
        require(
            msg.sender == certificates[certificateId].issuer || msg.sender == admin,
            "Only issuer or admin can store document"
        );

        certificates[certificateId].documentHash = documentHash;
        emit DocumentStored(certificateId, documentHash, block.timestamp);
    }

    // ==================== Query Functions ====================
    
    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 certificateId)
        external
        view
        returns (Certificate memory)
    {
        require(certificates[certificateId].id != 0, "Certificate not found");
        return certificates[certificateId];
    }

    /**
     * @dev Get entity details
     */
    function getEntity(address walletAddress)
        external
        view
        returns (Entity memory)
    {
        require(entities[walletAddress].walletAddress != address(0), "Entity not found");
        return entities[walletAddress];
    }

    /**
     * @dev Verify if a certificate exists and is valid
     */
    function verifyCertificateByHash(string calldata certificateHash)
        external
        view
        returns (bool, uint256)
    {
        uint256 certificateId = certificateHashToCertificateId[certificateHash];
        if (certificateId == 0) {
            return (false, 0);
        }
        return (certificates[certificateId].isVerified, certificateId);
    }

    /**
     * @dev Get all certificates for a user
     */
    function getUserCertificates(address userAddress)
        external
        view
        returns (uint256[] memory)
    {
        return userCertificates[userAddress];
    }

    /**
     * @dev Get all certificates issued by an issuer
     */
    function getIssuedCertificates(address issuerAddress)
        external
        view
        returns (uint256[] memory)
    {
        return issuedCertificates[issuerAddress];
    }

    /**
     * @dev Check if address is a registered and approved issuer
     */
    function isApprovedIssuer(address walletAddress) external view returns (bool) {
        return (
            entities[walletAddress].entityType == EntityType.ISSUER &&
            entities[walletAddress].status == EntityStatus.APPROVED
        );
    }

    /**
     * @dev Check if certificate is valid and verified
     */
    function isCertificateValid(uint256 certificateId) external view returns (bool) {
        return (
            certificates[certificateId].id != 0 &&
            certificates[certificateId].isVerified
        );
    }
}
