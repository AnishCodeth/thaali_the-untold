const express=require('express')
const { allvendordata, nearby } = require('../common/mapreview')
const { authorizemiddleware } = require('../customer/authorizemiddlware')
const router=express.Router()


router.route('/vendor').get(allvendordata)



module.exports=router