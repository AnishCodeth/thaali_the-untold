
const { StatusCodes } = require('http-status-codes')
const { noTryCatch } = require('../functions/notrycatch')
const { connectDB } = require('../configurations/connectpg')
const { decodeJWT } = require('../functions/createJWT')



const authorizemiddleware=noTryCatch( async(req,res,next)=>{
    
    const {path,method}=req
    if(['/login','/register','/resetpassword'].includes(path))
    return next()
    const pm=path+'_'+method;
    const token=req.headers.authorization&&req.headers.authorization.split(' ')[1]
    if(!token)
    return res.status(402).json({"msg":"provide the token"})

    const customerAuthority=['/role_PATCH','/role_GET']
    const vendorAuthority=['/role_PATCH','/role_GET']
    const {username,role}=decodeJWT(token,'access')
    req.user={}
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
    req.user[`username`]=username
    console.log(req.user)
    next()
    // const client=await connectDB()
    // const pgres=await client.query(`select * from USER_CREDENTIAL where username = $1`,[username])
    // if(pgres.rows.length==1)
    // {
    //     console.log('auth passed');
    //     next()
    // }
    // else{
    //     return res.status(StatusCodes.BAD_REQUEST).json({"msg":"Logged in first!"})
    // }
})

const bookauthorizemiddlware=noTryCatch(async(req,res,next)=>{
const token=req.cookies.book_token
const {id,r_username,t_id,username}=decodeJWT(token,'book_table')
req.book={id,r_username,t_id,username}
next()
})

module.exports={authorizemiddleware,bookauthorizemiddlware}