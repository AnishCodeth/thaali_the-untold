
const { StatusCodes } = require('http-status-codes')
const { noTryCatch } = require('../functions/notrycatch')
const { connectDB } = require('../configurations/connectpg')
const { decodeJWT } = require('../functions/createJWT')



const authorizemiddleware=noTryCatch( async(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]

    const {email}=decodeJWT(token,'access')
    console.log(email)

    const client=await connectDB('vendors')
    const pgres=await client.query(`select * from vendor_credentials where email = $1`,[email])
    if(pgres.rows.length==1)
    {
        console.log('auth passed');
        next()
    }
    else{
        return res.status(StatusCodes.BAD_REQUEST).json({"msg":"Logged in first!"})
    }

})

module.exports={authorizemiddleware}