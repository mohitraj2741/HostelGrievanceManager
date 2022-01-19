var mysql = require('mysql');


var pool = mysql.createPool({
  connectionLimit:4,
  host: "be5fglg2uzgsc0jrwjlv-mysql.services.clever-cloud.com",
  user: "upfw05buglcsk4dw",
  password: "vWTcpTyr3gkdjLxSvDFF",
  database:"be5fglg2uzgsc0jrwjlv"
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});
module.exports = pool;
