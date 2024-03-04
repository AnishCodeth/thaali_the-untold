
const { noTryCatch } = require("../functions/notrycatch");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { encrypt, matched } = require("../functions/decryptencryptpassword");
const { StatusCodes } = require("http-status-codes");
const { createcode } = require("../functions/createcode");
const { createJWT, decodeJWT } = require("../functions/createJWT");
const customError = require("../functions/customerror");
const { sendmail } = require("../functions/nodemailer");
const { add_query } = require("../crud_query/add");


const pendingRequest=noTryCatch(async(req,res,next)=>{
    const role='vendor';
    const client=await connectDB();
    const pgres=await client.query(`select * from ${role}_credential where verified='pending'`)
    return res.status(200).json(pgres.rows)
  })

  module.exports={pendingRequest}