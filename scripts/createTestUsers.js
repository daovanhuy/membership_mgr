import sqlite3 from 'sqlite3';
import { faker } from '@faker-js/faker';

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    createTestUsers();
  }
});

function createTestUsers() {
  const stmt = db.prepare(`INSERT INTO users (name, birthDate, address, idNumber, phone, email, workUnit, position, issueDate, joinDate) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  for (let i = 0; i < 50; i++) {
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

    stmt.run(Object.values(user), (err) => {
      if (err) {
        console.error('Error inserting test user:', err);
      }
    });
  }

  stmt.finalize();

  console.log('50 test users have been added to the database.');
  db.close();
}