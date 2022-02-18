var mysql = require('mysql');

export function connect() {
  var con = mysql.createConnection({
    host: 'server204.web-hosting.com',
    user: 'joshgncd_joshua',
    password: 'hn%X=FbWIU]J'
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  });
}