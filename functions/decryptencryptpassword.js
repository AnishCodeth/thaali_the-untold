const bcrypt=require('bcrypt')
const { noTryCatch, noTRyCatchReturn } = require('./notrycatch')

const encrypt=async(password)=>{
console.log(password)
let encodedpassword=await bcrypt.hash(password,10)
return encodedpassword;
}

const matched=async(password,hashpassword)=>{
    const bools=await bcrypt.compare(password,hashpassword)
    return bools;
    }

module.exports={encrypt,matched}