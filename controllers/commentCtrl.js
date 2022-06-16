/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
 * 
 * @typedef  {Object} commentRequest
 * @property {Object} body            récupère le corps de la requête
 * @property {String} body.post       récupère le commentaire dans le corps de la requête
*/

const {db} = require("../models/database");
const commentM = require("../models/commentsModel");

/**
 * Récupération des commentaires
 *
 * @param   {IncomingMessage}  req   la requête complétée
 * @param   {ServerResponse}   res   la réponse
 * @param   {NextFunction}     next  passe à la fonction suivante
 *
 * @return  {void}                   
 */
function getAllComments(req, res, next) {
    try {
        const comments = commentM.allComments();
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
    const commentObject = JSON.parse(req.body.comment);
    delete commentObject._id;
    const comment = commentM.create({
        ...commentObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    comment.save()
        .then(() => res.status(201).json({ message: 'Le commentaire a bien été ajouté.' }))
        .catch(error => res.status(400).json({ error }));
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
    const commentObject = req.file ?
        {
            ...JSON.parse(req.body.comment),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    commentM.update({ _id: req.params.id }, { ...commentObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Le commentaire a été modifié !' }))
        .catch(error => res.status(400).json({ error }));
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
    commentM.remove({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Le post a été supprimé' }))
        .catch(error => res.status(400).json({ error }));
}

module.exports = {
    createComment,
    deleteComment,
    getAllComments,
    modifyComment
}