const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')

const user = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // STROING AN OBJECT OF TESTS ATTENDED BY THE USER
    tests: [
        {
            testmode: {
                type: String,
                required: true
            },
            testtitle: {
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
            unattempt: {
                type: String,
                required: true
            },
            totaltimetaken: {
                type: String,
                required: true
            },
            questions: [
                {
                    _id: {
                        type: String,
                        required: true
                    },
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
                    uans: {
                        type: String,
                        required: true
                    }
                }
            ],
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

// GENERATINNG AND STORING JWT TOKEN IN USER DATABASE
// TOKEN JWT
user.methods.GenerateAuthToken = async function () {
    try {
        console.log(this._id)
        let tokenGenerated = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        // REPLACING THE OLD THIS.TOKENS BY NEW THIS.TOKENS WHICH HAS CINCATED THE VALUE
        this.tokens = this.tokens.concat({ token: tokenGenerated })
        await this.save()
        return tokenGenerated;
    } catch (error) {
        console.log(error);
    }
}

// STORE TESTS DATA FOR SPECIFIC USERS
user.methods.addTest = async function (testmode, testtitle, totalscore, totalwrong, unattempt, totaltimetaken,questions) {
    try {
        //this => selecting the current user (schema)
        //this.tests => the tests of the user
        // replacing original this.tests by new after concating the new values

        // console.log('questions in userschema add method',questions)
        // this.tests.questions = this.tests.questions.concat(questions)
        this.tests = this.tests.concat({ testmode, testtitle, totalscore, totalwrong, unattempt, totaltimetaken,questions })
        await this.save()
        return this.tests
    } catch (error) {
        console.log(error);
    }

}

const User = mongoose.model('USER', user)

module.exports = User