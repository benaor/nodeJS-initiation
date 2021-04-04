// Modules
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan')('dev');
const axios = require('axios');
const twig = require('twig');

// variable globales
const app = express()
const port = 8081
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// middleWares
app.use(morgan)
app.use(express.json());
app.use(express.urlencoded({ extented: true }));

///Routes
app.get("/", (req, res) => {
    res.render('index.twig');
})

app.get("/members", (req, res) => {
    instance.get('/members')
        .then((response) => {
            if (response.data.status == 'success') {
                res.render('members.twig', {
                    members: response.data.result
                })
            } else {
                renderError(res, response.data.message)
            }
        })
        .catch((err) => { renderError(res, err.message) })
})

//Lancement de l'application
app.listen(port, () => console.log("started on port : " + port))

function renderError(res, errMsg) {
    res.render('error.twig', {
        errorMsg: errMsg
    })
}