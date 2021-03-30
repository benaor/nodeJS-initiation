const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');
const { error, success } = require('./function');
const app = express();
const config = require('./config');

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

        //On créer notre route MembersRouteur
        let MembersRouter = express.Router()

        app.use(morgan('dev')); //For display error in console
        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        // Fonction de base de l'API
        MembersRouter.route('/')

            // Crée un nouveau membre
            .post((req, res) => {
                if (req.body.name) {
                    let sameName = false;
                    for (let i = 0; i < members.length; i++) {
                        if (req.body.name == members[i].name) {
                            sameName = true;
                            break;
                        }
                    }
                    if (sameName) {
                        res.json(error("this name is already used"));
                    } else {
                        let member = {
                            id: createId(),
                            name: req.body.name
                        };
                        members.push(member);
                        res.json(success(member));
                    }
                } else {
                    res.json(error("No name value"));
                }
            })

            // Recupère la liste des membres 
            .get((req, res) => {
                if (req.query.max != undefined && req.query.max > 0) {

                    db.query('SELECT * FROM members LIMIT 0, ?', [req.query.max], (err, result) => {
                        if (err) res.json(err.message);
                        else res.json(success(result));
                    })

                } else if (req.query.max != undefined) {

                    res.json(error("wrong max value"))

                } else {

                    db.query('SELECT * FROM members', (err, result) => {
                        if (err) res.json(err.message);
                        else res.json(success(result));
                    })
                }
            })

        //traitement des données avec l'ID en paramètre
        MembersRouter.route('/:id')

            //recupère un membre avec son ID
            .get((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if (err) res.json(err.message);
                    else {
                        if(result[0] != undefined) res.json(success(result));
                        else res.json(error("Aucun utilisateur ne porte cet ID"));
                    }
                })

            })

            // Modifie un membre avec son ID
            .put((req, res) => {
                let index = getIndex(req.params.id)
                if (typeof (index) == 'string') {
                    res.json(error(index))
                } else {
                    let same = false;
                    for (let i = 0; i < members.length; i++) {
                        if (req.body.name == members[i].name && req.params.id != members[i].id) {
                            same = true;
                            break;
                        }
                    }
                    if (same) {
                        res.json(error('same Name'))
                    } else {
                        members[index].name = req.body.name
                        res.json(success(true))
                    }
                }
            })

            // Supprime un membre avec son ID 
            .delete((req, res) => {
                let index = getIndex(req.params.id)

                if (typeof (index) == 'string') {
                    res.json(error(index))
                } else {
                    members.splice(index, 1);
                    res.json(success(members));
                }
            })

        //On utilise la route MembersRouteur
        app.use(config.rootAPI + 'members', MembersRouter)

        app.listen(config.port, () => console.log('Started on port ' + config.port))


    }
})

// Recupère l'index d'un membre
function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id) {
            return i;
        }
    }
    return 'wrong id';
}

// Permet de créer l'ID 
function createId() {
    return lastMember = members[members.length - 1].id + 1
}