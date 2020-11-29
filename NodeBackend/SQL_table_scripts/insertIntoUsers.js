var mysql = require("mysql");
var crypto = require('crypto');

var newUser = {
  user_name: 'admin',
  user_pass: crypto.createHash('sha256').update("MasterOfTheUniverse").digest('base64'),
  user_email: 'reisd051@umn.edu',
  is_admin: 1,
  is_active: 1
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
    conn.query('INSERT tbl_users SET ?', newUser, function(err, result) {
      if (err) throw err;
      console.log("Table created");
  });
});
