const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, '전화번호는 꼭 입력하기']
    }
},
{timestamps: true});






const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;