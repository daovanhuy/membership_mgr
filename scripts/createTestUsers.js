import sqlite3 from 'sqlite3';
import { faker } from '@faker-js/faker';

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    createTestUsers()
      .then(() => {
        console.log('50 test users with fees have been added to the database.');
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed successfully.');
          }
        });
      })
      .catch((err) => {
        console.error('Error creating test users:', err);
        db.close((closeErr) => {
          if (closeErr) {
            console.error('Error closing database:', closeErr);
          }
        });
      });
  }
});

function createTestUsers() {
  return new Promise((resolve, reject) => {
    const userStmt = db.prepare(`INSERT INTO users (name, birthDate, address, idNumber, phone, email, workUnit, position, issueDate, joinDate) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const feeStmt = db.prepare(`INSERT INTO fees (userId, amount, lastPaymentDate, status, dueDate)
                                VALUES (?, ?, ?, ?, ?)`);

    let completed = 0;
    const total = 50;

    for (let i = 0; i < total; i++) {
      const user = {
        name: faker.person.fullName(),
        birthDate: faker.date.birthdate().toISOString().split('T')[0],
        address: faker.location.streetAddress(),
        idNumber: faker.string.alphanumeric(10),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        workUnit: faker.company.name(),
        position: faker.person.jobTitle(),
        issueDate: faker.date.past().toISOString().split('T')[0],
        joinDate: faker.date.past().toISOString().split('T')[0],
      };

      userStmt.run(Object.values(user), function(err) {
        if (err) {
          reject(err);
        } else {
          const userId = this.lastID;
          const fee = {
            userId: userId,
            amount: faker.number.float({ min: 50, max: 500, multipleOf: 0.01 }),
            lastPaymentDate: faker.date.past().toISOString().split('T')[0],
            status: faker.helpers.arrayElement(['Paid', 'Pending', 'Overdue']),
            dueDate: faker.date.future().toISOString().split('T')[0],
          };

          feeStmt.run(Object.values(fee), (err) => {
            if (err) {
              reject(err);
            } else {
              completed++;
              if (completed === total) {
                userStmt.finalize();
                feeStmt.finalize();
                resolve();
              }
            }
          });
        }
      });
    }
  });
}
