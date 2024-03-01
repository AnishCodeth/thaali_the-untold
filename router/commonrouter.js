const express=require('express')
const { allvendordata } = require('../common/mapreview')
const router=express.Router()


router.route('/vendor').get(allvendordata)


module.exports=router