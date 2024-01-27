const { noTryCatch } = require("../functions/notrycatch");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { encrypt, matched } = require("../functions/decryptencryptpassword");
const { StatusCodes } = require("http-status-codes");
const { createcode } = require("../functions/createcode");
const { createJWT, decodeJWT } = require("../functions/createJWT");
const customError = require("../functions/customerror");
const { sendmail } = require("../functions/nodemailer");
const { add_query } = require("../crud_query/add");

const roleRequestController = noTryCatch(async (req, res,next) => {
  //in req.body in auth middleware add this
  const username=req.body.username
  console.log(username)
    const client = await connectDB();
    let pgres=await client.query(`select * from PROFILE where username=$1`,[username])
    console.log(pgres.rows)
    if(pgres.rows.length==0 || ((Object.values(pgres.rows[0])).map((a1)=>a1==null)).includes(true))
    return next(new customError("please fill vendor profile first",404))

    await client.query(`CREATE TABLE IF NOT EXISTS ROLE_CREDENTIAL (
     role varchar(8) check (role in  ('admin','customer','vendor')),
      username varchar(100) primary key references USER_CREDENTIAL(username) on delete cascade,
      request_time timestamptz default current_timestamp, 
      id serial 
  );`)
  const { query, values } = await add_query(req.body, "ROLE_CREDENTIAL");
  await client.query(query, values);
  res.status(StatusCodes.OK).json({"msg":"request has been sent"})
});

const roleDisplayController=noTryCatch(async (req, res) => {
  const page=req.query.page||1
  const limit=req.body.limit||10
  const offset=(page-1)*limit
  const client = await connectDB();
const pgres=await client.query(`select * form ROLE_CREDENTIAL  order by request_time offset $1 limit $2`,[offset,limit])
res.status(StatusCodes.OK).json({"msg":"request has been sent"})
});

const roleChangeController=noTryCatch(async(req,res)=>{
 const msg=req.message;
  const username=req.body//on req.body
  const role=req.body.role || 'CUSTOMER'
  const client=await connectDB()
  let pgres=await client.query('select * from USER_CREDENTIAL  where username=$1',[username])
  if(pgres.rows.length==0)
  return  new customError('data not found',404)
  let payload=pgres.rows[0]
  delete payload.id
  await client.query('update USER_CREDENTIAL set role=$1 where username=$2',[role,username])
  await sendmail(payload.email,'You are verified to access to vendor account')
  return res.StatusCodes(500).json({"msg":msg||"Role has been changed"})
})


module.exports={roleRequestController,roleDisplayController,roleChangeController}