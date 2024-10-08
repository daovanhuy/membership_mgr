import { initDatabase, dbPath } from './initDatabase.js';
import fs from 'fs/promises';

async function testDatabaseInit() {
  try {
    console.log('Starting database initialization...');
    await initDatabase();
    console.log('Database initialization completed.');

    const fileExists = await fs.access(dbPath).then(() => true).catch(() => false);
    if (fileExists) {
      console.log(`Database file created successfully at: ${dbPath}`);
    } else {
      console.error(`Database file was not created at: ${dbPath}`);
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
}

testDatabaseInit();