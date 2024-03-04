const { decodeJWT } = require("../functions/createJWT")
const customError = require("../functions/customerror")
const { noTryCatch } = require("../functions/notrycatch")


const authorizemiddleware=noTryCatch( async(req,res,next)=>{
    const token=req.cookies.access_token
    if(!token)
    return res.status(402).json({"msg":"provide the token"})

    const {username,role}=decodeJWT(token,'access')
    if(role!='admin'){
        console.log(role)
    return next(new customError('you are not access',401))
    }

    req.user={username,role}
    next()
})



module.exports={authorizemiddleware}