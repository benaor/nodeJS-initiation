const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { error, success } = require('./function');
const app = express();
const config = require('./config');

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
            res.json(success(members.slice(0, req.query.max)))
        } else if (req.query.max != undefined) {
            res.json(error("wrong max value"))
        } else {
            res.json(success(members))
        }
    })

//traitement des données avec l'ID en paramètre
MembersRouter.route('/:id')

    //recupère un membre avec son ID
    .get((req, res) => {

        let index = getIndex(req.params.id)

        if (typeof (index) == 'string') {
            res.json(error(index))
        } else {
            res.json(success(members[index]))
        }
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