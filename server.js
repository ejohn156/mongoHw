var express = require("express")
var exphbs = require("express-handlebars")
var mongoose = require("mongoose")
var body = require("body-parser")
var cheerio = require("cheerio")
var request = require("request")

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
var db = require("./models");

app.get("/scrapedData", function (req, res) {
  request("https://www.panthers.com/news/", function (error, response, html) {
    var $ = cheerio.load(html);
    var results = [];
    $("div.d3-l-col__col-3").each(function (i, element) {
      var title = $(element).find("h3.d3-o-media-object__title").text().trim();
      var summary = $(element).find("div.d3-o-media-object__summary").text().trim();
      var link = $(element).find("a").attr("href")

      results.push({
        title: title,
        summary: summary,
        link: link
      });
    });
    results.forEach(function (element) {
      
      db.Article.create(element)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          return res.json(err);
        });
    })
    res.json(results);
  });
})
app.get("/", function (req, res) {
  db.Article.find({}, function (err, results) {
    var findResults
    res.render("./articleList", { findResults: results })
  })
})
app.get("/indScrapedData/:id", function (req, res) {
  db.Article.findById(req.params.id)
    .populate("comments")
    .then(function (data) {
      var findIndResults
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })

})
app.get("/ind/:id", function (req, res) {
  db.Article.findById(req.params.id)
    .populate("comments")
    .then(function (data) {
      var article
      res.render("./indArticle", {article:data})
    }).catch(function (err) {
      console.log(err)
    })
})
app.post("/ind/:id", function(req, res){
  console.log(req.body)
  var articleId = req.params.id
  db.Comments.create({title:"test", body:"test"})
  .then(function(dbComment){
    console.log(dbComment)
    return db.Article.findByIdAndUpdate(articleId, { $push: { comments: dbComment._id } }, { new: true })
  }).catch(function(err){
    console.log(err)
  })
  .then(function(dbArticle){
    res.json(dbArticle)
  })
  .catch(function(err){
    console.log(err)
  })
})

app.delete("/ind/:commentId", function(req,res){
  db.Comments.findByIdAndRemove(req.params.commentId, function(err,res){
    if(err) console.log(err)
    console.log(res)
  })
})


app.listen(3000, function () {
  console.log("App running on port 3000!");
});

