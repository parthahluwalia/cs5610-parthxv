
var express = require('express');
var path = require('path');

var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static(path.join(__dirname, '/public')));

// Access-Control-Allow-Origin from localhost... (Can also remove this)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.get('/', function(req, res) {
    res.send("Hello from node server");
});

/********************************
*           EXPERIMENT 2        *
*********************************/
var sentimentsExp2 = [
    { phrase: "node.js is awesome", score: "10" },
    { phrase: "feeling sick, damn!", score: "-2" },
    { phrase: "Northeastern is doing okay today", score: "0" },
    { phrase: "Just tried my hand at meatballs spaghetti, it tastes aweful", score: "-5" }

];

app.get('/experiment2/api/sentiment', function (req, res) {
    //res.sendfile('./public/experiment2.html');
    res.json(sentimentsExp2);
});

app.get('/experiment2/api/sentiment/:index', function (req, res) {
    var idx = req.params.index;
    res.json(sentimentsExp2[idx]);
});

/********************************
*       END OF EXPERIMENT 2     *
********************************/

/********************************
*           EXPERIMENT 3        *
*********************************/

app.get('/experiment3', function (req, res) {
    res.sendfile('./public/wk6-exp3.html');
});

/********************************
*       END OF EXPERIMENT 3     *
********************************/

/********************************
*           EXPERIMENT 4        *
*********************************/

//var sentiment = require('sentiment');

app.get('/experiment4', function (req, res) {
   // var senti = sentiment('This is awesome');
    //console.log(senti);
    res.sendfile('./public/wk6-exp4.html');
});

/********************************
*       END OF EXPERIMENT 4     *
********************************/

/********************************
*           EXPERIMENT 5        *
*********************************/

//var sentiment = require('sentiment');

var analyzedSentiments = [];

app.get('/experiment5', function (req, res) {
    //analyzedSentiments 
    analyzedSentiments = analyzedSentiments;
    res.sendfile('./public/wk6-exp5.html');
});

app.get('/experiment5/api', function (req, res) {
    res.json(analyzedSentiments);
});

app.post('/experiment5', function (req, res) {
    analyzedSentiments.push(req.body);
    res.json(analyzedSentiments);
});

app.delete('/experiment5/:index', function (req, res) {
    var index = req.params.index;
    analyzedSentiments.splice(index, 1);
    res.json(analyzedSentiments);
});

/********************************
*       END OF EXPERIMENT 5     *
********************************/


/********************************
*          WK7-EXP1 & 2          *
*********************************/

var twitter = require('twitter');

var config = {
    consumer_key: 'qEgkPlFNdyRIFVC44g2LqLgfk',
    consumer_secret: 'p4MlqqJnnTDg6pTcNOjonjr0nNHZyONwYssDq5wbUEfhTYm3wu',
    access_token_key: '2955363323-H6k63ftQApGw2sklI8NipHpbSUvnm6eKhvP7nzF',
    access_token_secret: 'x5S0cXd7ZSlIKJhEi6KPQHcmzLEbxz2CW21tVxogKgoyk'
};

app.get('/wk7-exp1', function (req, res) {
    res.sendfile('./public/wk7-exp1.html');
});

app.get('/wk7-exp1/connect', function (req, res) {
    var twitterClient = new twitter(config);
    res.json(twitterClient);
});

app.get('/wk7-exp2', function (req, res) {
    res.sendfile('./public/wk7-exp2.html');
});

app.get('/wk7-tweet/:searchText', function (req, res) {
    var searchText = req.params.searchText;

    var twitterClient = new twitter(config);
    //Search
    console.log(searchText);
    twitterClient.get('search/tweets', { q: searchText }, function (error, tweets, response) {
        //console.log(tweets);
        res.json(tweets);
    });

});

/*********************************
*      END OF WK7-EXP1 & 2       *
*********************************/

/*********************************
*         WK7-EXP3 & 4           *
*********************************/

app.get('/wk7-exp3', function (req, res) {
    res.sendfile('./public/wk7-exp3.html');
});

var sentiment = require('sentiment');

app.get('/wk7-exp3/:searchText', function (req, res) {
    //Connect to Twitter
    var twitterClient = new twitter(config);

    //Search the tweets and analyze the sentiment of each tweet
    var searchText = req.params.searchText;
    var tweetSentiment = [];
    twitterClient.get('search/tweets', { q: searchText }, function (error, tweets, response) {
        var status = tweets.statuses;
        for (var i in status) {
            tweetSentiment.push({
                tweet: status[i].text,
                sentiment: sentiment(status[i].text)
            });
            
        }

        res.json(tweetSentiment);
        
    });
});

app.get('/wk7-exp4', function (req, res) {
    res.sendfile('./public/wk7-exp4.html');
});

/*********************************
*      END OF WK7-EXP3 & 4       *
*********************************/

/*********************************
*           WK7-EXP5             *
*********************************/

app.get('/wk7-exp5', function (req, res) {
    res.sendfile('./public/wk7-exp5.html');    
});

app.post('/wk7-exp5/:tweetText', function (req, res) {
    var tweetText = req.params.tweetText;
    var client = new twitter(config);

    //Tweet Text
    console.log(tweetText);

    client.post('statuses/update', {status: tweetText}, function(error, tweet, response){
        if (!error) {
            //console.log(tweet);
            res.json(tweet);
        } else {
            console.log(error);
        }
    });
});

/*********************************
*        END OF WK7-EXP5         *
*********************************/

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);
console.log("Express server listening at port " + port);

module.exports = app;

