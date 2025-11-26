# contactModel.md - 기본 기능
- contact 관련 정보에 대한 DB schema 작성
    + 사용 기술: moongoose
    + contact의 attribute: name, mail, phone, timestamp(생성 시점, 수정 시점) => 사용자명, 사용자의 인증 이메일, 휴대전화번호를 하나로 묶는다.

- 객체 contactSchema
    + moongoose의 schema() attribute function으로 만들어지는 객체로 schema attribute의 특성(type) 정의

- 객체 Contact: contactSchema에 정의된 schema에 따라 model 객체 생성. 해당 객체의 attribute function을 통해 실제 entity에 대한 조작이 가능하다.

- pseudocode
```
# mongoose 사용 설정
mongoose = require('mongoose')

#contactSchema 객체: schema 정의(mongoose 이용)
contactSchema = mongoose.Schema({
    name: {attribute type: string, 필수},
    mail: {attribute type: string },
    phone: {attribute type: string, 필수}
},
{timestamps: true})

#model 객체 생성
Contact = mongoose.model('Contact', contactSchema)
```
