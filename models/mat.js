const mongoose = require("mongoose")

const mat = mongoose.Schema({
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
    img:{
        type: String,
        required: true
    }
    
}) 

const Mat = mongoose.model('MAT',mat)

module.exports = Mat