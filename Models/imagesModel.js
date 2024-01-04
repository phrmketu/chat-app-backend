const mongoose = require('mongoose')

const ImagesSchema = new mongoose.Schema({
    image: String,
    original_name: String,
    mime_type: String,
},{
    timestamps: true
})

const ImagesModel = mongoose.model("images", ImagesSchema)
module.exports = ImagesModel