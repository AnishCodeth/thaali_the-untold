const { registerController, emailverifyController, loginController, updatePasswordController, requestresetpasswordController, resetpasswordController, approveRequest } = require("../admin/login");
const express=require('express')
const multer=require('multer')
const {upload} = require('../functions/photomulter');
const { authorizemiddleware } = require("../admin/authorizemiddlware");
const { add_facility, display_book, delete_book } = require("../admin/book");
const { add_menu, display_menu, update_menu, delete_menu } = require("../admin/menucrud");

const router = express.Router()




router.use((req, res, next) => {
    const paths=['/login','/register','/resetpassword','resetpasswordController']
    if (req.path === '/login' || req.path === '/register') {
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
module.exports=router;
