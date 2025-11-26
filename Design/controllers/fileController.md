# fileController.md - 기본 기능/수정중(2025-7-31)
- /main URL에서 사용될 파일 수정 및 실행과 관련된 함수들 작성
    + /main의 하위 URL에서 실행되는 기능은 다음과 같음: 파일 리스트 표시, 파일의 추가/삭제, 파일 수정, 레이아웃 생성, ...

- 함수 getAllContacts: 파일 리스트 표시를 위해 파일 메타데이터를 DB에서 불러오는 함수
```
#Pseudocode
function getAllContacts(req, res) {
    currentPath <- req.query.path               # query의 현재 경로
    currentUser <- req.user.username
    files <- Find files that (user = currentUser, path = currentPath)
    files.sort(descending, key = updatedAt)
    res.render('getallfiles', {files, currentPath})             #getallfiles.ejs render
}
```

- 함수 addContactForm: 파일을 생성할 때, 관련 페이지 생성(GET 접근)
```
function addContactForm(req, res) {
    currentPath <- req.query.path               # query의 현재 경로
    res.render('add', {currentPath})            # add.ejs render
}
```

- 함수 createContact: 파일을 생성할 때, 사용자 입력값 받음(POST 접근)
```
function createContact(req, res) {
    filename <- req.body.filename
    filetype <- req.body.filetype
    currentpath <- req.query.path
    
    if(filename or filetype is empty)
        error

    map filedata <- {user: req.user.username, filename: filename, filetype: filetype, filepath: currentpath}

    if(req.file is not empty) {
        if(using memory storage) {
            fileData.content <- req.file.buffer
        }
        elif (using disk storage) {
            fileData.content <- read(req.file.path)
        }
        else{
            Do nothing
        }
    }

    create file with filedata

    res.redirect('/main?path=' + encodeURIComponent(currentPath))
}
```

- 함수 getContact: 파일 이름(id) 받아 파일 찾아서 해당 페이지 render
```
function getContact(req, res) {
    file <- File.findByID(req.params.id)
    currentPath <- req.query.path
    res.render('updage', {file, currentPath})            # update.ejs render
}
```

- 함수 updateContact: 파일 경로 변경. Name, type, path를 새로 request 받아 이를 변환. Directory에 대해서도 경로 변경이 가능하므로, 이 경우 하위 파일들에 대해서도 메타데이터를 변환시켜주어야 한다.
```
function updateContact(req, res) = {
    id <- req.params.id;
    name <- req.body.name;
    currentPath <- req.query.path;
    file <- File.findById(id);

    if(file.type is directory) {
        oldDirFullPath <- concat(file.filePath, file.fileName);
        newDirFullPath <- concat(file.filePath + name);

        children <- File.find({filePath: oldDirFullPath/~~ , user: req.user.username});
        for child in children {
            child.filePath <- Replace oldDirFullPath in child.filePath to newDirFullPath;
        }
    }
    file.filename <- name;
    file.filetype <- type;
    file.filePath <- path;
}
```
- 함수 deleteContact: 파일 삭제.
```
function deleteContact(req, res) = {
    id <- req.params.id;
    delete File.findByID(id);
    redirect to current URL;
}
```

- 함수 editFile: 파일 수정. 수정할 File type이 directory이면 해당 directory의 페이지로 redirect, 일반 file이면 파일 내용 수정 페이지 렌더링
```
function editFile(req, res) = {
    id <- req.params.id;
    file <- File.findById(id);
    currentPath <- req.query.path;

    if(fiie.filetype is 'dir') {
        newPath <- concat(currentPath, file.filename);
        redirect to newPath;
    } else {
        render('edit', {file: file, currentPath: currentPath, drawObjectDoc: {}, cellname: 'dummycell'});
    }
}
```

- 함수 saveFile: 파일 저장. file id와 수정할 내용(content) 받아 file에 저장 . 인자로 generate=true 주면 레이아웃 생성. Laygo script file을 실행시켜 yaml 파일로 저장.
    + laygoModify.md의 webconsole.export() 부분의 논의 참고해 작성할 것
```
#Pseudocode
funcion saveFile(req, res){
    id <- req.params.id;
    generate <- req.params.generate;
    content <- req.body;
  
    userDir <- '(temporary directory for yaml file which is used for drawing)/username'

    file <- await File.findById(id);
    if (!file) {
        return res.status(404).json({ error: 'File not found.' });
    }

    file.content <- content;
    file.save();

    if(generate is True and file.filetype is python script){
        username <- req.user.username;
        filename <- Remove filename extension from filepath(file.filename);
        tempCodeDir <- '(temporary directory for script file)';
        tempYamlDir <- '(temporary directory for yaml file)';
        rundir <- '(directory that runs server)';
        tempFile <- concat(tempDir, '(username)_(script file name with path)_temp.py');
        bag_dir <- laygo execution directory;

        save script file at tempFile;

        command <- 'csh -c cd ${bag_dir}; source .cshrc_bag; bash ${bag_dir}/start_bag_test.sh ${username} ${filename} ${tempFile(WSL)} ${runDir(Wsl)}"'
        execute command on child process;
        delete tempfile;
        if(execution end but exited with error){
            return res with (success <- false);
        }

        read yaml files in tempYamlDir/(username);              # Laygo2 수정과 맞지 않는 부분 있어 수정 고려 필요(username/scriptname으로 접근 필요)
        Save or update those yaml files to DB(Query: {user: username, filename: filename with path without extension, filetype: 'yaml" });          # Yaml 파일의 DB 저장 관련 논의 필요 -> 반드시 필요하지는 않으나 이렇게 설계되어있는만큼 굳이 바꿀 필요도 없을 것 같음.
        doc <- yaml.load(tempYamlDir/(requested yaml file name));            # doc의 전달이 반드시 필요한 것은 아님(Draw에 대한 부분 따로 존재)
        return res({success: true, output: stdout, drawObjectDoc: doc, cellname: cellname});
    }
}
```

- 함수 getLogFile: log file 읽어 반환


- Edit 페이지에서 Save / Generate / Layout Draw 버튼 분리 (上)
```
# pseudocode
# File 저장, laygout generate -> saveFile 함수 이용

# drawLayout 함수: 그려낼 libname, cellname을 받아 그에 대한 yaml 파일을 반환
function drawLayout(req, res){
    libname <- req.body.libname;
    cellname <- req.body.cellname;
    username <- req.user.username;
    
    #Local에 yaml 파일 저장한 경우 -> 현재는 DB에서 받도록 함
    #genDir <- '(temporary directory for yaml file)/(username)/(script path)/(libname)';      //Directory that saves yaml files for generator
    #yamlPath <- '(genDir)/(cellname)'
    #doc <- load yaml with path = yamlPath and endcoding = 'utf8'      

    id <- req.params.id;
    file <- File.findById(id);
    return return res.json({ success: true, output: stdout, drawObjectDoc: doc, cellname: cellname, libname: libname });
}
```
