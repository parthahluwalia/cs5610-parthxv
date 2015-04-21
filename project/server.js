var express = require('express');
var path = require('path');

var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var twitter = require('twitter');
var sentiment = require('sentiment');
var trainedData = require('./public/js/trained-data.js');
var TwitterStrategy = require('passport-twitter').Strategy;
var findOrCreate = require('mongoose-findorcreate');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

//console.log(trainedData);

app.use(express.static(path.join(__dirname, '/public')));

//View Engine
var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

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

var TWITTER_CONSUMER_KEY = '';
var TWITTER_CONSUMER_SECRET = '';

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
                //tweet: status[i].text,
                tweet: status[i],
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
//Forward - Backward Fix - START                                                                           
app.get('/profile/:screen_name', function (req, res) {
    //app.get('/profile/:id', function (req, res) {
    var userScreenName = req.params.screen_name;

    twitterClient.get('statuses/user_timeline', { screen_name: userScreenName }, function (error, statuses, response) {
        var lastSentimentStatuses;
        if (statuses.length > 0) {
            var lastSentimentScore = sentiment(statuses[0].text);
            var comparative = lastSentimentScore.comparative;

            var sentimentAdj = null;
            if (0 < comparative && comparative < 0.15) {
                sentimentAdj = "fine"
            } else if (0.15 <= comparative && comparative < 0.3) {
                sentimentAdj = "incredible"
            } else if (0.3 < comparative && comparative < 0.6) {
                sentimentAdj = "fantabulous"
            } else if (comparative >= 0.6) {
                sentimentAdj = "spectacularly out of the world"
            } else if (comparative === 0) {
                sentimentAdj = "okay"
            } else if (-0.1 < comparative && comparative < 0) {
                sentimentAdj = "not that good"
            } else if (-0.25 < comparative && comparative <= -0.1) {
                sentimentAdj = "lousy"
            } else if (-0.55 < comparative && comparative <= 0.25) {
                sentimentAdj = "awful"
            } else if (comparative <= -0.55) {
                sentimentAdj = "awfully bad"
            }

            lastSentimentStatuses = {
                statuses: statuses,
                lastSentiment: lastSentimentScore,
                sentimentAdj: sentimentAdj
            };
        } else {
            lastSentimentStatuses = {
                statuses: "No status has been posted by the user on Twitter!",
                lastSentiment: 0,
                sentimentAdj: "(guessing) okay"
            };
        }

        res.json(lastSentimentStatuses);
    });

});

//Connect to database "sentimentnw"
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/sentimentnw';
mongoose.connect(connectionString);

var UserSchema = new mongoose.Schema({
    twitterId: String,
    username: String,
    displayName: String,
    description: String,
    twitter_followers_count: Number,
    twitter_friends_count: Number,
    profile_image_url: String

}, { collection: 'user' });

var UserModel = mongoose.model('UserModel', UserSchema);

//Sign In with Twitter - Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://sentiments-cs5610parthxv.rhcloud.com/auth/twitter/callback"
    //callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
},
  function (token, tokenSecret, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

          //Check if a user exists in the database. If a user doesn't 
          //exists in the database, create their record in our database.
          UserModel.findOne({ twitterId: profile.id }, function (err, user) {
              if (err) {
                  console.log(err);
              }
              if (!err && user != null) {
                  done(null, user);
              } else {

                  //Render the received profile pic to a bigger one!
                  var imgURL = profile._json.profile_image_url;
                  if (imgURL.substring(imgURL.length - 4) === "jpeg") {
                      var profile_img_400x400 = imgURL.substring(0, imgURL.length - 12) + "_400x400.jpeg";
                  } else if (imgURL.substring(imgURL.length - 3) === "jpg") {
                      var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.jpg";
                  } else if (imgURL.substring(imgURL.length - 3) === "png") {
                      var profile_img_400x400 = imgURL.substring(0, imgURL.length - 11) + "_400x400.png";
                  }

                  //Generate the user object to be inserted in the database
                  var user = new UserModel({
                      twitterId: profile.id,
                      username: profile.username,
                      displayName: profile.displayName,
                      description: profile._json.description,
                      twitter_followers_count: profile._json.followers_count,
                      twitter_friends_count: profile._json.friends_count,
                      profile_image_url: profile_img_400x400
                  });

                  user.save(function (err) {
                      if (err) {
                          console.log(err);
                      } else {
                          console.log("Saving user...");
                          done(null, user);
                      }
                  });
              }
          });

          //return done(null, profile);
      });
  }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// GET /auth/twitter
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitter authentication will involve redirecting
//   the user to twitter.com.  After authorization, the Twitter will redirect
//   the user back to this application at /auth/twitter/callback
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function (req, res) {
      // The request will be redirected to Twitter for authentication, so this
      // function will not be called.
  });


// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function (req, res) {
      res.redirect('/');
  });

app.get('/account', ensureAuthenticated, function (req, res) {
    //console.log(req.user);
    //Let's get the people being monitored by current user
    var twitterId = req.user.twitterId;

    twitterClient.get('users/show', { user_id: twitterId }, function (error, user, response) {

        //Get the number of people being monitored by the user
        FolloweeFollowerModel.find({
            $and: [
                { follower: twitterId },
                { end: { $exists: false } }
            ]
        }, function (err, followees) {
            if (err) {
                console.log(err);
            } else {

                var currentUserInfo = {
                    twitterId: twitterId,
                    profile_image_url: req.user.profile_image_url,
                    user: user,
                    monitoredNumber: followees.length
                };
                //Send the current user info
                res.json(currentUserInfo);
            }
        });
    });

});

// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

//This will just get and send the current logged in user!
app.get('/current-user', ensureAuthenticated, function (req, res) {
    res.json(req.user);
});

//Friends list - List of People a person is following
app.get('/friends/list/:twitterId', function (req, res) {
    var twitterId = req.params.twitterId;
    //console.log("In friends/list for " + twitterId);
    twitterClient.get('friends/list', { user_id: twitterId }, function (error, friends, response) {
        res.json(friends);
    });
});

//Monitor a person - Followers / Followee Mongo Implementation
var FolloweeFollowerSchema = new mongoose.Schema({
    followee: Number,
    follower: Number,
    start: Date,
    //last: Date,
    end: Date
}, { collection: 'followee_follower' });

var FolloweeFollowerModel = mongoose.model('FolloweeFollowerModel', FolloweeFollowerSchema);

//Save the followee-follower in the database
app.post('/account/follow', function (req, res) {
    var followee = req.body.followee;
    var follower = req.body.follower;
    console.log("Followee: " + followee);
    console.log("Follower: " + follower);
    var currentDate = new Date();

    //Check if the followee-follower record exists in the database, with 
    //no 'end' field, if it does, don't create a new document
    FolloweeFollowerModel.findOne({
        $and: [
            { followee: followee },
            { follower: follower },
            { end: { $exists: false } }
        ]
    }, function (err, followeeFollowerRecord) {
        if (err) {
            console.log(err);
        } else if (!err && followeeFollowerRecord != null) {
            console.log("The follower is already following the respective followee. Below are the document details:");
            console.log(followeeFollowerRecord);
        } else {

            //Create a new follower-followee record in the database to for monitoring!
            var followeeFollower = new FolloweeFollowerModel({
                followee: followee,
                follower: follower,
                start: new Date(),
            });

            followeeFollower.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saving the followee: " + followee);
                }
            });

            res.send(200);
        }
    });
});

//Check whether to show "Monitor" or "UnMonitor" button
app.get('/account/check-following/:followeeId', function (req, res) {
    var followee = req.params.followeeId;
    var follower = req.user.twitterId;

    //Check if the followee-follower record exists in the database, with 
    //no 'end' field, if it does, don't create a new document
    FolloweeFollowerModel.findOne({
        $and: [
            { followee: followee },
            { follower: follower },
            { end: { $exists: false } }
        ]
    }, function (err, followeeFollowerRecord) {
        if (err) {
            console.log(err);
        } else if (!err && followeeFollowerRecord != null) {
            console.log("The follower is already following the respective followee. Show UnMonitor button");
            var status = "monitoring";
            res.send(status);
        } else {
            var status = "not monitoring"
            res.json(status);
        }
    });
});

app.get('/account/monitoredFriends/lookup/:loggedInUser', function (req, res) {
    var loggedInUser = req.params.loggedInUser;

    FolloweeFollowerModel.find({
        $and: [
            { follower: loggedInUser },
            { end: { $exists: false } }
        ]
    }, function (err, followees) {
        if (err) {
            console.log(err);
        } else {
            var friendsToLookup = [];
            for (var i in followees) {
                friendsToLookup.push(followees[i].followee);
            }
            var friendsLookupStr = friendsToLookup.join(',');

            console.log("Looking up friends: " + friendsLookupStr);
            //Make request to twitter
            twitterClient.get('users/lookup', { user_id: friendsLookupStr }, function (error, statuses, response) {
                res.json(statuses);
            });
        }
    });

});

