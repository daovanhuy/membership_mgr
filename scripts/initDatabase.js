import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'database.sqlite');

function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database', err);
        reject(err);
        return;
      }
      console.log('Connected to the SQLite database.');
      
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          birthDate TEXT,
          address TEXT,
          idNumber TEXT,
          phone TEXT,
          email TEXT,
          workUnit TEXT,
          position TEXT,
          issueDate TEXT,
          joinDate TEXT
        )`, (err) => {
          if (err) {
            console.error('Error creating users table:', err);
          } else {
            console.log('Users table created successfully.');
          }
        });

        db.run(`CREATE TABLE IF NOT EXISTS fees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          amount REAL,
          lastPaymentDate TEXT,
          status TEXT,
          dueDate TEXT,
          FOREIGN KEY(userId) REFERENCES users(id)
        )`, (err) => {
          if (err) {
            console.error('Error creating fees table:', err);
          } else {
            console.log('Fees table created successfully.');
          }
        });

        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
            reject(err);
          } else {
            console.log('Database connection closed.');
            resolve();
          }
        });
      });
    });
  });
}

export { initDatabase, dbPath };