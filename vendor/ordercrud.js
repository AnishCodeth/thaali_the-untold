
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
  const client = await connectDB();
  let b_id;
  if(req.query.t_id){
 b_id=(await client.query(`select * from food_order inner join book_status on food_order.b_id=book_status.id where book_status.t_id=$1`,[req.query.t_id])).rows[0].b_id
 req.query.b_id=b_id;
  }
  const {query,values}=await display_query('food_order',where_conditions,order_conditions,req.query)

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


const update_order=noTryCatch(async(req,res,next)=>{
  const where_conditions = ["b_id",'id','served','r_username'];//to ensure what what can they update
  const set_conditions = ['served'];
  if(!req.body.set )
  return next(new customError('provide what to update'))
  const client=await connectDB()
  const {query,values}=await update_query('food_order',set_conditions,where_conditions,req.body.set,req.body.find)
  if(values.length==0)
  return res.json({"msg":"already upto date"})
  const pgres=await client.query(
      query,values
        );
  res.json({"msg":"update successfull"})
});






module.exports = {display_order,delete_order,update_order};
