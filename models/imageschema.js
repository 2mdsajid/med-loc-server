const mongoose = require("mongoose")

const imgSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}) 

const ImageModel = mongoose.model('IMAGE',imgSchema)

module.exports = ImageModel
