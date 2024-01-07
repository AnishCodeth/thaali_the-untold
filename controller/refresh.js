
const { StatusCodes } = require('http-status-codes')
const { noTryCatch } = require('../functions/notrycatch')
const { connectDB } = require('../configurations/connectpg')
const { decodeJWT, createJWT } = require('../functions/JWT/createJWT')


const refresh=noTryCatch( async(req,res)=>{
    const token=req.cookies.refresh_token;
    console.log(req.cookies)
    const {email}=decodeJWT(token,'refresh')
    console.log(email) 
    const access_token=createJWT({email},{expiresIn:'1d'},'access')
    res.json({access_token})
})

module.exports={refresh}