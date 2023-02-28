const mongoose = require("mongoose")

const newtest = mongoose.Schema({
    testtitle: {
        type: String,
        required: true
    },
    testname: {
        type: String,
        required: true
    },
    physics: {
        type: String,
        required: true
    },
    chemistry: {
        type: String,
        required: true
    },
    biology: {
        type: String,
        required: true
    },
    mat: {
        type: String,
        required: true
    },
    time: {
        type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        repeatafter: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    archive: {
        type: Boolean,
        required: true,
        default: false
    },
    usersattended: [
        {
            username: {
                type: String,
                required: true
            },
            totalscore: {
                type: String,
                required: true
            }
        }
    ]

})


// STORE TESTS DATA FOR SPECIFIC USERS
newtest.methods.addAttendedUsers = async function (username, totalscore) {
    try {
        //this => selecting the current user (schema)
        //this.usersattended => the usersattended of the user
        // replacing original this.usersattended by new after concating the new values
        this.usersattended = this.usersattended.concat({ username, totalscore })
        await this.save()
        return this.usersattended
    } catch (error) {
        console.log(error);
    }

}

// STORE TESTS DATA FOR SPECIFIC USERS
newtest.methods.changeCategoryValue = async function () {
    try {
        //this => selecting the current user (schema)
        //this.usersattended => the usersattended of the user
        // replacing original this.usersattended by new after concating the new values
        this.category = 'archive'
        await this.save()
        return this.category
    } catch (error) {
        console.log(error);
    }

}

const NewTest = mongoose.model('NEWTESTS', newtest)

module.exports = NewTest