var mongoose = require("mongoose")
var Schema = mongoose.Schema
var ArticleSchema = new Schema({
    title:{
        type: String,
        unique:true
    },
    summary:{
        type: String,
        unique:true
    },
    link:{
        type: String,
        unique:true
    },
    comments:[{
        type: String,
        ref: "Comments"
    }]
})

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;