const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
const {error_middleware}=require('./middleware/error.js');
const thaaliroute=require('./router.js')
const connectfirebase = require('./configurations/connectfirebase.js');
const { connectDB } = require('./configurations/connectpg.js');


//for parsing
app.use(express.json());
app.use(cookieParser());
//for the dotenv
require('dotenv').config()
 //for routes
 app.use('/test',(req,res)=>{
    res.json("hi ashish")
})
app.use('/',thaaliroute)

//for the errors
app.use(error_middleware)

const PORT=process.env.PORT || 5000
const start=async()=>{
    try{
        await connectfirebase();
        app.listen(PORT,()=>{
            console.log("Connection success!!")
        })
    }
    catch(err){
        console.log(err)
    }
}

start()