const { photo_firebase_url } = require("../../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../../configurations/connectpg");
const {noTryCatch}=require('../../functions/notrycatch');

const display_order_history=noTryCatch(async(req,res)=>{
    const client=await connectDB()
    const pgres=await client.query(`
    select *
     from order_data
    order by served_status,order_time 
    `)
    res.json(pgres.rows)
})

module.exports={display_order_history}