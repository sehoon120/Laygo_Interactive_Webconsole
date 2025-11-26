const express = require('express');
const router = express.Router();
const requireEmailVerified = require('../middlewares/requireEmailVerified');

const {
    getLogin, 
    loginUser, 
    getRegister, 
    registerUser,
    sendVerificationEmail,
    verifyEmailCode
} = require('../controllers/loginController');

router.route('/')
    .get(getLogin)
    .post(loginUser);

router.route('/register')
  .get(getRegister)
  .post(requireEmailVerified, registerUser);

router.route('/sendVerificationEmail')
    .post(sendVerificationEmail);

router.route('/verifyEmailCode')
    .post(verifyEmailCode);

module.exports = router;