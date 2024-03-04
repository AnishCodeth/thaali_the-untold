const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");
const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const { update_query } = require("../crud_query/update");
const { delete_query } = require("../crud_query/delete");

const add_review = noTryCatch(async (req, res,next) => {

  const client = await connectDB();
  await client.query(
    `create table  if not exists REVIEW(id serial primary key,
        r_username varchar(100) not null references vendor_profile(username) on delete cascade,
        review text not null,
        rating numeric(3,2) not null check(rating>0 and rating<=5),
        c_username varchar(100) not null references customer_CREDENTIAL(username),
        unique(r_username,c_username),
        review_time timestamptz not null default current_timestamp
        )`
  );

 const c_username=req.user.username

//   let pgres=await client.query(`select * from review where r_username=$1 and username=$2 `,[])
//   let count=pgres.rows.length
//   let pgres=await client.query(`select * from payment where r_username=$1 and username=$2 `,[req.body.r_username,req.body.username])
//   if(count>=pgres.rows.length)
//   return next(new customError('You canonly review per payment but you can update',403))

 
  const { query, values } = await add_query({c_username,...req.body}, "review");
  await client.query(query, values);
  res.status(200).json("review added successfully");
});

const display_review = noTryCatch(async (req, res,next) => {
  const where_conditions = ["r_username","id","rating",'c_username'];
  const order_conditions = ['rating'];
  const {query,values}=await display_query('review',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});

const update_review = noTryCatch(async (req, res,next) => {

  const where_conditions = ["r_username","id",'username'];//to ensure what what can they update
  const set_conditions = ['review','rating'];
  if(!req.body.find){
  req.body.find={}
  }
  req.body.find.c_username=req.user.username
  if(!req.body.set )
  return next(new customError('provide what to update'))
  const client=await connectDB()
  const {query,values}=await update_query('review',set_conditions,where_conditions,req.body.set,req.body.find)
  console.log(query,values)
  if(values.length==0)
  return res.json({"msg":"already upto date"})
  const pgres=await client.query(
      query,values
        );
  res.json({"msg":"update successfull"})
});

const delete_review = async (req, res,next) => {
  const where_conditions = ["r_username",'c_username'];
  const client=await connectDB()
  const delete_payload=req.body
  delete_payload.c_username=req.user.username
  const {query,values}=await delete_query('review',where_conditions,delete_payload)
  const pgres=await client.query(
      query,values
        );
  if(pgres.rowCount==0)
  return res.json({"msg":"data not found!!"})
  res.json({"msg":"delete successfull"})
};

module.exports = { add_review, display_review, update_review, delete_review };
