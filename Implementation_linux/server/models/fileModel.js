const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const File = new Schema( {
    user: { 
        type: String,
        required: true 
    },
    filename: {
        type: String,
        required: true
    },
    filetype: {
        type: String
        // required: true
    },
    filePath: { 
        type: String, 
        required: true 
    },
    content: {
        type: String
    }
}, { timestamps: true });


module.exports = mongoose.model('File', File);