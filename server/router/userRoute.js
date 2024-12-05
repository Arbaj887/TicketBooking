const router= require('express').Router();

const {login,register,logout,bookticket,ticketList,verifyticket} = require('../controllers/userController.js');
const auth = require('../utility/auth.js');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').post(auth,logout)
router.route('/bookticket').post(auth,bookticket);
router.route('/ticketlist').get(auth,ticketList);
router.route('/verfiyticket').post(auth,verifyticket)

module.exports=router