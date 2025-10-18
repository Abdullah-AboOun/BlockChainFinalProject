import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CertificateModule = buildModule("CertificateModule", (m) => {
  const certificateRegistry = m.contract("CertificateRegistry");

  return { certificateRegistry };
});

export default CertificateModule;
