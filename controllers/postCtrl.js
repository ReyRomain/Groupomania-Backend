/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
 * 
 * @typedef  {Object} postRequest
 * @property {Object} body            récupère le corps de la requête
 * @property {String} body.post       récupère le post dans le corps de la requête
*/

const {db} = require("../models/database");
const {allPosts, create, findByUserId} = require("../models/postsModel")

const fs = require('fs');

/**
 * Récupération des posts
 *
 * @param   {IncomingMessage}  req   [req description]
 * @param   {ServerResponse}   res   [res description]
 * @param   {NextFunction}     next  [next description]
 *
 * @return  {void}                   
 */
function getAllPosts(req, res, next) {
    try {
        const posts = allPosts();
        res.status(200).json(posts)
    } catch (error) {
        console.warn(error)
        res.status(400).json({error})
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
    const postObject = JSON.parse(req.body.post);
    delete postObject._id;
    const post = create({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Le post a bien été ajouté.' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Modification d'un post
 *
 * @param   {IncomingMessage & multerImage & postRequest}   req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                res    la réponse
 * @param   {NextFunction}                                  next   passe à la fonction suivante
 *
 * @return  {void}                                                 envoie une réponse
 */
function modifyPost(req, res, next) {
    const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    posts.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Le post a été modifié !' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Supprime un post
 * 
 * @param   {IncomingMessage}   req    la requête complétée
 * @param   {ServerResponse}    res    la réponse
 * @param   {NextFunction}      next   passe à la fonction suivante
 *
 * @return  {void}                     envoie une réponse
 */
function deletePost(req, res, next) {
    posts.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Le post a été supprimé' }))
        .catch(error => res.status(400).json({ error }));
}

module.exports = {
    createPost,
    deletePost,
    getAllPosts,
    modifyPost
}