const mongoose = require("mongoose")

const physics = mongoose.Schema({
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

const Physics = mongoose.model('PHYSICS',physics)

module.exports = Physics