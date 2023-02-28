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
    }
    
}) 

const Chemistry = mongoose.model('CHEMISTRY',chemistry)

module.exports = Chemistry