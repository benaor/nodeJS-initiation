const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fct = require('./function');
const app = express();

const members = [
    {
        id: 1,
        name: 'john'
    },
    {
        id: 2,
        name: 'david'
    },
    {
        id: 3,
        name: 'roger'
    },
]

app.use(morgan('dev')); //For display error in console
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/api/members/:id', (req, res) => {
    res.json(fct.success(members[(req.params.id) - 1].name))
})

app.get('/api/members', (req, res) => {
    if (req.query.max != undefined && req.query.max > 0) {
        res.json(fct.success(members.slice(0, req.query.max)))
    } else if (req.query.max != undefined) {
        res.json(fct.error("wrong max value"))
    } else {
        res.json(fct.success(members))
    }
})

app.post('/api/members', (req, res) => {
    if (req.body.name) {

        let member = {
            id: members.length + 1,
            name: req.body.name
        };

        members.push(member);

        res.json(fct.success(member));

    } else {
        res.json(fct.error("No name value"));
    }


})

const port = 8080;
app.listen(port, () => console.log('Started on port ' + port))