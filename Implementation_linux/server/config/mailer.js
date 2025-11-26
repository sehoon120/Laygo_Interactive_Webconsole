const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'naver',
  host: 'smtp.naver.com',
  port: 587,
  auth: {
    user: process.env.NAVER_USER,
    pass: process.env.NAVER_PASS
  }
});

module.exports = transporter;
