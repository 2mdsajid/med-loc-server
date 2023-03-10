const mongoose = require("mongoose")

const biology = mongoose.Schema({
    qn: {
        type: String,
        required: true
    },
    a: {
        type: String,
        required: true
    },
    b: {
        type: String,
        required: true
    },
    c: {
        type: String,
        required: true
    },
    d: {
        type: String,
        required: true
    },
    ans: {
        type: String,
        required: true
    },
    chap: {
        type: String,
        required: true
    },
    img:{
        type: String,
        default:""
    }
    
}) 

const Biology = mongoose.model('BIOLOGY',biology)

module.exports = Biology