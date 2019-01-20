const express = require("express");
const router = express.Router();
const db = require("../models");
const request = require("request"); 
const cheerio = require("cheerio");
 
router.get("/scrape", (req, res) => {
    console.log("scrape code...")
    request("https://www.nytimes.com/", (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(body);
            let count = 0;
            
            $('article a').each(function (i, element) {
                let count = i;
                let result = {};
                result.title = $(element).text();
                result.link = "https://www.nytimes.com" + $(element).attr("href");
                
                if (result.title && result.link ){
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            count++;
                        })
                        .catch(function (err) {
                            return res.json(err);
                        });
                };
                console.log(result);
            });
            // console.log(result);
            res.redirect('/')
        }
        else if (error || response.statusCode != 200){
            res.send("No new articles")
        }
    });
});

router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            const retrievedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);  
            console.log(hbsObject);      
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (retrievedArticles) {
            let hbsObject;
            hbsObject = {
                articles: retrievedArticles
            };
            res.render("saved", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});

router.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles/:id", function (req, res) {
    db.Article.find({ _id: req.params.id })
        .populate({
            path: 'note',
            model: 'Note'
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});





module.exports = router;