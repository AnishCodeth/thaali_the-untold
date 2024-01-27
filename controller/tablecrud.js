const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");

const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const {display_query}=require("../crud_query/display")
const { decodeJWT } = require("../functions/createJWT");
const { encrypt } = require("../functions/decryptencryptpassword");
const { update_query } = require("../crud_query/update");
const { delete_query } = require("../crud_query/delete");

const add_table = noTryCatch(async (req, res) => {
  const client = await connectDB();
  const { t_name, capacity, type } = req.body;
  const r_username = req.user.username;
  await client.query(
    ` create table if not exists FOOD_TABLE (
        id serial primary key,
        t_name varchar(100) not null ,
        type varchar(100) default 'steel chair',
        qr_code text not null unique,
        capacity int not null,
        r_username varchar(100) references USER_CREDENTIAL(username) on delete cascade,
        unique(r_username,t_name))`
  );


  const qr_code = await encrypt(r_username + t_name);
  const { query, values } = await add_query(
    { r_username, t_name, capacity, qr_code, type },
    "FOOD_TABLE"
  );

  await client.query(query, values);
  res.json("Table added successfully");
});

const display_table = noTryCatch(async (req, res) => {
  const where_conditions = ["type","capacity","t_name","id","r_username",];
  const order_conditions = ["capacity", "id",'type','t_name','r_username'];
  req.query.r_username=req.body.username
  const {query,values}=await display_query('FOOD_TABLE',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});

const update_table = noTryCatch(async (req, res) => {
    req.body.find.r_username=req.user.username
    const where_conditions = ["r_username","id"];
    const set_conditions = ["capacity",'type','t_name'];
    if(!req.body.set)
    return next(new customError('provide what to update'))
    const client=await connectDB()
    const {query,values}=await update_query('FOOD_TABLE',set_conditions,where_conditions,req.body.set,req.body.find)
    if(values.length==0)
    return res.json({"msg":"already upto date"})
    const pgres=await client.query(
        query,values
          );
    res.json({"msg":"update successfull"})
});

const delete_table = noTryCatch(async (req, res) =>  {
    req.body.find.r_username=req.user.username;
    const where_conditions = ["r_username","id","type","capacity","t_name"];
    const delete_payload=req.body;
    const client=await connectDB()
    const {query,values}=await delete_query('FOOD_TABLE',where_conditions,delete_payload)
    const pgres=await client.query(
        query,values
          );
    if(pgres.rowCount==0)
    return res.json({"msg":"data not found!!"})
    res.json({"msg":"delete successfull"})
});

module.exports = { add_table, display_table, update_table, delete_table };
