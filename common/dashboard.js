const { connectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");

const menu_db=noTryCatch(async(req,res,next)=>{
const r_username=req.book.r_username;
const client=await connectDB()
const pgres=await client.query(`select distinct on (category) * from menu where r_username=$1`,[r_username])
res.status(200).json(pgres.rows)
})

const nearby=noTryCatch(async(req,res,next)=>{

})

module.exports={menu_db}