# footer.ejs - 기본 기능

- HTML 문서의 마무리 구조를 담당하는 클로징 태그
  * `<body>`, `<html>` 태그 종료
  * 공통 EJS 템플릿에서 `include('./include/_footer')` 등을 통해 삽입 가능

---

- `</body>`
  * HTML 본문 콘텐츠 종료
  * 모든 `<header>`, `<main>`, `<script>` 등 콘텐츠의 종료 위치

---

- `</html>`
  * HTML 문서의 최종 종료 태그
  * 모든 구조가 닫힌 후 반드시 위치해야 함