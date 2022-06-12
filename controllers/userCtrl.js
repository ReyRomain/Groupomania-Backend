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

const { db } = require("../models/database");
const user = require("../models/usersModels");
const { findByUserId } = require('../models/postsModel');

/**
 * Création d'un utilisateur
 *
 * @param   {IncomingMessage & userCredentials}    req      la requête complétée pour l'inscription
 * @param   {ServerResponse}                       res      la réponse
 * @param   {NextFunction}                         next     passe à la fonction suivante
 *
 * @return  {Promise.<void>}
 */
async function signup(req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) throw "Credentials non complet";
        if (user.emailExists({ email })) throw "Email existe déjà";
        user.createUser({ email, name, password: await bcrypt.hashSync(password, 10) });
        res.status(201).json({ message: "Utilisateur créé !" })
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
    try {
        const currentUser = user.findByEmail({ email: req.body.email });
        if (!currentUser) throw 'Utilisateur non trouvé !';
        const valid = bcrypt.compare(req.body.password, currentUser.password);
        if (!valid) throw 'Mot de passe incorrect !';
        res.status(200).json({
            userId: currentUser.id,
            token: jwt.sign(
                { userId: currentUser.id },
                process.env.JWT_PASS,
                { expiresIn: '24h' }
            )
        });
    } catch (error) {
        res.status(400).json({ error });
    }
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

    try {
        //si id à modifier !== id courrant throw "pas le droit"
        //if (id !== findByUserId) throw
        user.update(req.body);
        res.status(200).json({ message: "Utilisateur modifié !" });

    } catch (error) {
        res.status(400).json(error);
    }
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
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
        .catch(error => res.status(400).json({ error }));
}

/*
function deleteUser2(req, res, next) {
    if (req.body.password) {
        let sql = "SELECT * FROM users WHERE id=?"
        db.exec(sql, [req.params.id], function (error, result) {
            let user = result[0];
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    else {
                        bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                let sql = "DELETE FROM users WHERE id=?";
                                db.exec(sql, [req.params.id], function (error, result) {
                                    if (error) throw error;
                                    console.log(result);
                                    res.status(200).json({ message: `Utilisateur ${req.params.id} supprimé !` });
                                })
                            })
                            .catch(error => res.status(500).json({ error }));
                    }
                })
                .catch(error => res.status(500).json({ message: "Erreur d'authentification !" }));
        })
    }
}
*/

module.exports = {
    login,
    signup,
    deleteUser
}