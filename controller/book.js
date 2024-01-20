const { connectDB } = require("../configurations/connectpg");
const { decodeJWT } = require("../functions/createJWT");
const { noTryCatch } = require("../functions/notrycatch");

const add_book_table=noTryCatch(async(req,res)=>{
const client=await connectDB()
//references food_table(table_id)
const qr=req.body.qr;
const access_token=req.header.authorization.split(' ')[1]
const {c_name}=decodeJWT(access_token,'access');
const {r_name,id:t_id}=await client.query('select (r_id,id) from food_table where qr=$1',[qr])

await client.query(`create table  if not exists book (id serial not null,r_name varchar(100) not null,c_name varchar(100) not null,t_id int ,b_time timestampz default current_timestamp,primary key(r_name,c_name,t_id))`)
const {query,values}=await add_query({qr,c_name,r_name,t_id},'book')
await client.query(query,values)
res.json({"msg":"table booked successfullt"})
})

const display_book_table=noTryCatch(async(req,res)=>{
    //only via vendor
    const {id}=req.query
    const client=await connectDB()
    let pgres;
    if(id)
    pgres=await client.query('select * from book where id=$1',[id])
   else
   pgres=await client.query('select * from book')

    res.json(pgres.rows)
    })

const delete_book_table=noTryCatch(async(req,res)=>{
   // const {b_id}=req.cookies;
    const b_id='book1'
    const client=await connectDB()
    
    let pgres=await client.query(`delete from book where id=$1`,[b_id])
    //,yopu have to find in pgres deleted ok then send message according to that
    res.json({"msg":pgres})
    })

module.exports={add_book_table,display_book_table,delete_book_table}