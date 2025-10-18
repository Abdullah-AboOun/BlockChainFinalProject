import { Router, Response } from "express";
import { ethers } from "ethers";
import { randomUUID } from "crypto";
import { db } from "../database/db.js";
import { verifyToken, AuthRequest } from "../middleware/auth.js";

const router: Router = Router();

// Get all entities (admin only)
router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.get("SELECT role FROM users WHERE id = ?", [req.user.id]);
    if (user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const entities = await db.all("SELECT * FROM entities");
    res.json(entities);
  } catch (error) {
    console.error("Get entities error:", error);
    res.status(500).json({ error: "Failed to get entities" });
  }
});

// Register as issuer or requester
router.post("/register", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { entityType, organizationName, walletAddress } = req.body;

    if (!entityType || !organizationName || !walletAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["ISSUER", "REQUESTER"].includes(entityType)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Check if entity already exists
    const existingEntity = await db.get(
      "SELECT * FROM entities WHERE wallet_address = ?",
      [walletAddress]
    );
    if (existingEntity) {
      return res.status(400).json({ error: "Entity already registered" });
    }

    // Get user name and update wallet
    const user = await db.get("SELECT name FROM users WHERE id = ?", [req.user.id]);
    await db.run("UPDATE users SET wallet_address = ? WHERE id = ?", [
      walletAddress,
      req.user.id,
    ]);

    // Create entity
    const entityId = randomUUID();
    await db.run(
      `INSERT INTO entities (id, user_id, wallet_address, entity_type, organization_name, contact_email, status)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [entityId, req.user.id, walletAddress, entityType, organizationName, req.user.email]
    );

    res.status(201).json({
      message: "Entity registered successfully. Pending admin approval.",
      entity: {
        id: entityId,
        entityType,
        organizationName,
        walletAddress,
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Register entity error:", error);
    res.status(500).json({ error: "Failed to register entity" });
  }
});

// Get user's entity
router.get("/my-entity", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const entity = await db.get(
      "SELECT * FROM entities WHERE user_id = ?",
      [req.user.id]
    );

    if (!entity) {
      return res.status(404).json({ error: "Entity not found" });
    }

    res.json(entity);
  } catch (error) {
    console.error("Get user entity error:", error);
    res.status(500).json({ error: "Failed to get entity" });
  }
});

// Approve entity (admin only)
router.patch("/:id/approve", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.get("SELECT role FROM users WHERE id = ?", [req.user.id]);
    if (user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await db.run("UPDATE entities SET status = 'APPROVED' WHERE id = ?", [req.params.id]);

    res.json({ message: "Entity approved successfully" });
  } catch (error) {
    console.error("Approve entity error:", error);
    res.status(500).json({ error: "Failed to approve entity" });
  }
});

// Reject entity (admin only)
router.patch("/:id/reject", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.get("SELECT role FROM users WHERE id = ?", [req.user.id]);
    if (user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await db.run("UPDATE entities SET status = 'REJECTED' WHERE id = ?", [req.params.id]);

    res.json({ message: "Entity rejected" });
  } catch (error) {
    console.error("Reject entity error:", error);
    res.status(500).json({ error: "Failed to reject entity" });
  }
});

export default router;
