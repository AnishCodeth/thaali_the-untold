// postgres.js
require('dotenv').config()

const {Pool}=require('pg')


const connectDB = async () => {
  const poolConfig={
    max:5,
    min:2,
    idleTimeoutMillis:600000
  }
  
  const userName= process.env.PG_USERNAME
  const host= process.env.PG_HOST
  const database= process.env.PG_DATABASE
  const password=process.env.PG_PASSWORD
  const port= process.env.PG_PORT
  
  poolConfig.connectionString=`postgres://${userName}:${password}@${host}:${port}/${database}`;
return new Pool(poolConfig)
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
