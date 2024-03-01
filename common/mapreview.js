const { noTryCatch } = require("../functions/notrycatch");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { display_query } = require("../crud_query/display");


const allvendordata=noTryCatch(async(req,res,next)=>{
    const where_conditions = ['username','id'];
    const order_conditions=[]
    const role='vendor';
    const {query,values}=await display_query(role+'_profile',where_conditions,order_conditions,req.body)
    const client = await connectDB();
    const pgres = await client.query(
  query,values
    );
    res.json(pgres.rows);
})

module.exports={allvendordata}