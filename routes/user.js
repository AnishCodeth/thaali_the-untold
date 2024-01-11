const express=require('express')
const multer=require('multer')
const { noTryCatch } = require('../functions/notrycatch')
const { registerController } = require('../controller/login')

const router=express.Router()

router.route('/register').post(registerController)

module.exports=router

