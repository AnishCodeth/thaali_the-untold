const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { delete_query } = require("../crud_query/delete");
const { display_query } = require("../crud_query/display");
const { decodeJWT, createJWT } = require("../functions/createJWT");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");

const delete_book=noTryCatch((async(req,res)=>{
    const where_conditions = ["id",];
    const {b_id:id}=req.body;
    const client=await connectDB()
    const {query,values}=await delete_query('book_status',where_conditions,{id})
    const pgres=await client.query(
        query,values
          );

    if(pgres.rowCount==0)
    return res.json({"msg":"data not found!!"})
    res.json({"msg":"delete successfull"})
  }));
  

  const display_book = noTryCatch(async (req, res) => {
    const where_conditions = ["id","r_username"];
    const order_conditions = ['b_time'];
    const r_username=req.user.username;
    const {query,values}=await display_query('book_status',where_conditions,order_conditions,{r_username,...req.query})
    const client = await connectDB();
    const pgres = await client.query(
  query,values
    );
    return res.json(pgres.rows);
  
  });
  

const add_book=noTryCatch(async(req,res,next)=>{
const client=await connectDB()
const c_username=req.user.username;
const qr=req.body.qr_code;
let pgres=await client.query(`select * from FOOD_TABLE where qr_code=$1`,[qr])
if(pgres.rows.length==0)
return next(new customError('not valid qr',404))

const {id:t_id,r_username}=pgres.rows[0]
await client.query(`create table if not exists book_status( id serial primary key,
                   r_username varchar(100) not null references vendor_PROFILE(username),
                   t_id int not null references FOOD_TABLE(id),
                   c_username varchar(100) not null references customer_CREDENTIAL(username) on delete cascade,
                   facility text[],
                   b_time timestamptz not null default current_timestamp,
                   unique(r_username,t_id));
                   `)


pgres=await client.query(`select * from book_status where  c_username=$1 and t_id=$2`,[req.user.username,t_id])
if(pgres.rows.length==1)
{
    console.log('hi')
    const id=pgres.rows[0].id
    const r_username=pgres.rows[0].r_username
    const token=createJWT({id,r_username,t_id},{expiresIn:'1yr'},'book_table')
    res.cookie("book_token", token, { httpOnly: true });
    return res.status(200).json({"msg":"booking session is renewed"})
}

const {query,values}=await add_query({r_username,t_id,c_username},'BOOK_STATUS')
 pgres=await client.query(query,values)

 pgres=await client.query(`select * from book_status where r_username=$1 and c_username=$2`,[r_username,c_username])
const id=pgres.rows[0].id
const token=createJWT({id,r_username,t_id},{expiresIn:'1yr'},'book_table')
res.cookie("book_token", token, { httpOnly: true });
res.status(200).json({"msg":"table is booked"})
})

const add_facility=noTryCatch(async(req,res,next)=>{
    const {facility}=req.body
    if(!facility)
    return next(new customError('facility is null',400))
    const id=req.book.id;
    const client=await connectDB();
    await client.query(`UPDATE book_status
    SET facility= ARRAY_APPEND(facility, $1)
    WHERE id=$2`,[facility,id])

    res.json({"msg":facility+' added successfully'});
    })

module.exports={delete_book,display_book,add_book,add_facility}