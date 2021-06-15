const mysql = require('mysql')

const db = mysql.createConnection({
    host:'localhost',
    user:'AL',
    password:'007@001',
    database:'dbmarket',
    multipleStatements: true
})

module.exports = db