const { photo_firebase_url } = require("../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");
const { form_to_json } = require("../functions/form_json");
const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");

const add_order = noTryCatch(async (req, res) => {
  const client = await connectDB();
  //there will be some function regarding saving from adding order by another people
  // const b_id=req.cookies.b_id
  await client.query(`drop table  if exists food_order`);
  await client.query(
    `create table  if not exists food_order(id serial primary key,
        b_id int not null references book_status(id) on delete cascade ,
        food_name varchar(100) not null,
        quantity int not null default 1 check (quantity>0) ,
        served char(1) default 'N' check (served in ('Y','N')),
        o_time timestamptz  not null default current_timestamp ,
        r_username varchar(100) not null references profile(username) on delete cascade,
        t_id int not null references food_table(id),
        description text)`
  );
 
  req.body.b_id =req.book.id;
  req.body.r_username=req.book.r_username;
  req.body.t_id=req.book.t_id;
  const { query, values } = await add_query(req.body, "food_order");
  await client.query(query, values);
  res.json("order added successfully");
});

const display_order = noTryCatch(async (req, res) => {
  const where_conditions = ["t_name","b_id","r_username",'served'];
  const order_conditions = ['o_time'];
  req.query.r_username=req.user.username
  const {query,values}=await display_query('food_order',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});

const update_order = noTryCatch(async (req, res) => {
  req.body.find.r_username=req.user.username
  const where_conditions = ["t_name","b_id","r_username",'served'];//to ensure what what can they update
  const set_conditions = ['served','food_name','quantity','description'];
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
});

const delete_order = async (req, res) => {
  req.body.find.r_username=req.user.username;
  const where_conditions = ["t_name","b_id","r_username",'served'];
  const client=await connectDB()
  const delete_payload=req.body
  const {query,values}=await delete_query('FOOD_TABLE',where_conditions,delete_payload)
  const pgres=await client.query(
      query,values
        );
  if(pgres.rowCount==0)
  return res.json({"msg":"data not found!!"})
  res.json({"msg":"delete successfull"})
};

module.exports = { add_order, display_order, update_order, delete_order };
