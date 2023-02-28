const mongoose = require("mongoose")

const test = mongoose.Schema({
    testmode: {
        type: String,
        required: true
    },
    messages: [
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



// STORE MESSAGES
userSchema.methods.addMessage = async function (username,totalscore){
    try {
        this.messages = this.messages.concat({username,totalscore})
        await this.save()
        return this.messages 
    } catch (error) {
        console.log(error);
    }

}

const Test = mongoose.model('TEST',test)

module.exports = Test