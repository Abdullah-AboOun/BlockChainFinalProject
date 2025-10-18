import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "../database/db.js";
import { generateToken, AuthRequest, verifyToken } from "../middleware/auth.js";

const router: Router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Register endpoint
router.post("/register", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body as RegisterRequest;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    // Create user
    await db.run(
      "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)",
      [userId, email, passwordHash, name]
    );

    const token = generateToken(userId, email, "user");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, email, name },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login endpoint
router.post("/login", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user
router.get("/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.get("SELECT id, email, name, role, wallet_address FROM users WHERE id = ?", [
      req.user.id,
    ]);
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Link wallet address
router.post("/link-wallet", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    await db.run("UPDATE users SET wallet_address = ? WHERE id = ?", [
      walletAddress,
      req.user.id,
    ]);

    res.json({ message: "Wallet linked successfully", walletAddress });
  } catch (error) {
    console.error("Link wallet error:", error);
    res.status(500).json({ error: "Failed to link wallet" });
  }
});

export default router;
