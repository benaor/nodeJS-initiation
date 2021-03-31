const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
const mysql = require('promise-mysql');
const { error, success, checkAndChange } = require('./assets/function');
const app = express();
const config = require('./assets/config');

mysql.createConnection(config.db).then((db) => {
    console.log("connected");

    //On créer notre route MembersRouteur
    let MembersRouter = express.Router()
    let Members = require('./assets/classes/Members.class.js')(db, config)

    app.use(morgan); //For display error in console
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    // Fonction de base de l'API
    MembersRouter.route('/')

        // Crée un nouveau membre
        .post(async (req, res) => {
            let addMember = await Members.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

        // Recupère la liste des membres 
        .get(async (req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

    //traitement des données avec l'ID en paramètre
    MembersRouter.route('/:id')

        //recupère un membre avec son ID
        .get(async (req, res) => {
            let member = await Members.getById(req.params.id)
            res.json(checkAndChange(member))
        })

        // Modifie un membre avec son ID
        .put(async (req, res) => {
            let updateMember = await Members.update(req.body.name, req.params.id)
            res.json(checkAndChange(updateMember))
        })

        // Supprime un membre avec son ID 
        .delete(async (req, res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

    //On utilise la route MembersRouteur
    app.use(config.rootAPI + 'members', MembersRouter)
    app.listen(config.port, () => console.log('Started on port ' + config.port))

}).catch((err) => {
    console.log("Error during DB Connection : ");
    console.log(err.message);
})
