# home.ejs - 기본 기능

- Laygo Web Console의 로그인 페이지 템플릿
  + 사용자 인증을 위한 로그인 폼 구성
  + 회원가입 페이지로 이동하는 버튼 포함
  + 공통 헤더 및 푸터 레이아웃 포함

---

- `<%- include('./include/_header_home') %>`
  + 로그인 전 사용자용 공통 헤더
  + Bootstrap 및 스타일 시트 포함

---

- Main 영역 (`<main id="site-main">`)
- `.home-container`: 로그인 박스를 포함한 메인 컨테이너
  + `<h3>`: "로그인" 제목
  + `<p>`: 로그인 필요 안내 문구 `"로그인이 필요한 서비스입니다."`

---

- 로그인 폼
- `<form class="login" method="POST" action="/">`
  + 입력 필드
    + `username`: 사용자 아이디 입력 (`text`)
    + `password`: 비밀번호 입력 (`password`)
  + 로그인 버튼
    + `<button type="submit">로그인</button>`

---

- 회원가입 버튼
- `<a href="/register" class="btn btn-primary">회원가입</a>`
  + 로그인 폼 아래 위치
  + Bootstrap 버튼 스타일 적용
  + `/register` 경로로 이동

---

- `<%- include('./include/_footer') %>`
  + 공통 푸터 삽입
  + 저작권, 하단 정보 등 포함 가능

---

- 로그인 요청은 루트(`/`) 경로로 `POST` 방식 전송되며, 서버 측 `loginUser` 컨트롤러에서 처리
- 폼의 레이아웃 및 입력창 스타일은 `/style.css` 내 `.login` 클래스 기반
- 회원가입은 별도 페이지(`/register`)에서 처리됨
