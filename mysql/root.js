var mysql = require('mysql');
let config = require('./config')
var connection = mysql.createConnection(config);

function query(sql) {
    return new Promise((resolve, reject) => {
        connection.connect(); // 建立链接
        connection.query(sql, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
}

module.exports = query
