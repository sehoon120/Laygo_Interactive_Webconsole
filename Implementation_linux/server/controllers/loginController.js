const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtSecret= process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');

// GET login page
const getLogin = (req, res) => {
    res.render('home');
};

// POST login user
const loginUser = asyncHandler(async(req, res) => {
    const { username, password } = req.body;
    // console.log(`${username}, ${password}`);

    const user = await User.findOne({username});
    if (!user) {
        return res.json({ message: '일치하는 사용자가 없습니다.'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ message: '비밀번호가 일치하지 않습니다.'});
    }

    const token = jwt.sign({username: username, id: user._id}, jwtSecret, { expiresIn: '12h' });
    res.cookie('token', token, {httpOnly: true});
    res.redirect('/main');

});

// GET register page
const getRegister = (req, res) => {
    res.render('register');
};

// POST register user
const registerUser = asyncHandler(async(req, res) => {
    const {username, password, password2, email, num} = req.body;
    console.log('username: '+username);
    console.log(password);
    console.log(password2);
    console.log(email);
    if(username == '' || password == '' || password2 == '' || email == '') {
      res.send("Register Failed: 입력 필드를 모두 채워주세요");
    } else{
      if (password === password2) {
        const hashedPassword = await bcrypt.hash(password, 10);
        try{
          const user = await User.create( { username, password: hashedPassword, email});
        }
        catch(err){
          res.send("Register Failed: 이름 혹은 이메일 중복");
        }
        // res.json( {message: "Register successed", user});
        // req.session.username = username;
        // req.session.password = hashedPassword;
        // req.session.email = email;
        res.redirect('/');
      } else {
          res.send("Register Failed: 비밀번호 확인 틀림");
      }
    }
    
});
// alpha    1234



const sendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    // 6자리 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000);
    
    // 세션에 인증 코드와 이메일을 저장 (나중에 비교하기 위함)
    req.session.verificationCode = code;
    req.session.verificationEmail = email;

    const mailOptions = {
      from: process.env.NAVER_USER,
      to: email,
      subject: 'Laygo Web Console 이메일 인증 코드',
      text: `인증 코드는 ${code} 입니다.`
    };

    try {
      await transporter.sendMail(mailOptions);
    //   res.json({ success: true, message: '인증 메일 전송 성공', code: code });
      res.json({ success: true, message: '인증 메일 전송 성공'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: '메일 전송 실패' });
    }
};


const verifyEmailCode = (req, res) => {
  let { email, code } = req.body;
  // console.log(code);
  // console.log(req.session.verificationCode);
  email = String(email || '').trim().toLowerCase();
  code  = String(code  || '').trim();

  if (!req.session.verificationCode || !req.session.verificationEmail) {
    return res.status(400).json({ success:false, message:'인증 코드가 만료되었거나 존재하지 않습니다.' });
  }
  if (req.session.verificationEmail !== email) {
    return res.status(400).json({ success:false, message:'요청한 이메일과 다릅니다.' });
  }
  if (String(req.session.verificationCode) !== code) {
    return res.status(400).json({ success:false, message:'인증 코드가 올바르지 않습니다.' });
  }

  // ✅ 인증 성공 → 가입 허용 플래그
  req.session.emailVerified = true;
  req.session.verifiedEmail = email;

  // (선택) 일회성 코드 정리
  delete req.session.verificationCode;
  delete req.session.verificationEmail;

  // 저장 보장 후 응답
  return req.session.save(() => {
    return res.json({ success:true, message:'이메일 인증 성공' });
  });
};

  



module.exports = {getLogin, loginUser, getRegister, registerUser, sendVerificationEmail, verifyEmailCode};