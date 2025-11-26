# mailer.md - 기본 기능
- 계정 인증 메일 API 연결 수행
    + 메일 연결 초기화
    + 사용 기술: nodemailer
    + 연결할 mail의 관련 정보(계정/비밀번호): .env 파일 내 NAVER_USER, NAVER_PASS 변수에 저장

- 함수 transporter: mail 연결
    + .env의 NAVER_USER, NAVER_PASS 데이터를 가져와 naver에서 제공하는 SMTP host(smtp.naver.com)에 연결

- pseudocode
```
# nodemailer 사용 설정
nodemailer = require('nodemailer')

#transporter 객체: mongoDB 연결
transporter = nodemailer.createTransport("map data structure for mail connetion info")

```
