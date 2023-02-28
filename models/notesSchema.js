const mongoose = require("mongoose")

const note = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imgname: {
        type: String,
        required: true
    },
    notecontent: {
        type: String,
        required: true
    },
    imgurl: {
        type: [String], //store array of strings
        required: true
    },
    rooturl: {
        type: String,
        required: true
    }
    
})

const Note = mongoose.model('NOTE',note)

module.exports = Note