const express=require('express')
const multer=require('multer')
const {upload} = require('../functions/photomulter')
const { menu_add,menu_display,menu_update, menu_delete} = require('../controller/menucrud')
const { add_order, display_order, update_order, delete_order } = require('../controller/ordercrud')
const { display_test } = require('../controller/test')
const { send } = require('../controller/khalti')
const { login, registerController, emailverifyController, loginController } = require('../controller/login')
const { authorizemiddleware } = require('../middleware/authorize')


const router = express.Router()

router.use(authorizemiddleware)
router.route('/menu').post( upload().array('image'),menu_add).get(menu_display).put(upload().array('image'),menu_update).delete(menu_delete)
router.route('/order').post(add_order).get(display_order).put(update_order).delete(delete_order)
router.route('/test').get(display_test)
router.route('/pay').post(send)

module.exports=router;
