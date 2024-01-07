const bcrypt=require('bcrypt')
const { noTryCatch, noTRyCatchReturn } = require('./notrycatch')

const encrypt=noTRyCatchReturn(async(password)=>{
let encodedpassword=await bcrypt.hash(password,10)
return encodedpassword;
})

const matched=noTRyCatchReturn(async(password,hashpassword)=>{
    const bools=await bcrypt.compare(password,hashpassword)
    return bools;
    })

module.exports={encrypt,matched}