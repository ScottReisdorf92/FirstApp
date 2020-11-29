
var mysql = require("mysql");

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
    var sql = `CREATE TABLE tbl_comments(comment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         text VARCHAR(1024),
                                         post_id INT,
                                         parent_comment INT,
                                         user_id INT)`;
  conn.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });
});
