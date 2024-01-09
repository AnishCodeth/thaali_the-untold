const { photo_firebase_url } = require("../../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../../configurations/connectpg");
const {noTryCatch}=require('../../functions/notrycatch');
const { form_to_json } = require("../../functions/form_json");
const customError=require('../../functions/customerror');
const { add_query } = require("../../crud.js/add");

const add_table=noTryCatch(async (req,res)=>{
//to do is add triggerd function to update the orderoffood take this id and add in table on payment done store in the history
const client=await connectDB('vendor');
await client.query(`create table if not exists table_data (table_id text primary key,qr_code text,location text,capacity int)`)
const restaurant_id='the_chowk';
const table_id=req.body.table_id;
req.body.qr_code=restaurant_id+'!'+table_id;
//qr_Code={user_name,table_id}
const {query,values}=await add_query(req.body,'table_data')
console.log(query,values)
await client.query(query,values)
res.json('Profile added successfully');
})

const display_table=noTryCatch(async(req,res)=>{

})

const update_table=noTryCatch(async(req,res)=>{
    
})

const delete_table=noTryCatch(async(req,res)=>{
    
})

module.exports={add_table,display_table,update_table,delete_table}