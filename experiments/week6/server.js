
var express = require('express');
var path = require('path');

var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static(path.join(__dirname, '/public')));

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

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);
console.log("Express server listening at port " + port);

module.exports = app;

