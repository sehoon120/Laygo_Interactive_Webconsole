# fileRoute.md - 기본 기능
- /main 아래의 페이지들에 대한 route. /main 아래의 페이지들에서는 각 유저별로 파일을 업로드/삭제/편집이 가능하며, generate 후 레이아웃을 확인하는 것도 가능하다.
    + 사용 기술: express.Router, multer(multimedia 관리)
    + 관리하는 페이지(/main아래의 subURL): / -> 기본 화면, /add -> 파일 신규 생성(업로드) 페이지, /(userID) -> 파일 메타데이터의 수정과 삭제, /(userID)/edit: 파일 내용 수정 , /(userID)/edit/logs: 로그 파일 불러오기

- 연결 controller: controllers/fileController로부터 객체 받아와 이용
    + getAllContacts, createContact, getContact, updateContact, deleteContact, addContactForm, editFile, saveFile, getLogFile => 수정 필요

- 각 페이지별 설명
    + /: get method로 접근 시 getAllContacts controller 함수 객체 호출해 처리->모든 파일 리스트 불러와 getallfiles.ejs로 렌더
    + /add: get method로 접근 시 addContactForm controller 함수 객체 호출해 처리->add.ejs 렌더 / post method로 접근 시 createContact 함수 객체 호출해 처리->유저로부터 입력받은 파일 메타데이터와 데이터(파일을 업로드한 경우) 읽어 저장
    + /(userID): get method로 접근 시 getcontact controller 함수 객체 호출해 처리->update.ejs 렌더 / put method로 접근 시 updateConatct 함수 객체 호출해 처리->file의 name, type, path 업데이트 / delete method 접근 시 deleteContact 객체 호출해 삭제 수행
    + /(userID)/edit: get method로 접근 시 editFile 함수 객체 호출해 처리->수정할 파일 내용 읽어 편집 페이지 렌더 / put method로 접근시 saveFile 함수 객체 호출해 처리->수정내용 받아 저장 / post method로 접근 시 lib, cellname 보내 레이아웃 draw
    + /(userID)/edit/logs: get method로 접근 시 getLogFile 함수 객체 호출해 log 가져옴

- pseudocode
```
# router, multer 사용 설정

# 사용할 객체 import
{getAllContacts, createContact, getContact, updateContact, deleteContact, addContactForm, editFile, saveFile, getLogfile, generateLayout, showLayout} <- Import from controllers/fileController

#routing
router.route('/')
    .get(getAllContacts);

router.route('/add')
    .get(addContactForm)
    .post(upload.single('uploadFile'), createContact);

router.route('/:id')
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);

router.route('/:id/edit')
    .get(editFile)
    .put(saveFile);

router.route('/:id/edit/logs')
    .get(getLogFile);
```

- Edit 페이지에서 Save / Generate / Layout Draw 버튼 분리 (上)
```
# pseudocode
# 각 버튼 라우트 추가
router.post("/file/save", fileController.saveYaml);
router.post("/file/generate", fileController.generateLayout);
router.post("/file/draw", fileController.drawLayout);
```