import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "..", "certy.db");

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("Error opening database:", err);
      } else {
        console.log("Connected to SQLite database at:", DB_PATH);
        this.initialize();
      }
    });
  }

  private initialize() {
    this.db.serialize(() => {
      // Users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          wallet_address TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Entities table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS entities (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          wallet_address TEXT UNIQUE NOT NULL,
          entity_type TEXT NOT NULL,
          organization_name TEXT NOT NULL,
          contact_email TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Certificates table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS certificates (
          id TEXT PRIMARY KEY,
          certificate_id INTEGER NOT NULL,
          issuer_address TEXT NOT NULL,
          recipient_address TEXT NOT NULL,
          certificate_hash TEXT NOT NULL UNIQUE,
          document_hash TEXT,
          certificate_type TEXT NOT NULL,
          metadata TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }

  public run(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  public get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  public all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const db = new Database();
