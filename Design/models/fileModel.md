# fileModel.md - 기본 기능
- 각 file의 정보(data+metadata)에 대한 schema 작성
    + 사용 기술: moongoose
    + File의 attribute: user, filename, filetype, filepath, content(파일내용), timestamp(생성 시점, 수정 시점)

- 객체 fileSchema
    + moongoose의 schema() attribute function으로 만들어지는 객체로 schema attribute의 특성(type) 정의

- 객체 file: fileSchema에 정의된 schema에 따라 model 객체 생성. 해당 객체의 attribute function을 통해 실제 entity에 대한 조작이 가능하다.

- pseudocode
```
# mongoose 사용 설정
mongoose = require('mongoose')

#fileSchema 객체: schema 정의(mongoose 이용)
fileSchema = mongoose.Schema({
    user: {attribute type: string, 필수},
    filename: {attribute type: string, 필수},
    filetype: {attribute type: string},
    filepath: {attribute type: string, 필수},
    content: {attribute type: string},
    mail: {attribute type: string },
},
{timestamps: true})

#model 객체 생성
file = mongoose.model('file', fileSchema)
```
