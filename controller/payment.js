const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const getbill=noTryCatch(async(req,res)=>{
const booking_id=req.book.id;
const client=await connectDB();
console.log(booking_id)
const pgresorder=await client.query(`SELECT food_order.food_name,quantity,quantity*price as amount
FROM food_order
join menu
on (food_order.food_name,food_order.r_username)=(menu.food_name,menu.r_username)
WHERE b_id = $1;`,[booking_id])

let total=0;
pgresorder.rows.forEach((row)=>{total+=parseFloat(row.amount)})
return res.json({"orders":pgresorder.rows,total})
})

const paymentadd=noTryCatch(async(req,res)=>{
// const {b_id}=req.cookies;
const b_id=req.book.b_id;
const client=await connectDB();
await client.query(`create table if not exists payment( id serial,
    t_id int not null,
    b_id int not null,
    food_quantity text,
    phone_number bigint not null,
    transaction_id text,
    amount numeric,
    calculated_amount numeric,
    payment_time timestamptz default current_timestamp,
    payment_method varchar(50) not null default 'khalti',
    description text,primary key(transaction_id,payment_method))`)

let pgres=await client.query(`SELECT STRING_AGG(CONCAT(food_order.food_name, '*', quantity, ','), '') AS food_quantity,sum(quantity*price) as total
FROM food_order
join menu
on (food_order.food_name,food_order.r_username)=(menu.food_name,menu.r_username)
WHERE b_id =$1;`,[b_id])

let {food_quantity,total}=pgres.rows[0]
req.body.food_quantity=food_quantity,
req.body.calculated_amount=total;

console.log(food_quantity,total)
const {query,values}=await add_query(req.body,'payment')
console.log(query,values)
await client.query(query,values)
res.json({"msg":"payment stored!"});
})



const paymentdisplay=noTryCatch(async(req,res)=>{

})

const paymentUpdate=noTryCatch(async(req,res)=>{

})

const paymentdelete=noTryCatch(async(req,res)=>{

})

const verifypayment=noTryCatch(async(req,res)=>{
    const b_id=req.book.id;
    const verified=req.body.verified;
    if(verified){
    await client.query(`delete from book_status where id=$1`,[b_id])
    res.json({"msg":"success"})
    }
    else
    {
        res.json({"msg":"first complete payment"})
    }
})

module.exports={getbill,paymentadd,paymentdisplay,paymentUpdate,paymentdelete,verifypayment}