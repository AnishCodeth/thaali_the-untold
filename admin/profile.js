const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const { update_query } = require("../crud_query/update");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");



const display_profile=noTryCatch(async(req,res)=>{
    const where_conditions = ['username','id'];
    const order_conditions=[]
    req.query.username=req.user.username
    const role=req.user.role;
    const {query,values}=await display_query(role+'_profile',where_conditions,order_conditions,req.query)
    const client = await connectDB();
    const pgres = await client.query(
  query,values
    );
    res.json(pgres.rows);
})

const update_profile=noTryCatch(async(req,res,next)=>{
    if(req.body.find)
    req.body.find.username=req.user.username
else
req.body.find={username:req.user.username}

if(!req.body.set )
return next(new customError('provide what to update'))
if(req.body.find.photo || req.body.set.photo)
return next(new customError('Unable to update photo on this endpoint'))

 const role=req.user.role;
    const where_conditions = ['id','username'];//to ensure what what can they update
    const set_conditions = ['photo','longitude','latitude','phone_number','about'];

    const client=await connectDB()
    const {query,values}=await update_query(role+'_profile',set_conditions,where_conditions,req.body.set,req.body.find)
    if(values.length==0)
    return res.json({"msg":"already upto date"})
    const pgres=await client.query(
        query,values
          );
    res.json({"msg":"update successfull"})
})

    
module.exports={display_profile,update_profile}