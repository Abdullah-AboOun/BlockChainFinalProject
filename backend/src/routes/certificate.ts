import { Router, Response } from "express";
import { randomUUID } from "crypto";
import { db } from "../database/db.js";
import { verifyToken, AuthRequest } from "../middleware/auth.js";

const router: Router = Router();

// Store certificate info (backend records transaction)
router.post("/store", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      certificateId,
      issuerAddress,
      recipientAddress,
      certificateHash,
      documentHash,
      certificateType,
      metadata,
    } = req.body;

    if (!certificateId || !issuerAddress || !recipientAddress || !certificateHash) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if certificate already exists
    const existingCert = await db.get(
      "SELECT * FROM certificates WHERE certificate_hash = ?",
      [certificateHash]
    );
    if (existingCert) {
      return res.status(400).json({ error: "Certificate already registered" });
    }

    const recordId = randomUUID();
    await db.run(
      `INSERT INTO certificates (
        id, certificate_id, issuer_address, recipient_address,
        certificate_hash, document_hash, certificate_type, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recordId,
        certificateId,
        issuerAddress,
        recipientAddress,
        certificateHash,
        documentHash || null,
        certificateType,
        metadata || null,
      ]
    );

    res.status(201).json({
      message: "Certificate registered successfully",
      record: { recordId, certificateId, certificateHash },
    });
  } catch (error) {
    console.error("Store certificate error:", error);
    res.status(500).json({ error: "Failed to store certificate" });
  }
});

// Get user's certificates
router.get("/my-certificates", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.get("SELECT wallet_address FROM users WHERE id = ?", [req.user.id]);

    if (!user?.wallet_address) {
      return res.json({ certificates: [] });
    }

    const certificates = await db.all(
      `SELECT * FROM certificates 
       WHERE recipient_address = ? OR issuer_address = ?
       ORDER BY created_at DESC`,
      [user.wallet_address, user.wallet_address]
    );

    res.json({ certificates });
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({ error: "Failed to get certificates" });
  }
});

// Get certificate by hash
router.get("/by-hash/:hash", async (req: AuthRequest, res: Response) => {
  try {
    const { hash } = req.params;

    const certificate = await db.get(
      "SELECT * FROM certificates WHERE certificate_hash = ?",
      [hash]
    );

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    res.json(certificate);
  } catch (error) {
    console.error("Get certificate error:", error);
    res.status(500).json({ error: "Failed to get certificate" });
  }
});

// Get certificates by issuer
router.get("/issued-by/:address", async (req: AuthRequest, res: Response) => {
  try {
    const { address } = req.params;

    const certificates = await db.all(
      `SELECT * FROM certificates 
       WHERE issuer_address = ?
       ORDER BY created_at DESC`,
      [address]
    );

    res.json({ certificates });
  } catch (error) {
    console.error("Get issued certificates error:", error);
    res.status(500).json({ error: "Failed to get issued certificates" });
  }
});

// Get certificates for recipient
router.get("/received-by/:address", async (req: AuthRequest, res: Response) => {
  try {
    const { address } = req.params;

    const certificates = await db.all(
      `SELECT * FROM certificates 
       WHERE recipient_address = ?
       ORDER BY created_at DESC`,
      [address]
    );

    res.json({ certificates });
  } catch (error) {
    console.error("Get received certificates error:", error);
    res.status(500).json({ error: "Failed to get received certificates" });
  }
});

export default router;
