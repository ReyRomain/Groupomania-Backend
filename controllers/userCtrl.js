/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {Object}   userCredentials
 * @property {Object}   body            récupère le corps de la requête
 * @property {String}   body.email      récupère l'user de la base de donnée qui correspond à l'adresse mail entrée
 * @property {String}   body.password   récupère le password hasher de l'user
*/

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {findByEmail} = require("../models/usersModels");

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
                return res.status(401).json({ error: 'User not found !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Invalid password !' });
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
        const { email, password } = req.body;
        if (!email || !password) throw "uncomplete credentials";
        if (findByEmail({email})) throw "email already exists";
        const newUser = new findByEmail({ email, password: bcrypt.hashSync(password, 10) });
        newUser.save();
        res.status(201).json({ message: "user created" })

    } catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = {
    login,
    signup
}