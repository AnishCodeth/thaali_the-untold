const express=require('express')
const app=express()

const connectDB=require('./connectdb')
//for parsing
app.use(express.json());
//for the dotenv
require('dotenv').config()

//for testing purpose
const test=require('./routes/test')
app.use('./test',test)


const start=async()=>{
    try{
        await connectDB(process.env.mongodb_connection)
        app.listen(5000,()=>{
            console.log("Connection success!!")
        })
    }
    catch(err){
        console.log(err)
    }
}

start()