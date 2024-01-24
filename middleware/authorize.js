
const { StatusCodes } = require('http-status-codes')
const { noTryCatch } = require('../functions/notrycatch')
const { connectDB } = require('../configurations/connectpg')
const { decodeJWT } = require('../functions/createJWT')



const authorizemiddleware=noTryCatch( async(req,res,next)=>{
    
    const {path,method}=req
    console.log(path)
    if(['/login','/register','/resetpassword'].includes(path))
    return next()
    const pm=path+'_'+method;
    const token=req.headers.authorization.split(' ')[1]
    const customerAuthority=['/role_PATCH','/role_GET']
    const vendorAuthority=['/role_PATCH','/role_GET']
    const {username,role}=decodeJWT(token,'access')
    switch(role){
        case 'admin':
            break;
        case 'customer':
            if(customerAuthority.includes(pm))
            return res.status(StatusCodes.BAD_REQUEST).json({"msg":"You cannot access"})
            break
        case 'vendor':
            if(vendorAuthority.includes(pm))
            return res.status(StatusCodes.BAD_REQUEST).json({"msg":"You cannot access"})
            break
        default:
            break;
    }
    const client=await connectDB()
    const pgres=await client.query(`select * from USER_CREDENTIAL where username = $1`,[username])
    if(pgres.rows.length==1)
    {
        console.log('auth passed');
        req.body.username=username
        next()
    }
    else{
        return res.status(StatusCodes.BAD_REQUEST).json({"msg":"Logged in first!"})
    }
})

module.exports={authorizemiddleware}