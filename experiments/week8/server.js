var express = require('express');
var path = require('path');

var app = express();
var bodyParser    = require('body-parser');
var multer        = require('multer');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var twitter       = require('twitter');
var sentiment     = require('sentiment');
var trainedData   = require('./public/js/trained-data.js');
var TwitterStrategy = require('passport-twitter').Strategy;
var findOrCreate = require('mongoose-findorcreate');

//console.log(trainedData);

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
app.use(session({ secret: 'a secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
    res.send("Hello from node server");
});

var TWITTER_CONSUMER_KEY = 'qEgkPlFNdyRIFVC44g2LqLgfk';
var TWITTER_CONSUMER_SECRET = 'p4MlqqJnnTDg6pTcNOjonjr0nNHZyONwYssDq5wbUEfhTYm3wu';

var config = {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
};

//Connect to Twitter
var twitterClient = new twitter(config);

app.get('/phrase-sentiment/:searchText', function (req, res) {

    //Search the tweets and analyze the sentiment of each tweet
    var searchText = req.params.searchText;
    var tweetSentiment = [];
    twitterClient.get('search/tweets', { q: searchText }, function (error, tweets, response) {
        var status = tweets.statuses;
        for (var i in status) {
            tweetSentiment.push({
                tweet: status[i].text,
                sentiment: sentiment(status[i].text, trainedData)
            });

        }
        res.json(tweetSentiment);
    });
});

//Search Users
app.get('/user-search/:user', function (req, res) {
    var user = req.params.user;
    twitterClient.get('users/search', { q: user }, function (error, users, response) {
        res.json(users);
    });
});

//Show user
app.get('/statuses-user_timeline/:screen_name', function (req, res) {
    var userScreenName = req.params.screen_name;
    twitterClient.get('statuses/user_timeline', { screen_name: userScreenName }, function (error, statuses, response) {
        res.json(statuses);
    });

    /*
    var requiredUserDetails = req.params.screen_name.split("&&");
    twitterClient.get('users/show', {
        user_id: requiredUserDetails[0],
        screen_name: requiredUserDetails[1]
    }, function (error, userDetails, response) {
        res.json(userDetails);
    });
    */
});

/* Commenting database code for now
//Connect to database "sentimentnw"
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/sentimentnw';
mongoose.connect(connectionString);

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
}, {collection: 'user'});

var UserModel = mongoose.model('UserModel', UserSchema);

passport.use(new LocalStrategy(
    function(username, password, done) {
    UserModel.findOne({ username: username, password: password }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
        return done(null, false, { message: 'Incorrect username/password' });
        }

        return done(null, user);
    });
  }
));
*/

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    var user = req.user;
    console.log(user);
    res.json(user);
});

//Sign In with Twitter - Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// GET /auth/twitter
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitter authentication will involve redirecting
//   the user to twitter.com.  After authorization, the Twitter will redirect
//   the user back to this application at /auth/twitter/callback
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });


// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(res);
    res.redirect('/');
  });





var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);
console.log("Express server listening at port " + port);

module.exports = app;
