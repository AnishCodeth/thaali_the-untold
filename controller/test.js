// const { photo_firebase_url } = require("../functions/firebasecrud");
// const { connectDB, disconnectDB } = require("../configurations/connectpg");
const {noTryCatch}=require('../functions/notrycatch');
// const { form_to_json } = require("../functions/form_json");
// const cache=require('memory-cache')

// const display_test=noTryCatch(async(req,res)=>{
// const id=req.body.description;

// let pgres;
// const client=await connectDB()
// if(cache.get(id)==null){
// console.log(id)
// pgres=await client.query(`select * from test where description='${id}'`)
//  cache.put(id,pgres.rows,10000,function (key,value){
//     console.log('expired');})
// return res.json(pgres.rows)
//  }



// res.json(cache.get(id))
// })

// module.exports={display_test}


const display_test=noTryCatch(async(req,res)=>{
res.cookie("name","anish",{
    httpOnly:true
})
res.json("hi")
})


module.exports={display_test}

