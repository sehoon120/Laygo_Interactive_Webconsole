# add.md
- 새로운 파일을 추가하는 화면을 렌더링하는 ejs 파일
    + 기능 1) user로부터 파일 메타데이터를 입력받을 수 있어야 함: 파일 이름, 파일 타입
    + 기능 2) 파일을 로컬에서 업로드 가능해야 함
    + 기능 3) /main으로 돌아갈 수 있는 방법이 있어야 함(뒤로가기가 아닌 방식으로)

- 기능 구현을 위해 필요한 구현
    + 파일 이름을 입력할 form 필요
    + 파일 타입을 입력할 form 필요
    + 파일을 로컬에서 업로드. 이때, 업로드한 파일의 이름과 타입을 메타데이터로 추출해 저장해야 함.

- Pseudocode

```
#HTML part  -> 화면 구성 작성

#/main으로 돌아가기
currentPath <- DB의 내 파일들이 속한 디렉터리 구조에서 현재 위치를 가리키는 변수
button+hyperlink(URL:/main, Query:path=currentPath)                 //저장된 파일 모음에서 현재 위치하는 dirctory를 전달할 필요 있음

#Metadata 입력
form(POST method, file 입력 가능, 전송 주소 /main/add + Query: path=currentPath) {
    filename => 입력 1(fileName 입력): text 입력
    fileType => 입력 2(fileType 입력): text 입력
    uploadFile => 입력 3(file upload): file 입력
    Button: submit 버튼
}

#javascript part -> 파일 직접 업로드 시, 파일 메타데이터 추출을 위한 코드 작성
callback(uploadFile change) {
    file = uploaded file
    fileNameFull = file.name                        #파일이름.확장자
    name = Last dot 앞의 substring
    ext = Last dot 뒤의 substring
    filename, filetype value <- name, ext
}
```