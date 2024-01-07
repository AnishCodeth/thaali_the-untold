const customError = require("./customerror");
const { noTryCatch } = require("./notrycatch");

const form_to_json=async(request)=>{

    try{
    Object.keys(request).filter((filtered)=>{
         request[filtered]=JSON.parse(request[filtered])
    })
    return request
}
catch(err)
{
    throw new customError(err.message,500)
}
}

module.exports={form_to_json}