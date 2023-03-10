const mongoose = require("mongoose")

const status = mongoose.Schema({
    visitors: {
        type: Number,
        required: true,
        default: 0
    },
    newvisitors: {
        type: Number,
        required: true,
        default: 0
    },
    liveconnected: {
        type: Array,
        default: []
    }
    
}) 



status.methods.addLiveConnectedUser = function(user) {
    this.liveconnected.push(user)
    return this.save()
  }

  status.methods.addNewVisitor = function() {
    this.newvisitors++
    return this.save()
  }

  status.methods.addVisitor = function() {
    this.visitors++
    return this.save()
  }

const Status = mongoose.model('STATUS',status)

module.exports = Status