//Unfollow / Unmonitor a person!
app.post('/account/unfollow', function (req, res) {
    var followee = req.body.followee;
    var follower = req.body.follower;
    console.log("Followee: " + followee);
    console.log("Follower: " + follower);
    var endDate = new Date();

    //Check if the followee-follower record exists in the database, with 
    //no 'end' field, if it does, add an end field
    FolloweeFollowerModel.findOne({
        $and: [
            { followee: followee },
            { follower: follower },
            { end: { $exists: false } }
        ]
    }, function (err, followeeFollowerRecord) {
        if (err) {
            console.log(err);
        } else if (!err && followeeFollowerRecord != null) {
            console.log("Unfollowing the below document details, found in the database:\n");
            console.log(followeeFollowerRecord);
            followeeFollowerRecord.update({ $set: { end: endDate } }, function (err, doc) {

                FolloweeFollowerModel.find({
                    $and: [
                        { follower: follower },
                        { end: { $exists: false } }
                    ]
                }, function (err, followees) {
                    if (err) {
                        console.log(err);
                    } else {
                        var friendsToLookup = [];
                        for (var i in followees) {
                            friendsToLookup.push(followees[i].followee);
                        }
                        var friendsLookupStr = friendsToLookup.join(',');

                        console.log("Looking up friends: " + friendsLookupStr);
                        //Get details from twitter...
                        twitterClient.get('users/lookup', { user_id: friendsLookupStr }, function (error, statuses, response) {
                            res.json(statuses);
                        });
                    }
                });
            });
        } else {
            console.log("The respective record does not exist in the database.")
        }
    });
});

//Unfollow / Unmonitor a person from his profile
app.post('/account/unfollow-profile', function (req, res) {
    var followee = req.body.followee;
    var follower = req.body.follower;
    console.log("Followee: " + followee);
    console.log("Follower: " + follower);
    var endDate = new Date();

    //Check if the followee-follower record exists in the database, with 
    //no 'end' field, if it does, add an end field
    FolloweeFollowerModel.findOne({
        $and: [
            { followee: followee },
            { follower: follower },
            { end: { $exists: false } }
        ]
    }, function (err, followeeFollowerRecord) {
        if (err) {
            console.log(err);
        } else if (!err && followeeFollowerRecord != null) {
            console.log("Unfollowing the below document details, found in the database:\n");
            console.log(followeeFollowerRecord);
            followeeFollowerRecord.update({ $set: { end: endDate } }, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    //Send an 'OK' response code
                    res.send(200);
                }

            });
        } else {
            console.log("The respective record does not exist in the database.")
        }
    });
});

//Get twitter followers of the current user
app.get('/followers/list/:twitterId', function (req, res) {
    var twitterId = req.params.twitterId;
    twitterClient.get('followers/list', { user_id: twitterId }, function (error, followers, response) {
        //console.log(followers);
        res.json(followers);
    });
});

