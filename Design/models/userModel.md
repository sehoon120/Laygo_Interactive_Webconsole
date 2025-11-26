# userModel.md - 기본 기능
- 각 user의 정보(data+metadata)에 대한 schema 작성
    + 사용 기술: moongoose
    + User의 attribute: username, password, email
    + timestamp data는 딱히 필요없다.

- 객체 userSchema
    + moongoose의 schema() attribute function으로 만들어지는 객체로 schema attribute의 특성(type) 정의

- 객체 user: userSchema에 정의된 schema에 따라 model 객체 생성. 해당 객체의 attribute function을 통해 실제 entity에 대한 조작이 가능하다.

- pseudocode
```
# mongoose 사용 설정
mongoose = require('mongoose')

#fileSchema 객체: schema 정의(mongoose 이용)
fileSchema = mongoose.Schema({
    username: {attribute type: string, 필수},
    password: {attribute type: string, 필수},
    email: {attribute type: string, 필수, unique(반드시 그래야 하나? 생각필요)},
})

#model 객체 생성
user = mongoose.model('user', userSchema)
```
