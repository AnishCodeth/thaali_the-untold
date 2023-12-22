const express=require('express')
const { test_create } = require('../controller/test')
const router=express.Router()

router.route('/create').post(test_create)

module.exports=router