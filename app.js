const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')


//for parsing
app.use(express.json());
app.use(cookieParser());
//for the dotenv
require('dotenv').config()

//for testing purpose
const vendor=require('./routes/vendor.js');
const vendor_login=require('./routes/vendor_login.js')
const connectfirebase = require('./configurations/connectfirebase.js');


const { refresh } = require('./controller/refresh.js');
app.use('/refresh',refresh)
app.use('/authorize',vendor_login)
app.use('/vendor',vendor)

const {send}=require('./controller/khalti.js')
app.use('/send',send)




//for the errors
const {error_middleware}=require('./middleware/error.js');

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