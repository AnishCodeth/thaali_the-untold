const { connectDB } = require("../../configurations/connectpg");
const { add_query } = require("../../crud.js/add");
const customError = require("../../functions/customerror");
const { noTryCatch } = require("../../functions/notrycatch");


const getbill=noTryCatch(async(req,res)=>{
const user_id='shiva';//get this from user jwt
const restaurant_id='vendor'//from qr jwt
const booking_id='anish1';//from qr jwt

const client=await connectDB(restaurant_id);
const pgresorder=await client.query(`SELECT order_data.food_name,quantity,quantity*price as amount
FROM order_data
join menu
on order_data.food_name=menu.food_name
WHERE booking_id = $1;`,[booking_id])
let total=0;
pgresorder.rows.forEach((row)=>{total+=parseFloat(row.amount)})

const clientres=await connectDB('vendors')
const pgresres=await clientres.query('select * from vendor_profile where name=$1',["the_chowk"])

return res.json({restaurant_detail:pgresres.rows[0],"orders":pgresorder.rows,total})
})

const paymentadd=noTryCatch(async(req,res)=>{
const restaurant_id='vendor'//will be get from qr code scan on decoding jwt
const table_id='table1' //on decoding
const client=await connectDB(restaurant_id);

await client.query(`create table if not exists payment( table_id text not null,booking_id text not null,food_quantity text,phone_number bigint not null,payment_token text primary key,amount numeric,calculated_amount numeric,payment_time timestamp default LOCALTIMESTAMP)`)
let pgres=await client.query(`SELECT STRING_AGG(CONCAT(order_data.food_name, '+', quantity, ','), '') AS food_quantity,sum(quantity*price) as total
FROM order_data
join menu
on order_data.food_name=menu.food_name
WHERE booking_id = 'anish1';`)
let {food_quantity,total}=pgres.rows[0]
req.body.food_quantity=food_quantity,
req.body.calculated_amount=total;

console.log(food_quantity,total)
const {query,values}=await add_query(req.body,'payment')
console.log(query,values)
await client.query(query,values)
res.json({"token_id":req.body.payment_token});
})



const paymentdisplay=noTryCatch(async(req,res)=>{

})

const paymentUpdate=noTryCatch(async(req,res)=>{

})

const paymentdelete=noTryCatch(async(req,res)=>{

})

const verifypayment=noTryCatch(async(req,res)=>{
    const booking_id='anish1'
    const verified=req.body.verified
    if(verified)
    {
    const restaurant_id='vendor'//will be get from qr code scan on decoding jwt
    const table_id='table1' //on decoding
    const client=await connectDB(restaurant_id);
    // await client.query(`create table if not exists order_history(table_id text not null,food_quantity text not null,time_min TIMESTAMP not null,time_max TIMESTAMP not null,payment_token text,primary key (table_id,time_min),booking_id text not null,phone_number bigint not null) `)
    // const paymentres=await client.query(`select *from payment where table_id=$1`,[table_id])
    // res.json(paymentres.rows[0])
    await client.query(`delete from order_data where table_id=$1`,[table_id])
    res.json({"msg":"success"})
    }
    else
    {
        res.json({"msg":"complete payment"})
    }
})

module.exports={getbill,paymentadd,paymentdisplay,paymentUpdate,paymentdelete,verifypayment}