# register.ejs - 기본 기능

- Laygo Web Console의 회원가입 페이지 템플릿
    + 사용자 ID/비밀번호 입력
    + 이메일 인증 기능 포함 (이메일 전송 + 인증번호 확인)
    + 공통 헤더 및 푸터 포함

---

- 공통 레이아웃
- `<%- include('./include/_header_home') %>`
    + 로그인 전 사용자용 공통 헤더

---

- Main 영역 (`<main id="site-main">`)
- `<h3>사용자 등록</h3>`: 페이지 제목
- `<form class="register" method="POST" action="/register">`: 회원가입 정보 제출

---

- 입력 필드 구성
- `username`: 사용자 아이디 입력
- `password`: 비밀번호 입력
- `password2`: 비밀번호 확인
- `email`: 이메일 주소 입력 + 인증 버튼 (`#sendEmailButton`)
- `verificationCode`: 이메일 인증번호 입력 + 확인 버튼 (`#verifyEmailButton`)
- 제출 버튼: `<input type="submit" value="등록">`

---

- 이메일 인증 기능 (JavaScript)
1. 인증 메일 전송
    + `POST /sendVerificationEmail`로 이메일 전송 요청
    + `body`: `{ email }`
    + 서버에서 인증코드 생성 후 세션에 저장

2. 인증 코드 확인
    + `POST /sendVerificationEmail` (또는 수정 필요)
    + `body`: `{ email, code }`
    + 응답(JSON)을 콘솔 출력

---

- 디자인 요소
- `email-verification`, `code-confirmation`:  이메일 입력, 인증번호 확인
- `btn-primary`, `btn-secondary`: Bootstrap 버튼 스타일 적용
- `.register` 클래스는 `style.css`에서 로그인 스타일과 동일한 너비, 여백, 패딩 등 사용
