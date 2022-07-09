/**
 * @typedef  {import('express').Request & import("../middlewares/auth").authMiddleware}      IncomingMessage
 * @typedef  {import('express').Response}                                                    ServerResponse
 * @typedef  {import('express').NextFunction}                                                NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
 * 
 * @typedef  {Object} postRequest
 * @property {Object} body            récupère le corps de la requête
 * @property {String} body.post       récupère le post dans le corps de la requête
 * 
 * @typedef  {Object} likeHandler
 * @property {Object} body            récupère le corps de la requête
 * @property {Number} body.userId     récupère l'userId
 * @property {Number} body.like       récupère le nombre de like
 * @property {Object} params          récupère les params
 * @property {Number} params.id       récupère l'id des params selectionné
*/

const postM = require("../models/postsModel");
const { isAllowedUser } = require("./security");

const fs = require('fs');

/**
 * Récupération des posts
 *
 * @param   {IncomingMessage & postRequest}  req   la requête complétée
 * @param   {ServerResponse}                 res   la réponse
 * @param   {NextFunction}                   next  passe à la fonction suivante
 *
 * @return  {void}                                 envoie une réponse
 */
function getAllPosts(req, res, next) {
    try {
        const posts = postM.allPosts();
        res.status(200).json(posts)
    } catch (error) {
        console.warn(error)
        res.status(400).json({ error })
    }
}

/**
 * Création d'un post
 *
 * @param   {IncomingMessage & multerImage & postRequest}   req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                res    la réponse
 * @param   {NextFunction}                                  next   passe à la fonction suivante
 * 
 * @return  {void}                                                 envoie une réponse
 */
function createPost(req, res, next) {
    try {
        const postObject = JSON.parse(req.body.post);
        postM.create({
            ...postObject,
            imageUrl: req.body.imageUrl
        });
        res.status(201).json({ message: 'Le post a bien été ajouté.' })
    }
    catch (error) {
        res.status(400).json({ error })
    };
}

/**
 * Modification d'un post
 *
 * @param   {IncomingMessage & multerImage & likeHandler }   req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                res    la réponse
 * @param   {NextFunction}                                  next   passe à la fonction suivante
 *
 * @return  {void}                                                 envoie une réponse
 */
function modifyPost(req, res, next) {
    try {
        isAllowedUser({ 
            id: req.body.id,
            idFromToken: req.authorizedUserId 
        });
        postM.updateById({...req.body, id :  req.params.id });
        res.status(200).json({ message: 'Le post a été modifié !' });
    } catch (error) {
        res.status(400).json(error)
    }
}

/**
 * Supprime un post
 * 
 * @param   {IncomingMessage & postRequest}   req    la requête complétée
 * @param   {ServerResponse}                  res    la réponse
 * @param   {NextFunction}                    next   passe à la fonction suivante
 *
 * @return  {void}                                   envoie une réponse
 */
function deletePost(req, res, next) {
    try {
        const authorId = postM.findAuthorByPostId({ id: req.params.id })
        isAllowedUser({
            id: authorId,
            idFromToken: req.authorizedUserId,
            couldBeAdmin: true
        });
        postM.removeById({ id: req.params.id });
        res.status(200).json({ message: 'Le post a été supprimé' })
    } catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = {
    createPost,
    deletePost,
    getAllPosts,
    modifyPost,
}