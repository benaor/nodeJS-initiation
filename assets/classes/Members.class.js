let db, config;

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}

let Members = class {

    // Permet de recuperer un membre avec son Id 
    static getById(id) {
        return new Promise((next) => {
            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined) next(result[0]);
                    else next(new Error("Wrong id"))
                })
                .catch((err) => next(err))
        })
    }

    // permet de recuperer la liste des membres (parametre max)
    static getAll(max) {
        return new Promise((next) => {
            if (max != undefined && max > 0) {
                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (max != undefined) {
                next(new Error("Wrong max value"))
            } else {
                db.query('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }
        })
    }

    // Permet d'ajouter un membre
    static add(name) {
        return new Promise((next) => {
            if (name && name.trim() !== '') {
                name = name.trim();
                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0] != undefined) next(new Error("Name is already used"))
                        else return db.query('INSERT INTO members (name) VALUE(?)', [name])
                    })
                    .then((result) => {
                        return db.query('SELECT * FROM members WHERE name = ?', [name])
                    })
                    .then((result) => {
                        next({
                            id: result[0].id,
                            name: result[0].name,
                        })
                    })
                    .catch((err) => next(err))
            } else {
                next(new Error("No name value"));
            }
        })
    }

    // Permet de modifier un membre
    static update(name, id) {
        return new Promise((next) => {
            if (name != undefined && name.trim() != "") {
                name = name.trim();
                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        if (result[0] != undefined) return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
                        else next(new Error("Aucun utilisateur ne porte cet ID"));
                    })
                    .then((result) => {
                        if (result[0] != undefined) next(new Error('Same Name'));
                        else return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                    })
                    .then(() => next(true))
                    .catch((err) => next(new Error(err)))
            } else {
                next(new Error("Wrong ID"));
            }
        })
    }

    // Permet de supprimer un membre
    static delete(id) {
        db.query('SELECT * FROM members WHERE id = ?', [id])
            .then((result) => {
                if (result[0] != undefined) return db.query('DELETE FROM members WHERE id = ?', [id])
                else next(new Error("Wrong ID"));
            })
            .then(() => next(true))
            .catch((err) => next(new Error(err)))
    }
}