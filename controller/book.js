const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { decodeJWT, createJWT } = require("../functions/createJWT");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");

const add_book_table=noTryCatch(async(req,res,next)=>{
const client=await connectDB()
const username=req.user.username;//change
const qr=req.body.qr_code;
let pgres=await client.query(`select * from FOOD_TABLE where qr_code=$1`,[qr])
if(pgres.rows.length==0)
return next(new customError('not valid qr',404))

const {id:t_id,r_username}=pgres.rows[0]
await client.query(`delete from book_status;create table if not exists book_status( id serial primary key,
                   r_username varchar(100) not null references PROFILE(username),
                   t_id int not null references FOOD_TABLE(id),
                   username varchar(100) not null references USER_CREDENTIAL(username),
                   unique(r_username,t_id))
                   `)

const {query,values}=await add_query({r_username,t_id,username},'BOOK_STATUS')
 pgres=await client.query(query,values)
 pgres=await client.query(`select * from book_status where r_username=$1 and t_id=$2 and username=$3`,[r_username,t_id,username])
const id=pgres.rows[0].id
const token=createJWT({id,r_username,t_id,username},{expiresIn:'1yr'},'book_table')
res.cookie("book_token", token, { httpOnly: true });
res.status(200).json({"msg":"table is booked"})
})

const display_book_table=noTryCatch(async(req,res)=>{
    //only via vendor
    const client=await connectDB()

   const pgres=await client.query('select * from book_status')

    res.json(pgres.rows)
    })

const delete_book_table=noTryCatch(async(req,res)=>{
   // const {b_id}=req.cookies;
    const b_id=req.body;
    const client=await connectDB()
    
    let pgres=await client.query(`delete from book where id=$1`,[b_id])
    res.json({"msg":'deleted successfully'})
    })

module.exports={add_book_table,display_book_table,delete_book_table}