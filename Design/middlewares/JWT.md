# JWT.md - 기본 기능

- 사용자 인증(JWT 기반)을 처리하는 미들웨어

  + 모든 보호된 라우트(`/main` 등)에 접근하기 전 사용자의 인증 상태 확인
  + 토큰은 HTTP 쿠키에서 추출됨 (`req.cookies.token`)
  + 유효하지 않거나 없는 경우 접근 제한 메시지 반환

---

- 함수 `authenticateJWT`:
  JWT 토큰 기반 사용자 인증 수행

  + 접근 위치: Express Middleware (`app.use()` 또는 라우트 단위로 적용)
  + 동작 순서:

    1. 쿠키에 `token` 값이 존재하는지 확인
    2. 존재할 경우 `jwt.verify`를 비동기로 수행하여 토큰 복호화
    3. 유효한 경우 `req.user`에 사용자 정보 저장, `res.locals.user`에도 저장하여 템플릿에서 접근 가능
    4. 유효하지 않거나 쿠키가 없으면 인증 실패 메시지 출력

  + `jsonwebtoken`: JWT 생성 및 검증
  + `express-async-handler`: 비동기 에러 핸들링
  + `promisify`: 콜백 기반 verify 함수를 `async/await` 방식으로 변환
  + `dotenv`: `.env` 파일에서 `JWT_SECRET` 환경변수 불러옴

  + 에러 메시지

    1. 토큰이 없을 경우: `세션이 만료되었습니다.` (HTTP 401)
    2. 토큰 검증 실패: `세션이 만료되었습니다.`

---
