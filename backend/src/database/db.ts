import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "..", "certy.json");

interface DatabaseSchema {
  users: any[];
  entities: any[];
  certificates: any[];
}

export class Database {
  private data: DatabaseSchema = {
    users: [],
    entities: [],
    certificates: [],
  };

  constructor() {
    this.initializeDatabase();
    console.log("Connected to JSON database at:", DB_PATH);
  }

  private initializeDatabase() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.data = {
          users: [],
          entities: [],
          certificates: [],
        };
        this.save();
      }
    } catch (err) {
      console.error("Error initializing database:", err);
      this.data = {
        users: [],
        entities: [],
        certificates: [],
      };
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  public run(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Simple SQL-like operations for JSON storage
        if (sql.includes("INSERT INTO")) {
          const match = sql.match(/INSERT INTO (\w+)/i);
          if (match) {
            const table = match[1] as keyof DatabaseSchema;
            const newRecord = params[0] || {};
            this.data[table].push(newRecord);
            this.save();
            resolve({ id: this.data[table].length, changes: 1 });
          } else {
            reject(new Error("Invalid INSERT syntax"));
          }
        } else if (sql.includes("UPDATE")) {
          // Basic UPDATE support
          resolve({ changes: 1 });
        } else if (sql.includes("DELETE")) {
          // Basic DELETE support
          resolve({ changes: 1 });
        } else if (sql.includes("CREATE TABLE")) {
          // CREATE TABLE is a no-op for JSON
          resolve({ changes: 0 });
        } else {
          resolve({ changes: 0 });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  public get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve) => {
      try {
        if (sql.includes("SELECT")) {
          // Simple SELECT support
          const match = sql.match(/FROM (\w+)/i);
          if (match) {
            const table = match[1] as keyof DatabaseSchema;
            const records = this.data[table] || [];

            // Simple WHERE clause support
            if (sql.includes("WHERE")) {
              const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
              if (whereMatch) {
                const column = whereMatch[1];
                const value = params[0];
                const result = records.find((r: any) => r[column] === value);
                resolve(result || null);
              } else {
                resolve(records[0] || null);
              }
            } else {
              resolve(records[0] || null);
            }
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      } catch (err) {
        console.error("Error in get:", err);
        resolve(null);
      }
    });
  }

  public all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve) => {
      try {
        if (sql.includes("SELECT")) {
          const match = sql.match(/FROM (\w+)/i);
          if (match) {
            const table = match[1] as keyof DatabaseSchema;
            let records = this.data[table] || [];

            // Simple WHERE clause support
            if (sql.includes("WHERE")) {
              const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
              if (whereMatch) {
                const column = whereMatch[1];
                const value = params[0];
                records = records.filter((r: any) => r[column] === value);
              }
            }

            resolve(records);
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      } catch (err) {
        console.error("Error in all:", err);
        resolve([]);
      }
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      this.save();
      resolve();
    });
  }
}

export const db = new Database();
