/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {Object}   userCredentials
 * @property {Object}   body            récupère le corps de la requête
 * @property {String}   body.email      récupère l'user de la base de donnée qui correspond à l'adresse mail entrée
 * @property {String}   body.password   récupère le password hasher de l'user
 * @property {String}   body.name       récupère le nom de l'user
*/

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const fs = require('fs');

const {db} = require("../models/database");
const {findByEmail, emailExists} = require("../models/usersModels");

/**
 * Création d'un utilisateur
 *
 * @param   {IncomingMessage & userCredentials}    req      la requête complétée pour l'inscription
 * @param   {ServerResponse}                       res      la réponse
 * @param   {NextFunction}                         next     passe à la fonction suivante
 *
 * @return  {void}
 */
function signup(req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) throw "Credentials non complet";
        if (findByEmail({email})) throw "Email existe déjà";
        const newUser = new findByEmail({ email, password, name: bcrypt.hashSync(password, 10) });
        newUser.save();
        res.status(201).json({ message: "Utilisateur créé !" })

    } catch (error) {
        res.status(400).json({ error });
    }
}

function signup2(req, res, next) {
    try {
        const { email, password, name } = req.body;
        let sqlSignup, values;

        sqlSignup = "INSERT INTO users (email, password, name) VALUES"
        values = [ email, password, name ]

        db.query(sqlSignup, values, function (error, result) {
            if (!error) { res.status(201).json({ message: "Utilisateur créé !"})}
        })
    } catch (error) {
        res.status(400).json({ error });
    }
}

/**
 * Authentifie l'utilisateur 
 *
 * @param   {IncomingMessage & userCredentials}  req     la requête complétée pour la connexion
 * @param   {ServerResponse}                     res     la réponse
 * @param   {NextFunction}                       next    passe à la fonction suivante
 *
 * @return  {void}
 */
function login(req, res, next) {

    findByEmail.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_PASS,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}

function login2(req, res, next) {
    let sqlLogin = `SELECT * FROM users WHERE email=?`;
    db.exec(sqlLogin, [req.body.email], function (error, result) {
        let user = result[0];
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        console.log("Connexion validée");
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                process.env.JWT_PASS,
                { expiresIn: '24h' }
            )
        });
    })
}

/**
 * Modifie un utilisateur
 *
 * @param   {IncomingMessage}   req   la requête complétée
 * @param   {ServerResponse}    res   la réponse
 * @param   {NextFunction}      next  passe à la fonction suivante
 *
 * @return  {void}                    envoie une réponse
 */
function modifyUser(req, res, next) {
    
    //modification de name
    if (req.body.name != "") {
        let sqlModify = `UPDATE users SET name = ? WHERE id = ?`;
        db.exec(sqlModify, [req.body.name, req.params.id], function (error, result) {
            if (error) throw error;
        })
    }

    //modification de l'email
    if (req.body.email != "") {
        let sqlModify = `UPDATE users SET email = ? WHERE id = ?`;
        db.exec(sqlModify, [req.body.email, req.params.id], function (error, result) {
            if (error) throw error;
        })
    }

    //modification du password
    if (req.body.password != "") {
        let sqlModify = `UPDATE users SET password = ? WHERE id = ?`;
        db.exec(sqlModify, [req.body.password, req.params.id], function (error, result) {
            if (error) throw error;
        })
    }
    res.status(200).json({ message: "Utilisateur modifié !"});
}

/**
 * Supprime un utilisateur
 *
 * @param   {IncomingMessage}  req   la requête complétée
 * @param   {ServerResponse}   res   la réponse
 * @param   {NextFunction}     next  passe à la fonction suivante
 *
 * @return  {void}                   envoie une réponse
 */
function deleteUser(req, res, next) {
    findByEmail.deleteOne({ userId: req.params.userId })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
        .catch(error => res.status(400).json({ error }));
}

function deleteUser2(req, res, next) {
    if(req.body.password) {
        let sql = "SELECT * FROM users WHERE id=?"
        db.exec(sql, [req.params.id], function (error, result) {
            let user = result[0];
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !"});
                    }
                    else {
                        bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                let sql = "DELETE FROM users WHERE id=?";
                                db.exec(sql, [req.params.id], function (error, result) {
                                    if (error) throw error;
                                    console.log(result);
                                    res.status(200).json({ message: `Utilisateur ${req.params.id} supprimé !`});
                                })
                            })
                            .catch(error => res.status(500).json({ error }));
                    }
                })
                .catch(error => res.status(500).json({ message: "Erreur d'authentification !" }));
        })
    }
}

module.exports = {
    login,
    signup,
    deleteUser
}