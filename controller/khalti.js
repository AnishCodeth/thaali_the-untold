const axios=require('axios')
const { noTryCatch } = require('../functions/notrycatch')
const customError = require('../functions/customerror')

const send=noTryCatch( async (req,res)=>{
     const body={
        "return_url": "http://localhost:5000/pay",
        "website_url": "http://localhost:5000/pay",
        "amount": "1000",
        "purchase_order_id": "Order01",
        "purchase_order_name": "test",
        "customer_info": {
            "name": "Ram Bahadur",
            "email": "test@khalti.com",
            "phone": "9800000001"
        }
    }
        
    
    const headers={
        'Authorization': 'test_public_key_e9de2cbaeabf4a7d9e2d9807aef24841',
        'Content-Type': 'application/json'
    }

    const response=await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',body,headers)
res.json(response)
            })

module.exports={send}