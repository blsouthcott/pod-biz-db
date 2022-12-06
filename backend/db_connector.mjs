
import * as dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config('');

export const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PWD,
        database: 'pod_db'
    }
);

db.connect();

// export const db = mysql.createPool({
//     connectionLimit: 10,
//     socketPath: '/usr/local/mysql/bin/mysql',
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: process.env.DB_PWD,
//     database: 'pod_db',
//     // must set multipleStatements to true to execute multiple statements
//     // with a single call to db.execute 
//     // use semicolons as usual to separate statements in the query string...
//     multipleStatements: true
// });

// db.getConnection((err) => {
//     if(err){
//       console.log('Error connecting to Db');
//       return;
//     }
//     console.log('Database connection established!');
//   });