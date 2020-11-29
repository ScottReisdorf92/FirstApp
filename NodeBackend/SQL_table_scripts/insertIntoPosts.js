var mysql = require("mysql");
var crypto = require('crypto');

var newPost = {
  title: 'First Post',
  post_body: 'This is the first post created',
  is_link: 0,
  user_id: 1
}

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hi7_5*StRaBC',
  database: 'firstlastapp',
  port: 8000
});

conn.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");
    conn.query('INSERT tbl_posts SET ?', newPost, function(err, result) {
      if (err) throw err;
      console.log("Table created");
  });
});
