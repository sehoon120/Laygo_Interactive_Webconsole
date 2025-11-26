# app.md - 기본 기능
express 이용해 각 페이지별로 접근 method에 따라 어떤 대응을 할지 처리하는 최상위 코드

# app.md - input/output
- 외부 express pkgs
    + express
    + express-session: session 관리용 middleware. Login 후 session 관리 위해 필요
    + method-override: PUT/DELETE method 사용 위한 package
    + cookie-parser: 쿠키 파싱 위함.
- 내부 file들
    + Files in DIR views: rendering 할 page들 정의되어 있음
    + Files in DIR public: 정적 파일 제공(현재 구조상에서는 .css file)
    + /config/dbConnect: MongoDB 연결

# 내부 기능
    + 사용할 외부 파일/함수들 import(require())
    + express, db, view, 정적 파일(./public), method_override(PUT/DELETE 사용 위해 설정 필요), request parsing(Bodypaser), cookie parsing 설정
    + login, logout 및 editing 기능 연결. 즉, routes 디렉터리의 라우터 파일들 연결
    + 잘못된 연결 시 에러 페이지 표시하게 함

#Pseudocode

