# dbConnect.md - 기본 기능
- db 초기 연결 수행
    + mongoDB 연결 초기화
    + 사용 기술: mongoose, dotenv
    + mongoDB 연결에 기타 다른 정보 필요: mongoDB login에 필요한 data => .env 파일에 저장(파일 내 DB_CONNECT 변수에 저장) 

- 함수 dbConnect: db 연결
    + .env의 DB_CONNECT 데이터를 가져와 mongoDB 연결

- pseudocode
```
# mongoose / dotenv 사용 설정
mongoose = require('mongoose')
require('dotenv').path(".env file path(default: root)")

#dbConnect 함수: mongoDB 연결
async function dbConnect {
    mongoose.connect(process.env.DB_CONNECT)
}

```
