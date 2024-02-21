const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
const {error_middleware}=require('./middleware/error.js');
const adminroute=require('./router/adminrouter.js')
const vendorrouter=require('./router/vendorrouter.js')
const customerrouter=require('./router/customerrouter.js')
const connectfirebase = require('./configurations/connectfirebase.js');


//for parsing
app.use(express.json());
app.use(cookieParser());

//for the dotenv
require('dotenv').config()

app.use('/admin',adminroute)
app.use('/vendor',vendorrouter)
app.use('/customer',customerrouter)
app.use('/',async (req,res)=>{
    return res.status(404).json('not found')
})

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