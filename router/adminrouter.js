const { registerController, emailverifyController, loginController, updatePasswordController, requestresetpasswordController, resetpasswordController, approveRequest } = require("../admin/login");
const express=require('express')
const multer=require('multer')
const {upload} = require('../functions/photomulter');
const { authorizemiddleware } = require("../vendor/authorizemiddlware");

const router = express.Router()

router.route('/register').post(registerController)
router.route('/verifyemail').post(emailverifyController)
router.route('/login').post(loginController)
router.route('/updatepassword').patch(authorizemiddleware,updatePasswordController)
router.route('/resetpassword').get(requestresetpasswordController).post(resetpasswordController)
router.route('/approverequest').post(approveRequest)
module.exports=router;
