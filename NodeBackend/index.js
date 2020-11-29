// express module
var express = require("express");

// express application to be used
var app = express();

// express cors
var cors = require('cors');

//app to parse request body
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

var jsonParser = bodyparser.json();
// fs module - allows for interacting with file system
var fs = require("fs");

// manage user sessions
var session = require("express-session");

// used for hashing
var crypto = require("crypto");

// mysql module
var mysql = require("mysql");

app.use(session({
  secret: "mysecretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9051 for incoming connections
app.listen(process.env.PORT || 9051, () => console.log('Listening on port 9051!'));

var curr_user;
// TODO: create a display post endpoint


// home/landing page end point
app.get('/', function(req, res) {
  res.status(200);
  res.sendFile(__dirname + '/TestingServerFiles/HomePage.html');
});

// LOGIN ENDPOINT
// checking login data
app.post('/send-login-details', function(req, res) {
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hi7_5*StRaBC',
    database: 'firstLastApp',
    port: 8000
  });

  conn.connect();
  console.log(JSON.stringify(req.body));
  console.log("User: " + req.body.userName);
  // pull username from DB
  var sql = "SELECT * FROM tbl_users WHERE user_name = " + "\'" + req.body.userName + "\'";
  conn.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0) {  // No username returned that matches given username
      conn.end(function(err) {
        if (err) { throw err; }
        res.status(401).send();
      });
    } else if (result[0].user_pass ==
                crypto.createHash('sha256').update(req.body.password).digest('base64')
                && result[0].is_active) { // checking password and active status
   // TODO: possibly create two seperate if statements to know which error msg to send
      var user = result[0].user_name;
      req.session.value = 1;
      conn.end(function(err) {
        if (err) throw err;
        curr_user = {
          id: result[0].user_id,
          name: result[0].user_name,
          email: result[0].user_email,
        }
        res.status(200).end();
      });
    } else {
      conn.end(function(err) {
        if (err) throw err;
        res.status(401).end();
      });
    }
  });
});

// CREATE USER ENDPOINT
// checks if username is available and stores new user values in database
app.post('/create-user', function(req, res) {
var newUser = {
  user_name: req.body.userName,
  user_pass: crypto.createHash('sha256').update(req.body.userPass).digest('base64'),
  user_email: req.body.userEmail,
  is_admin: req.body.isAdmin,
  is_active: 1
}

  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hi7_5*StRaBC',
    database: 'firstLastApp',
    port: 8000
  });

  conn.connect();

  // check if username exists
  var sql = "SELECT user_name FROM tbl_users WHERE user_name = " + "\'" + req.body.userName + "\'";
  conn.query(sql, function(err, result, fields) {
    if (err) throw err;

    // if username is available, returned length should be 0
    if (result.length == 0) {
      conn.query("INSERT tbl_users SET ?", newUser, function(err, result, fields) {
        if (err) throw err;
        conn.end(function(err) {
          if (err) throw err;
          res.status(200).end();  // res.json({flag: true});
        });
      });
    } else {
      conn.end(function(err) {
        if (err) throw err;
        res.status(401).end();  // res.json({flag: false});
      });
    }
  });
});

// DELETE USER ENDPOINT
// changes user to not active in DB and username no longer shows in app
app.post('/delete-user', function(req, res) {
  isActiveUpdate = {
    is_active: 0
  }

  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hi7_5*StRaBC',
    database: 'firstLastApp',
    port: 8000
  });

  conn.connect();

  conn.query("UPDATE tbl_users SET ? WHERE user_name = " + "\'" + req.body.userName + "\'", isActiveUpdate, function(err, result, fields) {
    if (err) throw err;
    conn.end(function(err) {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

// RETRIEVE ALL POST DATA ENDPOINT
// sending post data from db to client
app.get('/post-data', cors(), function(req, res) {
  console.log('received request');
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hi7_5*StRaBC',
    database: 'firstLastApp',
    port: 8000
  });

  conn.connect();

  //creating offset of rows to skip depending on page value
  var currRows = req.query.rows * (req.query.pageNumber-1);


  //grabbing 25 rows using offsets
  /*
  SELECT * FROM tbl_posts ORDER BY max(timestamp) OFFSET rowSkipped ROWS FETCH NEXT ? ROWS ONLY
  */

  conn.query("SELECT * FROM tbl_posts ORDER BY post_id DESC LIMIT ? OFFSET ?", [parseInt(req.query.rows), currRows], function(err, rows) {
    if (err) throw err;

    conn.end(function(err) {
      if (err) throw err;
      res.send(rows);
    });
  });
});

// CREATING POST ENDPOINT
// saving submitted post to the database
app.post('/submit-post', function(req, res){
  // if (!req.session.value) {  // user is not logged in therefore cannot submit a post
  //   res.send({ access: 'denied' });
  // }

  isLink = 0;

  console.log('current link ' + req.body.link);
  console.log('link length ' + req.body.link.length);
  // check if a link was used with the title
  if (req.body.link.length != 0)
    isLink = 1;

  rowToInsert = {
    title: req.body.title,
    post_body: req.body.postBody,
    is_link: isLink,
    link: req.body.link,
    user_id: req.body.userId
  }

// connect to DB and insert new post into post table
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hi7_5*StRaBC',
    database: 'firstLastApp',
    port: 8000
  });

  conn.connect();

  conn.query("INSERT tbl_posts SET ?", rowToInsert, function(err, rows) {
    if (err) throw err;

    conn.end(function(err) {
      if (err) throw err;
      res.send({ access: 'granted'});
    });
  });
});


// CREATING COMMENT ENDPOINT
// saving submitted comment to the database
app.post('/submit-comment', function(req, res){
  // if (!req.session.value) {  // user is not logged in therefore cannot submit a comment
  //   res.send({ access: 'denied' });
  // }

  rowToInsert = {
    text: req.body.commentText,
    post_id: req.body.postId,
    parent_comment: req.body.parentComment,
    user_id: req.body.userId
  }

  // connect to DB and insert new comment into comment table
    var conn = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Hi7_5*StRaBC',
      database: 'firstLastApp',
      port: 8000
    });

    conn.connect();

    conn.query("INSERT tbl_comments SET ?", rowToInsert, function(err,rows) {
      if (err) throw err;

      conn.end(function(err) {
        if (err) throw err;
        res.send({access: 'granted'});
      });
    });
  });
