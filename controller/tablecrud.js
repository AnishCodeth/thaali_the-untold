
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const {noTryCatch}=require('../functions/notrycatch');

const customError=require('../functions/customerror');
const { add_query } = require("./add");
const { decodeJWT } = require("../functions/createJWT");
const { encrypt } = require("../functions/decryptencryptpassword");

const add_table=noTryCatch(async (req,res)=>{
const client=await connectDB();
const {t_name,capacity,location}=req.body;
// const access_token=req.headers.authorization.split(' ')[1]
await client.query(` create table if not exists food_table (t_id serial,t_name varchar(100) not null,qr_code text not null unique,location text,capacity int not null,r_name varchar(100) not null,PRIMARY KEY (r_name,t_name))`)

// const {r_name}=decodeJWT(access_token,'access')||'the_chowk'
const r_name='the_chowk';
const qr_code=await encrypt(r_name+t_name)

const {query,values}=await add_query({r_name,t_name,capacity,location,qr_code},'food_table')
await client.query(query,values)
res.json('Table added successfully');
})

const display_table=noTryCatch(async(req,res)=>{
 const client=await connectDB()
 const pgres=await client.query(`select * from food_table`)
 res.json(pgres.rows)
})

const update_table=noTryCatch(async(req,res)=>{
    
})

const delete_table=noTryCatch(async(req,res)=>{
    
})

module.exports={add_table,display_table,update_table,delete_table}