const { photo_firebase_url } = require("../../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../../configurations/connectpg");
const {noTryCatch}=require('../../functions/notrycatch');
const { form_to_json } = require("../../functions/form_json");
const customError=require('../../functions/customerror');
const { add_query } = require("../../crud.js/add");

const add_order=noTryCatch(async (req,res)=>{
//to do is add triggerd function to update the orderoffood take this id and add in table on payment done store in the history
const booking_id='anish1'
req.body.booking_id=booking_id;
const table_id='table1'
req.body.table_id=table_id //table_id and booking_id must be in cookies
const to_add=req.body;

const client=await connectDB();


if((await client.query(`select * from order_data where table_id=$1 and booking_id=$2`,[table_id,booking_id])).rows.length==0)
throw new customError("Table is already booked",500)

const {query,values}=await add_query(req.body,'order_data')
await client.query(query,values)
res.json('order added successfully');
})

const display_order=noTryCatch(async(req,res)=>{
    const client=await connectDB()
    const pgres=await client.query(`
    select *
     from order_data
    order by served_status,order_time 
    `)
    res.json(pgres.rows)
})

const update_order=noTryCatch(async(req,res)=>{
    const to_update=req.body.update;
    const order_id=req.body.id;
    let values=[]
    let set_query=''
    let index=1;
    Object.keys(to_update).forEach((key)=>{
        set_query+=`${key}=$${index},`
        values.push(to_update[key])
        index++;
    })
    set_query=set_query.slice(0,-1)
    values.push(order_id)
    const client=await connectDB()

    const pgres=await client.query(`select food_name from order_data where order_id=$1`,values.slice(-1))
    if(pgres.rows.length==0)
    return res.send('not found')
    await client.query(`update order_data 
    set ${set_query}
    where order_id=$${index}`,values)
    res.send("successfully updated")
})

const delete_order=(async(req,res)=>{

  let query=''
  let where_query=`where order_id=$1`
  let values=[req.body.order_id];
  const client=await connectDB()
  const row=await client.query(`
  select food_name from order_data ${where_query} `,values)
  
  if(row.rows.length==0)
  return res.json({"msg":'no such data found to delete'});
  
  query=`delete from  order_data
  ${where_query};`
  
  const pgres=await client.query(query,values)
  res.json({'msg':'deleted successfully'})
  })
  

module.exports={add_order,display_order,update_order,delete_order}