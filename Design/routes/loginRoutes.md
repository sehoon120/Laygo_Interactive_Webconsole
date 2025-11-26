# loginRoute.md - 기본 기능
- /logout, /main 이외의 /이하 페이지들에 대한 관리 수행. 이 페이지들은 로그인에 관련됨
    + 사용 기술: express.Router
    + 관리하는 페이지(/ 아래의 subURL): / -> login 페이지, /register -> 회원가입 페이지, /sendVerificationEmail -> 로그인 이메일 인증

- 연결 controller: controllers/loginController로부터 객체 받아와 이용
    + getLogin, loginUser, getRegister, registerUser, sendVerificationEmail, verifyEmailCode

- 각 페이지별 설명
    + /: get method 접근 시 getLogin controller 호출해 로그인 페이지 띄움(home.ejs render), post method 접근 시 loginUser controller 호출해 username과 PW 받아서 로그인 수행
    + /register: get method 접근 시 getRegister controller 함수 호출해 회원가입 페이지 띄움(register.ejs render), post method 접근 시 registerUser 함수 호출해 회원가입 수행
    + /sendVerificationEmail: post method 접근 시 sendVerificationEmail, verifyEmailCode 함수 호출해 이메일 인증 수행

- pseudocode
```
# router 사용 설정

# 사용할 객체 import
{getLogin, loginUser, getRegister, registerUser,sendVerificationEmail, verifyEmailCode} <- Import from controllers/fileController

#routing
router.route('/')
    .get(getLogin)
    .post(loginUser);

router.route('/register')
    .get(getRegister)
    .post(registerUser);

router.route('/sendVerificationEmail')
    .post(sendVerificationEmail);

router.route('/sendVerificationEmail')
    .post(verifyEmailCode);
```
