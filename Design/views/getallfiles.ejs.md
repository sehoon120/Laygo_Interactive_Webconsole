# getallfiles.md
- 전체 파일 리스트의 출력을 주요 기능으로 하는 페이지의 렌더링
    + 기능 1) DB에 저장된 사용자의 파일 리스트를 출력해야 함. 
    + 기능 2) 파일 업로드를 위한 하이퍼링크 제시
    + 기능 3) 이때 각 파일의 이름, 확장자, 수정일자의 표시가 가능해야 함.
    + 기능 4) 내용 수정(edit), 메타데이터 수정을 위한 페이지에의 하이퍼링크 필요. 또, 파일 삭제가 가능해야 함
    + 기능 5) 디렉터리 이용의 지원을 위해, 상위 디렉터리로 돌아가는 기능이 필요

- 기능을 위해 필요한 구현
    + 현재 디렉터리에서의 파일 리스트 출력. 리스트는 파일명, 확장자, 수정일자, 내용/메타데이터 수정을 위한 하이퍼링크(버튼), 파일 삭제 버튼으로 구성됨
    + 파일 추가를 위한 버튼

- Pseudocode

```
#Helper function formatDate(수정 시점 문자열로 반환)->생략
#Helper function parentDir(path 받아 부모 디렉터리 path 반환)->생략
# HTML part
# 파일 업로드 위한 버튼
Button: "Add file", hyperlink to /main/add?path=<%= currentPath %>

#파일 리스트 출력할 디렉터리 이동: root, 상위 디렉터리 이동의 방법 제공
Button1: link to "/main?path=/"
Button2: link to parent-folder #parent-folder의 id 주고 script로 처리

#파일 리스트 출력
Table: 파일명, 파일 유형, 수정일자, {내용수정버튼, 메타데이터 수정 버튼, 파일 삭제 버튼}의 열을 가짐. 각 행이 하나의 파일 표현
즉,
<thead>이름 | 유형 | 수정 일자 및 수정 버튼 | 공백($nbsp)</thead>
<tbody>
files.forEach(file => {
    print(file.filename, file.filetype, formatDate(file.updatedAt), {link to /main/file._id/edit, link to /main/file._id, link to /main/file._id with delete method}
})
</tbody>

#script part -> 현재 경로와 부모 디렉터리 경로 계산
currentPath = (server side)currentPath
parentFolderLink = concat("/main?path=", getParentPath(currentPath))
function getParentPath(path) {
    if (path is root){
        return root
    }else{
        pieces = split path with '/';
        eliminate last elem from pieces;
        concat pieces with '/';
        return pieces;
    }
}

```