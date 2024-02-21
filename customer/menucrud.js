
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const {noTryCatch}=require('../functions/notrycatch');

const { display_query } = require("../crud_query/display");

const display_menu = noTryCatch(async (req, res) => {
  const where_conditions = ["food_name","category","price","id","r_username","discount_percentage","count"];
  const order_conditions = ["food_name","category","price","id","r_username","discount_percentage","count"];
  req.query.r_username=req.book.r_username;
  const {query,values}=await display_query('menu',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});



module.exports = { display_menu};
