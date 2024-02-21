const { registerController, emailverifyController, loginController, updatePasswordController, requestresetpasswordController, resetpasswordController, approveRequest } = require("../vendor/login");
const express=require('express')
const multer=require('multer')
const {upload} = require('../functions/photomulter');
const { authorizemiddleware } = require("../vendor/authorizemiddlware");
const { add_table, display_table, update_table, delete_table } = require("../vendor/tablecrud");
const { add_menu, display_menu, update_menu, delete_menu } = require("../vendor/menucrud");
const { display_profile, update_profile } = require("../vendor/profile");
const { add_profile_photo, update_profile_photo } = require("../common/profile_photo");
const { display_order, delete_order } = require("../vendor/ordercrud");
const { display_payment } = require("../vendor/payment");
const { delete_book, display_book } = require("../vendor/book");
const { display_review } = require("../vendor/review");

const router = express.Router()

router.route('/register').post(registerController)
router.route('/verifyemail').post(emailverifyController)
router.route('/login').post(loginController)
router.route('/updatepassword').patch(authorizemiddleware,updatePasswordController)
router.route('/resetpassword').get(requestresetpasswordController).post(resetpasswordController)

//table
router.route('/table').post(authorizemiddleware,add_table).get(authorizemiddleware,display_table).patch(authorizemiddleware,update_table).delete(authorizemiddleware,delete_table)
//menu
router.route('/menu').post(authorizemiddleware,add_menu).get(authorizemiddleware,display_menu).patch(authorizemiddleware,update_menu).delete(authorizemiddleware,delete_menu)
//profile
router.route('/profile').get(authorizemiddleware,display_profile).patch(authorizemiddleware,update_profile)
router.route('/profile/photo').post(authorizemiddleware,add_profile_photo).patch(authorizemiddleware,update_profile_photo)
//order
router.route('/order').get(authorizemiddleware,display_order).delete(authorizemiddleware,delete_order)
//payment
router.route('/payment').get(authorizemiddleware,display_payment)
//deletebook
router.route('/book').delete(authorizemiddleware,delete_book).get(authorizemiddleware,display_book)
//review
router.route('/review').get(display_review)
module.exports=router;
