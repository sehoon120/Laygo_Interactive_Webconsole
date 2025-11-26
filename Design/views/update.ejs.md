# update.ejs - 기본 기능

- 파일의 메타데이터를 수정하는 편집 페이지
- Filename, Filetype, Filepath 수정
- 사용자로부터 정보를 입력받아 PUT method로 서버에 전송

- 기능
    + Filename, path, type을 입력 가능한 Form
    + 이전 페이지(getallfiles.ejs)로 돌아갈 수 있는 버튼

- pseudocode
```
# 전부 HTML로 작성
# 파일 목록 이동(이전 페이지 이동) 버튼
Button+Hyperlink(URL:/main, Query: path = currentPath )

# 수정용 form
form(PUT method, 전송 주소 /main/file_id + Query: path=currentPath) {
    filename => 입력 1(fileName 입력): text 입력
    fileType => 입력 2(fileType 입력): text 입력
    filePath => 입력 3(filePath 입력): text 입력
    Button: submit 버튼
}
```