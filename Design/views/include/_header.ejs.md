# _header.ejs - 기본 기능

- Laygo Web Console의 상단 공통 헤더 템플릿
  + Bootstrap & FontAwesome 포함
  + 프로젝트 로고 및 메인 페이지 이동 링크
  + 로그인된 사용자 이름 표시 및 로그아웃 기능 포함

---

- `<!DOCTYPE html>` 및 `<html lang="ko">`:
  한국어 문서로 HTML5 표준 선언

---

- `<head>` 내부
  + 문자 인코딩: UTF-8
  + 뷰포트 설정: 반응형 디자인을 위한 `width=device-width`
  + 타이틀: `Laygo Web Console`
  + 외부 스타일시트 로드:
    1. Bootstrap 5.2.3 CDN
    2. FontAwesome 6.4.0 CDN
    3. 로컬 CSS: `/style.css`

---

- `<header class="border-shadow">`:
  상단 고정 헤더. 그림자/테두리 적용
  + 내부 요소 `.container`: 가로 정렬 및 여백 적용

---

- `<nav>`:
  + 사이트 로고 및 메인으로 이동 버튼
  + `<i class="fa-solid fa-drafting-compass">`: 아이콘 포함
  + 링크 경로: `/main`

---

- `.login-box`:
  + 헤더 우측 상단에 위치
  + 현재 로그인된 사용자 정보(`User: <%= user.username %>`) 표시
  + `btn-secondary` 클래스를 가진 로그아웃 버튼 포함

---

- `<script>` 내부:
  + `logoutButton` 클릭 시:
    1. (필요 시) `localStorage`의 `token` 제거
    2. 서버의 `/logout` 엔드포인트로 리디렉션하여 로그아웃 수행
       → `/logout`에서 HttpOnly 쿠키 제거 예상