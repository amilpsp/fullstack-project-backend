import * as sqlite from 'sqlite';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

let database: Database;

export const startDatabase = async () => {
  if (!database) {
    database = await sqlite.open({
      driver: sqlite3.Database,
      filename: 'database.sqlite',
    });

    await database.run('PRAGMA foreign_keys = ON');

    console.log('Database ready');
  }

  return database;
};

export const getDatabase = () => {
  if (!database) {
    throw new Error('Database not started. Call startDatabase first.');
  }
  return database;
};
