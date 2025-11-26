# edit.ejs - 기본 기능

- 특정 파일을 수정하고 Laygo 레이아웃 캔버스, 로그 터미널, 라이브러리/셀 이름 입력 및 저장 기능을 제공하는 편집 페이지
- AJAX 기반 저장 + 자동 렌더링
- 실시간 로그 출력 (2초 주기 polling)
- 캔버스를 통해 layout 구성 요소(`mask`, `pin`, `subblock`) 시각화

---

- 헤더/페이지 시작
    + `<%- include('./include/_header') %>`: 공통 헤더 불러오기
    + `<main id="site-main" class="container my-4">`: 전체 페이지 컨텐츠 시작

---

- 좌측 영역 (파일 수정)
    + 파일 이름 제목: `<h2><%= file.filename %></h2>`
    + 폼: `<form id="editForm"...>`
    + `textarea`로 기존 파일 내용(`file.content`) 수정
    + 저장 버튼: `Save` → 서버에 PUT 요청 전송. 인자로 generate = false 준다.
    + Laygo 실행 버튼: `Save & Generate` → 서버에 PUT 요청 전송. 인자로 generate = true 준다.
    ```
    # Pseudocode
    # Edit 페이지에서 Save / Generate / Layout Draw 버튼 분리 (上)
    <button type="submit" class="btn btn-primary">Save & Generate</button>
    change to 
    <button id="saveBtn">Save</button>
    <button id="generateBtn">Generate</button>
    <button id="drawBtn">Draw Layout</button>

    # js 이벤트 핸들러 추가
    <script>
    document.getElementById("saveBtn").addEventListener("click", () => {
        fetch("/file/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: "<%= file.name %>", content: editor.getValue() })
        }).then(res => res.ok ? alert("Saved!") : alert("Save failed"));
    });

    document.getElementById("generateBtn").addEventListener("click", () => {
        fetch("/file/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: "<%= file.name %>" })
        }).then(res => res.ok ? alert("Generation complete!") : alert("Generation failed"));
    });

    document.getElementById("drawBtn").addEventListener("click", () => {
        fetch("/file/draw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: "<%= file.name %>" })
        }).then(res => res.json()).then(data => {
            renderLayout(data); // ← layout draw 함수 쓰기
        });
    });
    </script>
    ```
    + Layout draw 버튼: `Draw` → draw 하는 script 실행.

---
- 우측 영역 (Canvas 및 입력 필드)
    + `<canvas id="canvas"...>`:
  레이아웃 정보(`mask`, `pin`, `subblock`) 시각화
    + 마우스 드래그로 이동, 마우스 휠로 줌 인/아웃 가능
    + 자동 배율/이동 상태 추적(`trackTransforms`) 구현

    ```
    # pseudocode
    # Origin 기준 X, Y 축 표시 (中)
    function redraw() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // === origin 축 표시 ===
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#444";  // 연한 회색
    const pt0 = ctx.transformedPoint(0, 0);
    const ptX1 = ctx.transformedPoint(canvas.width, 0);
    const ptY1 = ctx.transformedPoint(0, canvas.height);

    // X축
    ctx.beginPath();
    ctx.moveTo(ptX1.x, pt0.y);
    ctx.lineTo(pt0.x, pt0.y);
    ctx.stroke();

    // Y축
    ctx.beginPath();
    ctx.moveTo(pt0.x, ptY1.y);
    ctx.lineTo(pt0.x, pt0.y);
    ctx.stroke();
    ctx.restore();

    // === 기존 레이아웃 그리기 ===
    rectList.forEach(rect => {
        if (rect[6]) {
        ...
        }
    });
    }
    ```

---

- 터미널 영역
    + `<div id="terminal">`:
  서버 로그 출력 영역 (글꼴: monospace, 글자색: lime, 배경: 검정)
    + 2초마다 `/main/:id/edit/logs`로 fetch 요청하여 실시간 로그 표시

---

- 주요 스크립트 기능
1. 캔버스 초기화 및 레이아웃 렌더링 함수
    + `buildMap(docs, cellname, libname)`
        + 마스크(`masks`), 핀(`pins`), 서브블록(`subblocks`)을 캔버스에 렌더링
        + 서브블록 위치, 방향(MX) 고려하여 배치
    + `redraw()`: rectList를 순회하며 캔버스 요소 렌더링

2. 캔버스 상호작용
    + 마우스 드래그로 이동
    + 마우스 휠로 확대/축소 (`zoom`)
    + `trackTransforms`로 이동/확대 상태 추적

3. AJAX 폼 제출 (파일 저장 및 자동 캔버스 업데이트)
    + `editForm` `submit` 이벤트 핸들러
        + 저장 요청 후 JSON 응답 받아 `drawObjectDoc` 재구축 → 캔버스 갱신
        + 메시지 영역(`id="message"`)에 결과 메시지 출력

4. 로그 출력 (Polling)
    + `setInterval`(2000ms)로 로그 fetch 요청 반복
    + 응답이 JSON 형식이면 로그 텍스트를 터미널에 표시

---

- 서버에서 응답으로 전달된 YAML 파싱 결과(`drawObjectDoc`)를 기반으로 시각화 수행
- 레이아웃 정보: Python 스크립트 실행 → YAML 생성 → DB 저장 → 클라이언트 fetch → 렌더