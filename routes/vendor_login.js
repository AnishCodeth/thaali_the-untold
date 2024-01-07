const express=require('express')
const multer=require('multer')
const {upload} = require('../functions/photomulter')
const { menu_add,menu_display,menu_update, menu_delete} = require('../controller/menucrud')
const { add_order, display_order, update_order, delete_order } = require('../controller/ordercrud')
const { display_test } = require('../controller/test')
const { send } = require('../controller/khalti')
const { login, registerController, emailverifyController, loginController, updatePasswordController, requestresetpasswordController, resetpasswordController } = require('../controller/login')
const { authorizemiddleware } = require('../middleware/authorize')

const router = express.Router()

router.route('/register').post(registerController)
router.route('/verifyemail').post(emailverifyController)
router.route('/login').post(loginController)
router.route('/updatepassword').post(authorizemiddleware,updatePasswordController)
router.route('/resetpassword').get(requestresetpasswordController).post(resetpasswordController)
module.exports=router