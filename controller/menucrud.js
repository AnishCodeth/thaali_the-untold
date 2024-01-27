const { photo_firebase_url } = require("../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const {noTryCatch}=require('../functions/notrycatch');
const { form_to_json } = require("../functions/form_json");
const { add_query } = require("../crud_query/add");
const { update_query } = require("../crud_query/update");
const customError = require("../functions/customerror");
const { delete_query } = require("../crud_query/delete");


const menu_add = noTryCatch(async (req, res) => {
  req.body.r_username=req.user.username;
 const client=await connectDB()

  await client.query(
    `create table  if not exists MENU(id serial,
        food_name varchar(100) not null,
        category varchar(100) not null,
        discount_percentage numeric(5,2) default 0 check(discount_percentage>=0) ,
        price numeric not null check(price>0),
        available char(1) check (available in ('Y','N')),
        r_username varchar(100) not null references PROFILE(username) on delete cascade,
        description text,
        photo text,
        primary key(r_username,category,food_name))
        `
  );
  const { query, values } = await add_query(req.body, "MENU");
  console.log(query,values)
  await client.query(query, values);
  res.json("menu added successfully");
});

const menu_display = async (req, res) => {
  console.log('in menu')
  //vendor must be send in url
  const {query}=req
  let query_sql = `select * from (select * from menu where restaurant_id=1) where 1=1`;//restaurant_id=sth
  try {
    const client = await connectDB();
    if ("category" in query) {
      query_sql += ` AND category ~ '^${query.category}'`; 
    }

    if ("food_name" in query) {
      query_sql += ` AND food_name ~ '^${query.food_name}'`;
    }

    if ("price_eq" in query) {
      query_sql += ` AND price=${parseInt(query.price_eq)}`; 
    }

    if ("price_lt" in query) {
      query_sql += ` AND price<${parseInt(query.price_lt)}`; 
    }

    if ("price_gt" in query) {
      query_sql += ` AND price>${parseInt(query.price_gt)}`; 
    }

    if ("discount_percentage_eq" in query) {
      query_sql += ` AND discount_percentage=${parseInt(query.discount_percentage_eq)}`; 
    }

    if ("discount_percentage_lt" in query) {
      query_sql += ` AND discount_percentage<${parseInt(query.discount_percentage_lt)}`; 
    }

    if ("discount_percentage_gt" in query) {
      query_sql += ` AND discount_percentage>${parseInt(query.discount_percentage_gt)}`; 
    }

    if ("available" in query) {
      query_sql += ` AND available=${Boolean(query.available)}`; 
    }

    if ("sort" in query) {
      query_sql += ` ORDER BY ${query.sort}`;//front must use , as price desc,.. 
    }else {
      // query_sql += " ORDER BY order_last_7_days"; 
    }
    const pgres = await client.query(query_sql);
   console.log(pgres.rows[0].price+1)
    res.json(pgres.rows);
  } catch (err) {
    res.json(err.message);
  }
};

const menu_update=noTryCatch(async(req,res,next)=>{
  req.body.find.r_username=req.user.username
  const where_conditions = ["r_username","id","discount_percentage","food_name","price","available","category"];//to ensure what what can they update
  const set_conditions = ["discount_percentage","food_name","price","available","category"];
  if(!req.body.set )
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

const menu_delete=(async(req,res)=>{
  req.body.r_username=req.user.username;
  const where_conditions = ["r_username","id","discount_percentage","food_name","price","available","category"];
  const delete_payload=req.body
  const client=await connectDB()
  const {query,values}=await delete_query('MENU',where_conditions,delete_payload)
  const pgres=await client.query(
      query,values
        );
  if(pgres.rowCount==0)
  return res.json({"msg":"data not found!!"})
  res.json({"msg":"delete successfull"})
})

module.exports = { menu_add, menu_display,menu_update,menu_delete };
