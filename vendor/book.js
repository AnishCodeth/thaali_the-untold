const { connectDB } = require("../configurations/connectpg");
const { add_query } = require("../crud_query/add");
const { delete_query } = require("../crud_query/delete");
const { display_query } = require("../crud_query/display");
const { decodeJWT, createJWT } = require("../functions/createJWT");
const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");

const delete_book=noTryCatch((async(req,res)=>{
    const where_conditions = ["id"];
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
  
module.exports={delete_book,display_book}