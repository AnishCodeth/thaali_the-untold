const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const bill=noTryCatch(async(req,res)=>{
    let food_quantity=''
    let calculated_amount=0
    const b_id=req.book.id;
    const client=await connectDB();
    let pgres=(await client.query(`select menu.food_name,menu.price,food_order.quantity from food_order join menu on food_order.m_id=menu.id where food_order.b_id=$1`,[b_id])).rows
    
    pgres.forEach((row)=>{
    food_quantity+=row.food_name+'_'+row.quantity+'_'+row.price+',';
    calculated_amount+=row.quantity*row.price
    })
return res.json({"orders":food_quantity,total:calculated_amount})
})

const add_payment=noTryCatch(async(req,res)=>{
const c_username=req.user.username;
const r_username=req.book.r_username
const b_id=req.book.id
const client=await connectDB();
await client.query(`create table if not exists payment( id serial primary key,
    r_username text not null references vendor_profile(username) on delete cascade,
    c_username text not null references customer_credential(username) on delete cascade,
    food_quantity text,
    phone_number bigint ,
    transaction_id text,
    amount numeric,
    calculated_amount numeric,
    payment_time timestamptz default current_timestamp,
    payment_method varchar(50) not null default 'khalti',
    description text)`)

let food_quantity=''
let calculated_amount=0
let pgres=(await client.query(`select menu.category,menu.food_name,menu.price,food_order.quantity from food_order join menu on food_order.m_id=menu.id where food_order.b_id=$1`,[b_id])).rows

pgres.forEach((row)=>{
food_quantity+=row.food_name+'_'+row.quantity+',';
calculated_amount+=row.quantity*row.price
})
console.log(food_quantity,calculated_amount)
const {query,values}=await add_query({...req.body,c_username,r_username,food_quantity,calculated_amount},'payment')
console.log(query,values)
await client.query(query,values)
res.json({"msg":"payment stored!"});
})



const display_payment=noTryCatch(async(req,res)=>{
    const where_conditions = ["id","c_username","transaction_id",'payment_time','payment_method',"r_username"];
    const order_conditions = ['payment_time','transaction_id'];
    if(req.body.r_username)
    req.query.r_username=req.body.r_username

    req.query.c_username=req.user.username
    const {query,values}=await display_query('payment',where_conditions,order_conditions,req.query)
    const client = await connectDB();
    const pgres = await client.query(
  query,values
    );
    return res.json(pgres.rows);
})





module.exports={bill,add_payment,display_payment}