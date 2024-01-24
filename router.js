const express=require('express')
const multer=require('multer')
const {upload} = require('./functions/photomulter')
const { menu_add,menu_display,menu_update, menu_delete} = require('./controller/menucrud')
const { add_order, display_order, update_order, delete_order } = require('./controller/orderCrud')
const { display_test } = require('./controller/test')
const { send } = require('./controller/khalti')
const { login, registerController, emailverifyController, loginController, updatePasswordController, requestresetpasswordController, resetpasswordController, displayCredentials } = require('./controller/login')
const { authorizemiddleware } = require('./middleware/authorize')
const {add_profile } = require('./controller/profile')
const { add_table, display_table, update_table, delete_table } = require('./controller/tablecrud')
const { paymentadd, paymentdisplay, paymentUpdate, paymentdelete, getbill, verifypayment } = require('./controller/payment')
const { add_book_table, delete_book_table } = require('./controller/book')
const { roleRequestController, roleDisplayController, roleChangeController } = require('./controller/role')
const { image_url } = require('./controller/image_url')


const router = express.Router()

router.use(authorizemiddleware)
//for image
router.route('/photo').post(upload().array('image',),image_url)
router.route('/menu').post(menu_add).get(menu_display).put(upload().array('image'),menu_update).delete(menu_delete)
router.route('/order').post(add_order).get(display_order).put(update_order).delete(delete_order)
router.route('/table').post(add_table).get(display_table).put(update_table).delete(delete_table)
router.route('/role').post(authorizemiddleware,roleRequestController).get(authorizemiddleware,roleDisplayController).put(authorizemiddleware,roleChangeController)

router.route('/test').get(display_test)
router.route('/pay').post(send)

router.route('/profile').post(add_profile)

router.route('/book').post(add_book_table).delete(delete_book_table)


router.route('/payment').post(paymentadd).get(paymentdisplay).put(paymentUpdate).delete(paymentdelete)
router.route('/bill').get(getbill)
router.route('/verifypayment').post(verifypayment)

router.route('/register').post(registerController)
router.route('/verifyemail').post(emailverifyController)
router.route('/login').post(loginController).get(displayCredentials)
router.route('/updatepassword').post(authorizemiddleware,updatePasswordController)
router.route('/resetpassword').get(requestresetpasswordController).post(resetpasswordController)
module.exports=router;
