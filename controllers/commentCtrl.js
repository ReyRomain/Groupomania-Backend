/**
 * @typedef  {import('express').Request & import("../middlewares/auth").authMiddleware}      IncomingMessage
 * @typedef  {import('express').Response}                                                    ServerResponse
 * @typedef  {import('express').NextFunction}                                                NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
 * 
 * @typedef  {Object} commentRequest
 * @property {Object} body               récupère le corps de la requête
 * @property {String} body.comment       récupère le commentaire dans le corps de la requête
*/

const {db} = require("../models/database");
const commentM = require("../models/commentsModel");
const {isAllowedUser} = require("./security");

/**
 * Récupération des commentaires d'un post
 *
 * @param   {IncomingMessage}  req   la requête complétée
 * @param   {ServerResponse}   res   la réponse
 * @param   {NextFunction}     next  passe à la fonction suivante
 *
 * @return  {void}                   
 */
function getAllComments(req, res, next) {
    try {
        const comments = commentM.allComments({postId:req.params.id});
        res.status(200).json(comments)
    } catch (error) {
        console.warn(error)
        res.status(400).json({error})
    }
}

/**
 * Création d'un commentaire
 *
 * @param   {IncomingMessage & multerImage & commentRequest}   req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                   res    la réponse
 * @param   {NextFunction}                                     next   passe à la fonction suivante
 * 
 * @return  {void}                                                    envoie une réponse
 */
function createComment(req, res, next) {

    try {
        const commentObject = JSON.parse(req.body.comment);
        commentM.create({
            ...commentObject,
            imageUrl: req.body.imageUrl
        });
        res.status(201).json({ message: 'Le commentaire a bien été ajouté.' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

/**
 * Modification d'un commentaire
 *
 * @param   {IncomingMessage & multerImage & commentRequest}   req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                   res    la réponse
 * @param   {NextFunction}                                     next   passe à la fonction suivante
 *
 * @return  {void}                                                    envoie une réponse
 */
function modifyComment(req, res, next) {

    try {
        isAllowedUser({id:req.body.id, idFromToken:req.authorizedUserId})
        commentM.updateById(req.body);
        res.status(200).json({ message: 'Le commentaire a été modifié !' });
    } catch (error) {
        res.status(400).json({ error })
    }
}

/**
 * Supprime un commentaire
 * 
 * @param   {IncomingMessage}   req    la requête complétée
 * @param   {ServerResponse}    res    la réponse
 * @param   {NextFunction}      next   passe à la fonction suivante
 *
 * @return  {void}                     envoie une réponse
 */
function deleteComment(req, res, next) {
    try {
        const authorId = commentM.findAuthorByCommentId({ id:req.params.id })
        isAllowedUser({
            id: authorId,
            idFromToken: req.authorizedUserId,
            couldBeAdmin: true
        });
        commentM.removeById({ id: req.params.id });
        res.status(200).json({ message: 'Le commentaire a été supprimé' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

module.exports = {
    createComment,
    deleteComment,
    getAllComments,
    modifyComment
}