const mongoose = require("mongoose")

const chemistry = mongoose.Schema({
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

const Chemistry = mongoose.model('CHEMISTRY',chemistry)

module.exports = Chemistry