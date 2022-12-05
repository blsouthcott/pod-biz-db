

import mysql from 'mysql';

export const db = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_southcob',
    password        : '3068',
    database        : 'cs340_southcob',
    // must set multipleStatements to true to execute multiple statements
    // with a single call to db.execute 
    // use semicolons as usual to separate statements in the query string...
    multipleStatements: true
});

// db.getConnection((err) => {
//     if(err){
//       console.log('Error connecting to Db');
//       return;
//     }
//     console.log('Database connection established!');
//   });