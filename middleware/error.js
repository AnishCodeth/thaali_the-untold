const customError=require('../function/customerror')


const development=(res,err)=>{
    console.log("It is an development error")
    return res.status(err.statusCode||500).json({
        "status":err.statusCode,
        "message":err.message,
        "stackTrace":err.stack,
        "error":err
    })
}

const production=(res,err)=>{
    console.log("It is an production error")
    if(err.isOperational){
    return res.status(err.statusCode).json({
        "status":err.statusCode,
        "message":err.message,
    })}
    else{
        return res.status(500).json({
            status:'error',
            message:err.message
        })
    }
}

const castErrorHandler=(err)=>{
return new customError(`invalid value ${err.value} for field ${err.path}`,400)

}

const errors=async(err,req,res,next)=>{
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV=='development'){
development(res,err)
}
else if(process.env.NODE_ENV=='production'){
if(err.name=='CastError'){//for the invalid id
    err=castErrorHandler(err)
}
production(res,err)
}
}

module.exports=errors