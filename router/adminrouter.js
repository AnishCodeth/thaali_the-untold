const { registerController, emailverifyController, loginController, updatePasswordController, requestresetpasswordController, resetpasswordController, approveRequest } = require("../admin/login");
const express=require('express')
const multer=require('multer')
const {upload} = require('../functions/photomulter');
const { authorizemiddleware } = require("../admin/authorizemiddlware");
const { add_facility, display_book, delete_book } = require("../admin/book");
const { add_menu, display_menu, update_menu, delete_menu } = require("../admin/menucrud");
const { image_url } = require("../functions/photourl");
const { route } = require("./vendorrouter");
const { display_profile } = require("../admin/profile");

const router = express.Router()




router.use((req, res, next) => {
    const paths=['/login','/register','/resetpassword','resetpasswordController','/verifyemail']
    console.log(req.path)
    if (paths.includes(req.path)) {
      next(); // Skip authorization for login and register routes
    } else {
      authorizemiddleware(req, res, next); // Use authorizemiddleware for other routes
    }
  });
  
  router.route('/register').post(registerController)
  router.route('/verifyemail').post(emailverifyController)
  router.route('/login').post(loginController)
  router.route('/updatepassword').patch(updatePasswordController)
  router.route('/resetpassword').get(requestresetpasswordController).post(resetpasswordController)
  router.route('/approverequest').post(approveRequest)
  
  //book
  router.route('/book').get(display_book).delete(delete_book)
  router.route('/facility').patch(add_facility)
  //menu
router.route('/menu').post(add_menu).get(display_menu).patch(update_menu).delete(delete_menu)
//photo
router.route('/photo').post(authorizemiddleware,upload().array('image',),image_url)
//profile
router.route('/profile').get(authorizemiddleware,display_profile)
module.exports=router;
