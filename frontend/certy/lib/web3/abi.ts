export const CERTIFICATE_REGISTRY_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "certificateId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "isVerified",
        type: "bool",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CertificateVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "certificateId",
        type: "uint256",
      },
      {
        indexed: true,
        name: "issuer",
        type: "address",
      },
      {
        indexed: true,
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        name: "certificateType",
        type: "string",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CertificateIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "certificateId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "documentHash",
        type: "string",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DocumentStored",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "walletAddress",
        type: "address",
      },
      {
        indexed: false,
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        name: "entityType",
        type: "uint8",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "EntityRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "walletAddress",
        type: "address",
      },
      {
        indexed: false,
        name: "newStatus",
        type: "uint8",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "EntityStatusChanged",
    type: "event",
  },
  {
    inputs: [
      {
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "getEntity",
    outputs: [
      {
        components: [
          {
            name: "walletAddress",
            type: "address",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "organizationName",
            type: "string",
          },
          {
            name: "entityType",
            type: "uint8",
          },
          {
            name: "status",
            type: "uint8",
          },
          {
            name: "registeredAt",
            type: "uint256",
          },
          {
            name: "contactEmail",
            type: "string",
          },
          {
            name: "isActive",
            type: "bool",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "certificateId",
        type: "uint256",
      },
    ],
    name: "getCertificate",
    outputs: [
      {
        components: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "issuer",
            type: "address",
          },
          {
            name: "recipient",
            type: "address",
          },
          {
            name: "certificateHash",
            type: "string",
          },
          {
            name: "documentHash",
            type: "string",
          },
          {
            name: "issuedAt",
            type: "uint256",
          },
          {
            name: "certificateType",
            type: "string",
          },
          {
            name: "isVerified",
            type: "bool",
          },
          {
            name: "metadata",
            type: "string",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "certificateHash",
        type: "string",
      },
    ],
    name: "verifyCertificateByHash",
    outputs: [
      {
        name: "",
        type: "bool",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUserCertificates",
    outputs: [
      {
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "issuerAddress",
        type: "address",
      },
    ],
    name: "getIssuedCertificates",
    outputs: [
      {
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "isApprovedIssuer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "certificateId",
        type: "uint256",
      },
    ],
    name: "isCertificateValid",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "certificateHash",
        type: "string",
      },
      {
        name: "certificateType",
        type: "string",
      },
      {
        name: "metadata",
        type: "string",
      },
    ],
    name: "issueCertificate",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "walletAddress",
        type: "address",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "organizationName",
        type: "string",
      },
      {
        name: "entityType",
        type: "uint8",
      },
      {
        name: "contactEmail",
        type: "string",
      },
    ],
    name: "registerEntity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "certificateId",
        type: "uint256",
      },
    ],
    name: "verifyCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "certificateId",
        type: "uint256",
      },
      {
        name: "documentHash",
        type: "string",
      },
    ],
    name: "storeDocument",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "walletAddress",
        type: "address",
      },
      {
        name: "status",
        type: "uint8",
      },
    ],
    name: "updateEntityStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "deactivateEntity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "certificateCounter",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