//Get people being monitored and their sentiments
app.get('/monitored/sentiments/:loggedInUserId', function (req, res) {
    var loggedInUserId = req.params.loggedInUserId;

    FolloweeFollowerModel.find({
        $and: [
            { follower: loggedInUserId },
            { end: { $exists: false } }
        ]
    }, function (err, followees) {
        if (err) {
            console.log(err);
        } else {
            var friendsToLookup = [];
            for (var i in followees) {
                friendsToLookup.push(followees[i].followee);
            }
            var friendsLookupStr = friendsToLookup.join(',');

            console.log("Looking up friends: " + friendsLookupStr);
            if (friendsLookupStr) {
                //Make request to twitter
                twitterClient.get('users/lookup', { user_id: friendsLookupStr }, function (error, monitoredUsers, response) {
                    //Now we have the details of users being monitored in monitoredUsers
                    //Iterate through them and their most recent status and calculate their sentiments.
                    var monitoredUsersSentiments = [];
                    for (var i in monitoredUsers) {
                        var calculatedSentiment = sentiment(monitoredUsers[i].status.text);

                        var comparative = calculatedSentiment.comparative;
                        var sentimentAdj = null;
                        if (0 < comparative && comparative < 0.15) {
                            sentimentAdj = "fine"
                        } else if (0.15 <= comparative && comparative < 0.3) {
                            sentimentAdj = "incredible"
                        } else if (0.3 < comparative && comparative < 0.6) {
                            sentimentAdj = "fantabulous"
                        } else if (comparative >= 0.6) {
                            sentimentAdj = "spectacularly out of the world"
                        } else if (comparative === 0) {
                            sentimentAdj = "okay"
                        } else if (-0.1 < comparative && comparative < 0) {
                            sentimentAdj = "not that good"
                        } else if (-0.25 < comparative && comparative <= -0.1) {
                            sentimentAdj = "lousy"
                        } else if (-0.55 < comparative && comparative <= 0.25) {
                            sentimentAdj = "awful"
                        } else if (comparative <= -0.55) {
                            sentimentAdj = "awfully bad"
                        }

                        monitoredUsersSentiments.push({
                            monitoredUser: monitoredUsers[i],
                            sentiment: calculatedSentiment,
                            sentimentAdj: sentimentAdj
                        });
                    }

                    res.json(monitoredUsersSentiments);
                });
            } else {
                var dummySentiment = {
                    monitoredUser: 'dummy',
                    sentiment: 'dummy',
                    sentimentAdj: 'dummy'
                };

                res.json(dummySentiment);
            }

        }
    });
});


//Bookmark a subject
var BookmarkSchema = new mongoose.Schema({
    bookmarker: Number,
    bookmark: String,
    start: Date,
    //last: Date,
    end: Date
}, { collection: 'bookmark' });

var BookmarkModel = mongoose.model('BookmarkModel', BookmarkSchema);


app.post('/account/bookmark', function (req, res) {
    var bookmarker = req.body.bookmarker;
    var bookmark = req.body.bookmark;
    console.log("Bookmarker: " + bookmarker);
    console.log("Bookmark: " + bookmark);
    var currentDate = new Date();

    //Check if the followee-follower record exists in the database, with 
    //no 'end' field, if it does, don't create a new document
    BookmarkModel.findOne({
        $and: [
            { bookmarker: bookmarker },
            { bookmark: bookmark },
            { end: { $exists: false } }
        ]
    }, function (err, bookmarkRecord) {
        if (err) {
            console.log(err);
        } else if (!err && bookmarkRecord != null) {
            console.log("The bookmark is already present in the database. Below are the bookmark document details:");
            console.log(bookmarkRecord);
            //Send a response notifying that the bookmark is already active!
            var resp = {
                msgCode: 'SNW_BOOKMARK_EXISTS',
                msg: 'The respective subject has already been bookmarked by you previously'
            };
            res.json(resp);

        } else {

            //Create a new follower-followee record in the database to for monitoring!
            var newBookmark = new BookmarkModel({
                bookmarker: bookmarker,
                bookmark: bookmark,
                start: new Date(),
            });

            newBookmark.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saving the bookmark: " + bookmark);
                }
            });

            //Send a response notfying the bookmark has been successfully done!
            var resp = {
                msgCode: 'SNW_BOOKMARK_CREATED',
                msg: 'The respective subject has been successfully bookmarked'
            };
            res.json(resp);
        }
    });

});

app.get('/account/bookmarked-subjects/:twitterId', function (req, res) {
    var bookmarker = req.params.twitterId;

    BookmarkModel.find({
        $and: [
            { bookmarker: bookmarker },
            { end: { $exists: false } }
        ]
    }, function (err, bookmarks) {
        if (err) {
            console.log(err);
        } else {
            res.json(bookmarks);
        }
    });

});

//Un-bookmark a subject
app.post('/account/unbookmark', function (req, res) {
    var bookmarker = req.user.twitterId;
    var bookmark = req.body.bookmark;

    var endDate = new Date();

    //Check if the followee-follower record exists in the database, with 
    //no 'end' field, if it does, add an end field
    BookmarkModel.findOne({
        $and: [
            { bookmarker: bookmarker },
            { bookmark: bookmark },
            { end: { $exists: false } }
        ]
    }, function (err, bookmarkRecord) {
        if (err) {
            console.log(err);
        } else if (!err && bookmarkRecord != null) {
            console.log("Unbookmarking the below document details, found in the database:\n");
            console.log(bookmarkRecord);
            bookmarkRecord.update({ $set: { end: endDate } }, function (err, doc) {

                BookmarkModel.find({
                    $and: [
                        { bookmarker: bookmarker },
                        { end: { $exists: false } }
                    ]
                }, function (err, bookmarks) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(bookmarks);
                    }
                });
            });
        } else {
            console.log("The respective record does not exist in the database.")
        }
    });
});

