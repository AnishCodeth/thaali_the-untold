const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const { update_query } = require("../crud_query/update");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const add_profile=noTryCatch(async(req,res,next)=>{
const {username}=req.user
const client=await connectDB();
await client.query(`create table if not exists customer_PROFILE(
    photo text[] not null,
    longitude numeric,
    latitude numeric,
    phone_number bigint check(phone_number/1000000000=9),
    about text,
    username varchar(100) primary key references customer_CREDENTIAL ON DELETE CASCADE on update cascade,
    id serial
)`)


const {query,values}=await add_query({...req.body,username},'customer_PROFILE')
await client.query(query,values)
res.json({"msg":'Profile added successfully'});
})

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

 const role=req.user.role;
    const where_conditions = ['id','username'];//to ensure what what can they update
    const set_conditions = ['photo','longitude','latitude','phone_number','about'];
    if(!req.body.set )
    return next(new customError('provide what to update'))
    const client=await connectDB()
    const {query,values}=await update_query(role+'_profile',set_conditions,where_conditions,req.body.set,req.body.find)
    if(values.length==0)
    return res.json({"msg":"already upto date"})
    const pgres=await client.query(
        query,values
          );
    res.json({"msg":"update successfull"})
})

const delete_profile=noTryCatch(async(req,res)=>{
    const username=req.user.username
    const delete_payload={username}
    const role=req.user.role
    const where_conditions = ["id","username"];
    const client=await connectDB()
    const {query,values}=await delete_query(role+'_profile',where_conditions,delete_payload)
    const pgres=await client.query(
        query,values
          );
    if(pgres.rowCount==0)
    return res.json({"msg":"data not found!!"})
    res.json({"msg":"delete successfull"})
})



const update_profile_photo=noTryCatch(async(req,res,next)=>{
    const oldphoto=req.body.find.photo;
    const newphoto=req.body.set.photo;
    const {username}=req.user

        if(!req.body.set )
        return next(new customError('provide what to update'))

        const client=await connectDB()
        await client.query(`update ${role}_profile set photo= ARRAY(
            SELECT CASE WHEN element = $1 THEN $2 ELSE element END
            FROM unnest(photo) AS element
        )
         where username=${username}`,[oldphoto,newphoto])
        res.json({"msg":"update successfull"})
    })
    
module.exports={add_profile,display_profile,update_profile,delete_profile}