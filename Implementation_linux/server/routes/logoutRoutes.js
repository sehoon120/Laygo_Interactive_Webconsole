const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.clearCookie('token', { httpOnly: true, path: '/' });
  res.redirect('/');
});

module.exports = router;

