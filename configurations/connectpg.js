// postgres.js
require('dotenv').config()

const {Pool}=require('pg')
const poolConfig={
  max:5,
  min:2,
  idleTimeoutMillis:600000
}

const userName= process.env.PGUSERNAME
const host= process.env.PGHOST
const database= process.env.PGDBNAME
const password=process.env.PGPASSWORD
const port= process.env.PGPORT

poolConfig.connectionString=`postgres://${userName}:${password}@${host}:${port}/${database}`;

const connectDB = async () => {
  console.log(userName)
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
