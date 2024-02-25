
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const {noTryCatch}=require('../functions/notrycatch');
const { add_query } = require("../crud_query/add");
const { update_query } = require("../crud_query/update");
const customError = require("../functions/customerror");
const { delete_query } = require("../crud_query/delete");
const { display_query } = require("../crud_query/display");


const add_menu = noTryCatch(async (req, res,next) => {
 const client=await connectDB()

  await client.query(
    
    `create table  if not exists MENU(id serial unique,
        food_name varchar(100) not null,
        category varchar(100) not null,
        discount_percentage numeric(5,2) default 0 check(discount_percentage>=0) ,
        price numeric not null check(price>0),
        available char(1) default 'Y' check (available in ('Y','N')),
        r_username varchar(100) not null references vendor_PROFILE(username) on delete cascade on update cascade,
        description text,
        photo text,
        count integer not null default 0,
        primary key(r_username,category,food_name))
        `
  );
  const { query, values } = await add_query(req.body, "MENU");
  await client.query(query, values);
  res.json("menu added successfully");
});

const display_menu = noTryCatch( async (req, res,next) => {
  const where_conditions = ["food_name","category","price","id","r_username","discount_percentage","count","r_username"];
  const order_conditions = ["food_name","category","price","id","r_username","discount_percentage","count","r_username"];
  const {query,values}=await display_query('menu',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});

const update_menu=noTryCatch(async(req,res,next)=>{
  const where_conditions = ["r_username","id","discount_percentage","food_name","price","available","category"];//to ensure what what can they update
  const set_conditions = ["discount_percentage","food_name","price","available","category"];
  if(!req.body.set || !req.body.find)
  return next(new customError('provide what to update'))
  const client=await connectDB()
  const {query,values}=await update_query('MENU',set_conditions,where_conditions,req.body.set,req.body.find)
  if(values.length==0)
  return res.json({"msg":"already upto date"})
  const pgres=await client.query(
      query,values
        );
  res.json({"msg":"update successfull"})
})

const delete_menu=noTryCatch((async(req,res,next)=>{
  const where_conditions = ["r_username","id","discount_percentage","food_name","price","available","category"];
  if(req.body)
  return next(new customError('provide what to delete',400))

  const delete_payload=req.body
  const client=await connectDB()
  const {query,values}=await delete_query('MENU',where_conditions,delete_payload)
  const pgres=await client.query(
      query,values
        );
  if(pgres.rowCount==0)
  return res.json({"msg":"data not found!!"})
  res.json({"msg":"delete successfull"})
}));

module.exports = { add_menu, display_menu,update_menu,delete_menu };
