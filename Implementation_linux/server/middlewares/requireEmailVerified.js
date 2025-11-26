// middlewares/requireEmailVerified.js
module.exports = function requireEmailVerified(req, res, next) {
  const formEmail = String(req.body?.email || '').trim().toLowerCase();

  if (!req.session.emailVerified || req.session.verifiedEmail !== formEmail) {
    return res.status(400).render('register', {
      error: '이메일 인증을 먼저 완료하세요.'
    });
  }
  next();
};
