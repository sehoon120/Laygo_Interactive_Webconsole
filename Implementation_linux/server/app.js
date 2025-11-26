const express = require('express');
const session = require('express-session');
const dbConnect = require('./config/dbConnect');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
//const { exec } = require('child_process');  // 파이썬


const app = express();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// app.use((req, res, next) => {
//   console.log("🧭 Incoming request:", req.method, req.originalUrl);
//   next();
// });// 디버깅


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));
// app.use('/public', express.static('./public'));

app.use(methodOverride('_method'));

dbConnect();


// 바디파서 등록
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// 세션 미들웨어 설정 (개발환경에서는 secure:false)
app.use(session({
    secret: 'your-secret-key',  // 비밀 키는 임의로 지정
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true}  // false }   // 실제 운영환경에서는 https 사용 시 secure:true로 변경
    cookie: { httpOnly: true, sameSite: 'lax', secure: false }
}));


// routes
app.use('/', require('./routes/loginRoutes'));
app.use('/logout', require('./routes/logoutRoutes'));   // 로그아웃 라우트트
// app.use('/main', require('./routes/middleRoutes'));     // 미들웨어 테스트 -> 토큰검사

const authenticateJWT = require('./middlewares/JWT');
app.use('/main', authenticateJWT);

app.use('/main', require('./routes/fileRoutes'));


// 헬스체크 (서버 살아있는지 간단 확인)
app.get('/healthz', (req, res) => res.status(200).send('ok'));


// app.use((req, res, next) => {       // 에러 페이지
//     res.render('404');
//     next();
// });
app.use((req, res) => {
  if (req.accepts('html')) return res.status(404).render('404');
  if (req.accepts('json')) return res.status(404).json({ success:false, message:'Not Found' });
  return res.status(404).type('txt').send('404 Not Found');
});

// app.listen(3000, () => {
//     console.log('server is running');
// });

app.listen(PORT, HOST, () => {
  console.log(`server is running on http://${HOST}:${PORT}`);
});


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// })