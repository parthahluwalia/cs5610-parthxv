//includes
var util = require('util'),
  twitter = require('twitter'),
  sentimentAnalysis = require('./sentimentAnalysis'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);

//config
var config = {
  consumer_key: 'YYANnJ8R7l1E7zcL8UJMYTi35',
  consumer_secret: 'FSRatYv9keBKsYx9sHKlYosJZH0pFGiCA2sHJndNTTOdd5t3Fo',
  access_token_key: '2955363323-RvnRm4Bi1BpP7Kjp3CyUmHFsJqdKpm06Dfoovv8',
  access_token_secret: 'rxcQ1p8xbuVmbOQ5kofMC4sj7Sr9JFxonzVGatlE5SsAh'
}

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment
  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};
      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        "tweet" : resp.tweet.text,
        "score" : resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}
