import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { initDatabase, dbPath } from './scripts/initDatabase.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let db;

async function startServer() {
  try {
    await initDatabase();
    db = new sqlite3.Database(dbPath);
    console.log('Connected to the SQLite database.');

    // API Routes

    // Get all users with pagination
    app.get('/api/users', (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      db.all('SELECT COUNT(*) as count FROM users', [], (err, countResult) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const totalUsers = countResult[0].count;
        const totalPages = Math.ceil(totalUsers / limit);

        db.all('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({
            users: rows,
            currentPage: page,
            totalPages: totalPages,
            totalUsers: totalUsers
          });
        });
      });
    });

    // Add a new user
    app.post('/api/users', (req, res) => {
      const { name, birthDate, address, idNumber, phone, email, workUnit, position, issueDate, joinDate } = req.body;
      db.run(`INSERT INTO users (name, birthDate, address, idNumber, phone, email, workUnit, position, issueDate, joinDate) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, birthDate, address, idNumber, phone, email, workUnit, position, issueDate, joinDate],
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID });
        });
    });

    // Get all fees
    app.get('/api/fees', (req, res) => {
      db.all('SELECT fees.*, users.name as userName FROM fees JOIN users ON fees.userId = users.id', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    // Add a new fee
    app.post('/api/fees', (req, res) => {
      const { userId, amount, lastPaymentDate, status, dueDate } = req.body;
      db.run('INSERT INTO fees (userId, amount, lastPaymentDate, status, dueDate) VALUES (?, ?, ?, ?, ?)',
        [userId, amount, lastPaymentDate, status, dueDate],
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID });
        });
    });

    // Update fee status
    app.put('/api/fees/:id', (req, res) => {
      const { status, lastPaymentDate } = req.body;
      db.run('UPDATE fees SET status = ?, lastPaymentDate = ? WHERE id = ?',
        [status, lastPaymentDate, req.params.id],
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ changes: this.changes });
        });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();