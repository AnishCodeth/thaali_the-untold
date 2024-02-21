
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");
const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const { delete_query } = require("../crud_query/delete");


const display_order = noTryCatch(async (req, res) => {
  const where_conditions = ["b_id",'r_username'];
  const order_conditions = ['o_time',"quantity"];
  req.query.r_username=req.user.username
  const {query,values}=await display_query('food_order',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  return res.json(pgres.rows);

});

const delete_order=noTryCatch((async(req,res)=>{
  const where_conditions = ["b_id"];
  const {b_id}=req.body;
  const client=await connectDB()
  const {query,values}=await delete_query('food_order',where_conditions,{b_id})
  const pgres=await client.query(
      query,values
        );
        console.log({b_id})
  if(pgres.rowCount==0)
  return res.json({"msg":"data not found!!"})
  res.json({"msg":"delete successfull"})
}));






module.exports = {display_order,delete_order};
