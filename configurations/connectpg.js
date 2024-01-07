// postgres.js

const { Client } = require('pg');



const connectDB = async (db_name) => {
  db_name= db_name||'vendor'
  console.log(db_name)
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: db_name,
    password: 'sql333',
    port: 5432,
  });
  try {
    if (!client._connected) {
      await client.connect();
      console.log('Connected to PostgreSQL');
    }
    return client;
  } catch (error) {
    throw new Error('Error connecting to PostgreSQL: ' + error.message);
  }
};

const disconnectDB = async () => {
  try {
    if (client._connected) {
      await client.end();
      console.log('Disconnected from PostgreSQL');
      
    }
  } catch (error) {
    throw new Error('Error disconnecting from PostgreSQL: ' + error.message);
  }
};

module.exports = { connectDB, disconnectDB };
