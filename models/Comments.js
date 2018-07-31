var mongoose = require("mongoose")
var Schema = mongoose.Schema
var CommentsSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
})

var Comments = mongoose.model("Comments", CommentsSchema)
module.exports = Comments