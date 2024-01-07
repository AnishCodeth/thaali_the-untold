const noTryCatch= (func)=>{
    return  (req,res,next)=>{
    func(req,res,next).catch(err=>next(err))
    }
}

const noTRyCatchReturn=(func)=>{
return (req,res,next)=>{
    console.log('hi')
    return func(req,res,next).catch(err=>next(err))
}
}

module.exports={noTryCatch,noTRyCatchReturn}