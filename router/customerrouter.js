
const express=require('express')
const { registerController, emailverifyController, loginController, updatePasswordController, resetpasswordController, requestresetpasswordController } = require('../customer/login')
const { authorizemiddleware, bookAuthorizeMiddleware } = require('../customer/authorizemiddlware')
const { add_profile, display_profile, update_profile } = require('../customer/profile')
const { add_profile_photo, update_profile_photo } = require('../common/profile_photo')
const { add_book, add_facility } = require('../customer/book')
const { display_menu, display_menu_db } = require('../customer/menucrud')
const { add_order, display_order } = require('../customer/ordercrud')
const { add_payment, display_payment, bill } = require('../customer/payment')
const { add_review, display_review, update_review, delete_review } = require('../customer/review')
const { menu_db } = require('../common/dashboard')
const { image_url } = require('../functions/photourl')
const { upload } = require('../functions/photomulter')
const { nearby } = require('../common/mapreview')
const router = express.Router()

router.route('/register').post(registerController)
router.route('/verifyemail').post(emailverifyController)
router.route('/login').post(loginController)
router.route('/updatepassword').patch(authorizemiddleware,updatePasswordController)
router.route('/resetpassword').get(requestresetpasswordController).post(resetpasswordController)

//for profile
router.route('/profile').post(authorizemiddleware,add_profile).get(authorizemiddleware,display_profile).patch(authorizemiddleware,update_profile)
router.route('/profile/photo').post(authorizemiddleware,add_profile_photo).patch(authorizemiddleware,update_profile_photo)

//book_table
router.route('/book').post(authorizemiddleware,add_book)
router.route('/facility').patch(authorizemiddleware,bookAuthorizeMiddleware,add_facility)
//menu
router.route('/menu').get(authorizemiddleware,bookAuthorizeMiddleware,display_menu)
router.route('/menu_db').get(display_menu_db)
//order
router.route('/order').post(authorizemiddleware,bookAuthorizeMiddleware,add_order).get(authorizemiddleware,bookAuthorizeMiddleware,display_order)
//payment
router.route('/payment').post(authorizemiddleware,bookAuthorizeMiddleware,add_payment).get(authorizemiddleware,bookAuthorizeMiddleware,display_payment)
//review
router.route('/review').post(authorizemiddleware,add_review).get(display_review).patch(authorizemiddleware,update_review).delete(authorizemiddleware,delete_review)
//bill
router.route('/bill').get(authorizemiddleware,bookAuthorizeMiddleware,bill)
//commom
router.route('/common/menu').get(authorizemiddleware,bookAuthorizeMiddleware,menu_db)
//photo
router.route('/photo').post(authorizemiddleware,upload().array('image',),image_url)
//nearby
router.route('/nearby').post(nearby)
module.exports=router;
