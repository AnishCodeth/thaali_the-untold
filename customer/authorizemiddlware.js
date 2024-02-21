const { decodeJWT } = require("../functions/createJWT")
const customError = require("../functions/customerror")
const { noTryCatch } = require("../functions/notrycatch")


const authorizemiddleware=noTryCatch( async(req,res,next)=>{
    const token=req.cookies.access_token
    if(!token)
    return res.status(402).json({"msg":"provide the token"})

    const {username,role}=decodeJWT(token,'access')
    if(role!='customer')
    return next(new customError('you are not access',401))

    req.user={username,role}
    next()
})

const bookAuthorizeMiddleware=noTryCatch( async(req,res,next)=>{
    const token=req.cookies.book_token
    if(!token)
    return res.status(402).json({"msg":"provide the token"})

    const {r_username,t_id,id}=decodeJWT(token,'book_table')

    req.book={r_username,t_id,id}
    next()
})



module.exports={authorizemiddleware,bookAuthorizeMiddleware}