//Logout
app.post('/logout', function (req, res) {
    req.logout();
    console.log('Logging out user...');
    res.send(200);
    //res.redirect('/');
});

//Post a tweet
app.post('/account/post-tweet', function (req, res) {
    var tweet = req.body.tweet;

    twitterClient.post('statuses/update', { status: tweet }, function (error, tweet, response) {
        if (error) {
            console.log(error);
        } else {
            res.json(tweet);
        }
    });

});

/*
// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sentiments.mean@gmail.com',
        pass: 'sentiment'
    }
});
*/

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
    auth: {
        api_key: 'key-431d09f55bc981699e35cbf509b197eb',
        domain: 'sandbox460dba8cd34d4f569f2a14da857d69c3.mailgun.org'
    }
};

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

app.post('/submit-query', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;

    //First send feedback mail
    nodemailerMailgun.sendMail({
        from: 'sentiments.mean@gmail.com',
        to: email,
        subject: "Sentiments Social Network Feedback",
        text: name + ",\n\nYour feedback / query has been successfully submitted to our team. \n\nWe'll get back to you shortly.\n\nRegards,\nSentiments Social Network Team"
    }, function (err, info) {
        if (err) {
            console.log('Error: ' + err);
        }
        else {
            console.log('Response: ' + info);
            //Then send mail to the team
            nodemailerMailgun.sendMail({
                from: 'sentiments.mean@gmail.com',
                to: "parth.ahluwalia@gmail.com",
                subject: subject,
                text: "Query submitted: " + message + "\n\nSender Details... \nName: " + name + "\nEmail: " + email + "\nMessage: "
            }, function (err, info) {
                if (err) {
                    console.log('Error: ' + err);
                }
                else {
                    console.log('Response: ' + info);
                    res.send(200);
                }
            });
        }
    });

});

//Profile Page fix!
app.get('/profile1/:id', function (req, res) {
    var twitterId = req.params.id;

    twitterClient.get('users/show', { user_id: twitterId }, function (error, user, response) {
        if (error) {
            console.log(error);
        } else {
            //res.json(user);

            //Status code
            twitterClient.get('statuses/user_timeline', { user_id: twitterId }, function (error, statuses, response) {
                var lastSentimentStatuses;
                if (statuses.length > 0) {
                    var lastSentimentScore = sentiment(statuses[0].text);
                    var comparative = lastSentimentScore.comparative;

                    var sentimentAdj = null;
                    if (0 < comparative && comparative < 0.15) {
                        sentimentAdj = "fine"
                    } else if (0.15 <= comparative && comparative < 0.3) {
                        sentimentAdj = "incredible"
                    } else if (0.3 < comparative && comparative < 0.6) {
                        sentimentAdj = "fantabulous"
                    } else if (comparative >= 0.6) {
                        sentimentAdj = "spectacularly out of the world"
                    } else if (comparative === 0) {
                        sentimentAdj = "okay"
                    } else if (-0.1 < comparative && comparative < 0) {
                        sentimentAdj = "not that good"
                    } else if (-0.25 < comparative && comparative <= -0.1) {
                        sentimentAdj = "lousy"
                    } else if (-0.55 < comparative && comparative <= 0.25) {
                        sentimentAdj = "awful"
                    } else if (comparative <= -0.55) {
                        sentimentAdj = "awfully bad"
                    }

                    lastSentimentStatuses = {
                        user: user,
                        statuses: statuses,
                        lastSentiment: lastSentimentScore,
                        sentimentAdj: sentimentAdj
                    };
                } else {
                    lastSentimentStatuses = {
                        user: user,
                        statuses: "No status has been posted by the user on Twitter!",
                        lastSentiment: 0,
                        sentimentAdj: "(guessing) okay"
                    };
                }

                res.json(lastSentimentStatuses);
            });
            //End of status code

        }
    });
});




var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);
console.log("Express server listening at port " + port);

module.exports = app;
