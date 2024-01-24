const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud query/add");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const add_profile=noTryCatch(async(req,res,next)=>{
const {username}=req.body
const client=await connectDB();
await client.query(`create table if not exists PROFILE(
    photo text,
    longitude numeric,
    latitude numeric,
    phone_number bigint check(phone_number/1000000000=9),
    about text,
    username varchar(100) primary key references USER_CREDENTIAL ON DELETE CASCADE,
    id serial
)`)

if((await client.query(`select * from PROFILE where username=$1`,[username])).rows.length!=0){
console.log('hi')
return  next(new customError("already registerd",500))
}

const {query,values}=await add_query(req.body,'PROFILE')
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

module.exports={add_profile,vendorprofiledisplay,vendorprofileUpdate,vendorprofiledelete}