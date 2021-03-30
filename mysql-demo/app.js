const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    database: 'nodejs',
    user: 'root',
    password: 'root',
});

db.connect((err) => {
    if (err) console.log(err.message)
    else {
        console.log("connected");
        // db.query('INSERT INTO members (name) VALUES ("john")', (err, res) => {
        //     if(err) console.log(err.message)
        //     else console.log(res);
        // })
        db.query('SELECT * FROM members', (err, res) => {
            if(err) console.log(err.message)
            else console.log(res[0].name);
        })
    }
})

