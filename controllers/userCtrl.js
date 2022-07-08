/**
 * @typedef  {import('express').Request & import("../middlewares/auth").authMiddleware}      IncomingMessage
 * @typedef  {import('express').Response}                                                    ServerResponse
 * @typedef  {import('express').NextFunction}                                                NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
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

const {isAllowedUser} = require("./security");
const user = require("../models/usersModels");

/**
 * Création d'un utilisateur
 *
 * @param   {IncomingMessage & multerImage & userCredentials}    req      la requête complétée pour l'inscription
 * @param   {ServerResponse}                                     res      la réponse
 * @param   {NextFunction}                                       next     passe à la fonction suivante
 *
 * @return  {Promise.<void>}
 */
async function signup(req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) throw "Credentials non complet";
        if (user.emailExists({ email })) throw "Email existe déjà";
        user.create({ email, name, password: await bcrypt.hashSync(password, 10) });
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
                //@ts-ignore
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
 * @param   {IncomingMessage & multerImage}   req   la requête complétée par une image Multer
 * @param   {ServerResponse}                  res   la réponse
 * @param   {NextFunction}                    next  passe à la fonction suivante
 *
 * @return  {void}                                  envoie une réponse
 */
function modifyUser(req, res, next) {

    try {
        isAllowedUser({id:req.body.id, idFromToken:req.authorizedUserId})
        user.updateById(req.body);
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
    try {
        isAllowedUser({id:req.body.id, idFromToken:req.authorizedUserId, couldBeAdmin:true})
        user.removeById(req.body.id);
        res.status(200).json({ message: 'Utilisateur supprimé !' });
    } catch (error) {
        res.status(400).json({ error })
    }
}

module.exports = {
    deleteUser,
    login,
    modifyUser,
    signup
}