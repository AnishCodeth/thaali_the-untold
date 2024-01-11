// postgres.js

const { Client } = require('pg');



const connectDB = async (db_name) => {
  db_name= db_name||'vendor'
  console.log(db_name)
  const client = new Client({
    user: 'postgres',
    host: process.env.PGHOST,
    database: db_name,
    password:process.env.PGPASSWORD,
    port: process.env.PGPORT,
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
