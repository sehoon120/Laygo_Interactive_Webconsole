# style.css - 기본 기능

    + 전체 페이지의 레이아웃, 버튼, 입력창, 로그인/회원가입 폼, 테이블 등 스타일 정의
    + 반응형 디자인 및 사용자 인터페이스 개선을 위한 CSS 구성
    + 주요 섹션: 공통 스타일, header/nav, 버튼, form, 테이블, 로그인/회원가입, 인증 입력 등

---

- 공통 설정
    + ` +`: 기본 마진/패딩 제거 및 `box-sizing: border-box` 설정
    + `a`: 링크 밑줄 제거 및 텍스트 색상 기본 설정 (`#222`)
    + `.container`: 페이지 중앙 정렬 및 최대 너비 설정 (`1600px`)

---

- Header 영역
    + `.login-box`: header 우측 상단 고정 위치
    + `header nav a`: 사이트 이름 또는 로고에 적용될 수 있는 큰 글씨체 (`1.5em`, bold)

---

- 버튼 및 텍스트 정렬
    + `.button-box`: 오른쪽 정렬된 버튼 그룹, 버튼 간격 `10px`
    + `.button-box i`: 버튼 내부 아이콘 마진 조정
    + `.text-center`: 중앙 정렬 유틸 클래스
    + `.border-shadow`: 테두리 및 그림자 추가 유틸 클래스

---

- 리스트/테이블 영역
    + `#site-main`: 리스트 및 폼 콘텐츠의 컨테이너. 폭 `1600px`, 상단 마진 `6em`
    + 반응형 테이블 (`max-width: 800px` 이하일 경우):
  모든 테이블 요소를 `block`으로 처리하여 모바일에 적합하게 변경

---

- 폼(Form) 관련
    + `#site-main h2`, `p`: 입력폼 상단의 제목/설명
    + `.user-info input[type="text"]`: 입력창 디자인 – 패딩, 테두리, radius
    + `form button:not(.login-btn)`: 회색 배경 버튼, hover 시 검정 배경/흰 글씨

---

- 로그인 및 회원가입 폼
    + `.login`, `.register`: 중앙 정렬 및 너비 `80%`
    + 입력 필드: `border-bottom`만 존재하는 깔끔한 스타일
    + 버튼: 테두리 없음 (`border: none`)
    + `label`: `visibility: hidden` 처리로 시각적으로 감춤

---

- 기타
    + `.back-button`: 왼쪽 상단 ‘뒤로가기’ 버튼, 아이콘 포함, absolute 위치
    + `.directory-nav a`: 디렉토리 탐색용 링크 – hover 시 파란색
    + `hr`: 기본 테두리 제거 및 상단 마진만 존재

---

- 이메일 인증 관련 (회원가입 시 사용)
    + `.phone-verification`, `.code-confirmation`:
  인증번호 입력란과 버튼을 가로 배치 (flex)
    + `input`: 기존 로그인 입력창과 동일한 스타일
    + `.verify-btn`: 우측 버튼 – 33.3% width, 왼쪽 마진 `10px`