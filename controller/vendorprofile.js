const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("./add");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const vendorprofileadd=noTryCatch(async(req,res)=>{
const client=await connectDB('vendors');
req.body.latitude=req.body.latitude&&req.body.latitude*req.body.latitude
req.body.longitude=req.body.longitude&&req.body.longitude*req.body.longitude
if((await client.query(`select * from vendor_profile where email=$1`,[req.body.email])).rows.length!=0)
throw new customError("already registerd",500)

const {query,values}=await add_query(req.body,'vendor_profile')
console.log(query,values)
await client.query(query,values)
res.json('Profile added successfully');
})

const vendorprofiledisplay=noTryCatch(async(req,res)=>{

})

const vendorprofileUpdate=noTryCatch(async(req,res)=>{

})

const vendorprofiledelete=noTryCatch(async(req,res)=>{

})

module.exports={vendorprofileadd,vendorprofiledisplay,vendorprofileUpdate,vendorprofiledelete}