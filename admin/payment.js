const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const bill=noTryCatch(async(req,res)=>{
    let food_quantity=''
    let calculated_amount=0
    const b_id=req.body.b_id;
    let pgres=(await client.query(`select menu.food_name,menu.price,food_order.quantity from food_order join menu on food_order.m_id=menu.id where food_order.b_id=$1`,[b_id])).rows
    
    pgres.forEach((row)=>{
    food_quantity+=row.food_name+'_'+row.quantity+',';
    calculated_amount+=row.quantity*row.price
    })
return res.json({"orders":pgresorder.rows,total})
})


const display_payment=noTryCatch(async(req,res)=>{
    const where_conditions = ["id","c_username","transaction_id",'payment_time','payment_method',"r_username"];
    const order_conditions = ['payment_time','transaction_id'];
    if(req.body.r_username)
    req.query.r_username=req.user.r_username
    const {query,values}=await display_query('payment',where_conditions,order_conditions,req.query)
    const client = await connectDB();
    const pgres = await client.query(
  query,values
    );
    return res.json(pgres.rows);
})






module.exports={bill,display_payment}