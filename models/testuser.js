const mongoose = require("mongoose")

const testuser = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userlevel: {
        type: String,
        required: true
    },
    testmode: {
        type: String,
        required: true
    },
    totalscore: {
        type: String,
        required: true
    },
    totalwrong: {
        type: String,
        required: true
    },
    totaltimetaken: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now
    }

})

const TestUser = mongoose.model('TESTUSER', testuser)

module.exports = TestUser