const mongoose = require('mongoose')

const messageModel = mongoose.Schema({
    sender : { type:mongoose.Schema.Types.ObjectId, ref: "User"},
    content: { type: String, trim: true},
    type: { 
        type: String,
        default: "text"
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    original_name:{
        type: String,
    },
    file: {
        type: String,
    },
    chat: {type:mongoose.Schema.Types.ObjectId, ref: "Chat"},
},
{
    timestamps: true,
})

const Message = mongoose.model("Message", messageModel)

module.exports = Message