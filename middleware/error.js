const  customError=require('../functions/customerror')


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

const error_middleware=async(err,req,res,next)=>{
console.log('inside the error',err)
if(process.env.NODE_ENV=='development'){
development(res,err)
}
else if(process.env.NODE_ENV=='production'){
if(err.name=='CastError'){//for the invalid id
    err=castErrorHandler(err)
}
else if(err.code && err.code.startsWith('23')){
    err= new customError(`${err.constraint}+'-'+${err.detail}`,500)
}
else if(err.name='TypeError')
err=new customError(`${err}`,400)
else if(err.isOperational){
   
}
else
{
    err= new customError(`${err.name}`,500)
}
production(res,err)
}
}

module.exports={error_middleware}