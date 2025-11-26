# _header_home.ejs - 기본 기능

- Laygo Web Console의 공통 헤더 템플릿
- 로그인된 사용자가 없는 초기 상태, 로그인 페이지에서 사용
  + Bootstrap / FontAwesome 기반
  + 프로젝트 로고 및 홈(`/`) 이동 링크 제공

---

- `<!DOCTYPE html>` 및 `<html lang="ko">`:
  한국어 문서로 HTML5 표준 선언

---

- `<head>` 내부
  + 문자 인코딩: UTF-8
  + 뷰포트 설정: 반응형 웹 대응
  + 제목: `Laygo Web Console`
  + 스타일시트 로드:
    1. Bootstrap 5.2.3 (CDN)
    2. FontAwesome 6.4.0 (CDN)
    3. 로컬 CSS `/style.css` (전체 레이아웃 커스터마이징)

---

- `<header class="border-shadow">`:
  상단 고정 헤더
  + `border-shadow` 클래스: 테두리 및 그림자 효과 추가

---

- `<div class="container">`:
  중앙 정렬을 위한 Bootstrap 컨테이너 사용

---

- `<nav>`
  + 사이트 제목 및 홈 링크 제공
  + `<a href="/">`: 메인 홈페이지로 이동하는 링크
  + `<i class="fa-solid fa-drafting-compass">`: FontAwesome 아이콘으로 로고 표현
  + 텍스트: `Laygo`