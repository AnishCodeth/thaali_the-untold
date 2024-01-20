// postgres.js

const { Client } = require('pg');



const connectDB = async () => {
  const client = new Client({
    user: 'postgres',
    host: process.env.PGHOST,
    database: process.env.PGDBNAME,
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
