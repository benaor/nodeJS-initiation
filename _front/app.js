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

// Routes

//Page d'accueil
app.get("/", (req, res) => {
    res.redirect("/members");
})

//Affichage de tous les membres
app.get("/members", (req, res) => {
    apiCall(req.query.max ? "/members?max=" + req.query.max : "/members ", 'get', {}, res, (members) => {
        res.render('members.twig', {
            members: members
        })
    })
})

//Recuperation d'un membre
app.get("/members/:id", (req, res) => {
    apiCall("/members/" + req.params.id, 'get', {}, res, (member) => {
        res.render('member.twig', {
            member: member
        })
    })
})

// Modification d'un membre (GET)
app.get("/members/:id/edit", (req, res) => {
    apiCall("/members/" + req.params.id, 'get', {}, res, (result) => {
        res.render('edit.twig', {
            member: result
        })
    })
})

// Modification d'un membre (POST)
app.post("/members/:id/edit", (req, res) => {
    apiCall("/members/" + req.params.id, 'put', {
        name: req.body.name
    }, res, () => {
        res.redirect("/members")
    })
})

// Suppression d'un membre


//Lancement de l'application
app.listen(port, () => console.log("started on port : " + port))

function renderError(res, errMsg) {
    res.render('error.twig', {
        errorMsg: errMsg
    })
}

function apiCall(url, method, data, res, next) {
    instance({
        method: method,
        url: url,
        data: data,
    }).then((response) => {
        if (response.data.status == 'success') {
            next(response.data.result)
        } else {
            renderError(res, response.data.message)
        }
    })
        .catch((err) => { renderError(res, err.message) })
}