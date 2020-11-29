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
    var sql = `CREATE TABLE tbl_users(user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         user_name VARCHAR(30) UNIQUE,
                                         user_pass VARCHAR(50),
                                         user_email VARCHAR(30),
                                         is_admin TINYINT(1),
                                         is_active TINYINT(1))`;
  conn.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });
});
