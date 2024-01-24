const jwt=require('jsonwebtoken')


const createJWT=(data,expire,which)=>{
if(which=='access')
return jwt.sign(data,process.env.JWT_SECRET,expire)
else if(which=='register')
return jwt.sign(data,token,process.env.JWT_REGISTER,expire)
else
return jwt.sign(data,process.env.JWT_REFRESH_SECRET)
}

const decodeJWT= (token,which)=>{
if(which=='access')
return jwt.verify(token,process.env.JWT_SECRET)
else if(which=='register')
return jwt.verify(token,process.env.JWT_REGISTER)
else
return jwt.verify(token,process.env.JWT_REFRESH_SECRET)
}


module.exports={createJWT,
    decodeJWT}