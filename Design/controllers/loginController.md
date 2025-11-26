# loginController.md - 기본기능
- 사용자 로그인, 회원가입, 이메일 인증 등 인증 관련 기능을 담당하는 컨트롤러

  + 주요 경로: `/`, `/register`, `/login`, `/verify` 등
  + 사용 기술: `bcrypt`, `jsonwebtoken`, `nodemailer`, `express-session`, `dotenv`

---

- 함수 `getLogin`:
  로그인 페이지 렌더링

  + 접근: `GET`
  + 렌더링 뷰: `home.ejs`

---

- 함수 `loginUser`:
  로그인 요청 처리

  + 접근: `POST`
  + 입력: `username`, `password`
  + 동작:

    1. 사용자 존재 여부 확인
    2. 비밀번호 비교 (`bcrypt.compare`)
    3. JWT 토큰 생성 후 쿠키에 저장 (`httpOnly`)
    4. `/main`으로 리다이렉트

---

- 함수 `getRegister`:
  회원가입 페이지 렌더링

  + 접근: `GET`
  + 렌더링 뷰: `register.ejs`

---

- 함수 `registerUser`:
  회원가입 처리

  + 접근: `POST`
  + 입력: `username`, `password`, `password2`, `email`, `num`
  + 동작:

    1. 비밀번호 확인 일치 여부 확인
    2. 비밀번호 해싱 (`bcrypt.hash`)
    3. 사용자 정보 DB 저장
    4. 성공 시 `/`로 리다이렉트

---

- 함수 `sendVerificationEmail`:
  이메일 인증 코드 전송

  + 접근: `POST`
  + 입력: `email`
  + 동작:

    1. 6자리 인증 코드 생성
    2. 인증 코드와 이메일을 세션에 저장
    3. `nodemailer`를 통해 이메일 전송 (`transporter` 설정 사용)
    4. 성공 여부 JSON 응답 반환

---
- 함수 `verifyEmailCode`:
  이메일 인증 코드 확인

  + 접근: `POST`
  + 입력: `email`, `code`
  + 동작:

    1. 세션에 저장된 이메일/코드와 비교
    2. 일치 시 인증 성공 응답, 세션 정보 삭제
    3. 실패 시 에러 메시지 반환

---