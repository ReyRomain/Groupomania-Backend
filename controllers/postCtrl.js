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
 * 
 * @typedef  {Object} likeHandler
 * @property {Object} body            récupère le corps de la requête
 * @property {Number} body.userId     récupère l'userId
 * @property {Number} body.like       récupère le nombre de like
 * @property {Object} params          récupère les params
 * @property {Number} params.id       récupère l'id des params selectionné
*/

const postM = require("../models/postsModel");
const likeM = require("../models/likesModel");
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
 * @param   {IncomingMessage & multerImage & postRequest}   req    la requête complétée par une image Multer
 * @param   {ServerResponse}                                res    la réponse
 * @param   {NextFunction}                                  next   passe à la fonction suivante
 *
 * @return  {void}                                                 envoie une réponse
 */
function modifyPost(req, res, next) {
    try {
        isAllowedUser({ id: req.body.id, idFromToken: req.authorizedUserId })
        postM.updateById(req.body);
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

/**
 * Récupération des likes
 *
 * @param   {IncomingMessage & likeHandler}  req   la requête complétée
 * @param   {ServerResponse}                 res   la réponse
 * @param   {NextFunction}                   next  passe à la fonction suivante
 *
 * @return  {void}                                 envoie une réponse  
 */
function getAllLikes(req, res, next) {
    try {
        const likes = likeM.getLikes();
        res.status(200).json(likes)
    } catch (error) {
        console.warn(error)
        res.status(400).json({error})
    }
}

/**
 * Ajoute ou supprime un like
 *
 * @param   {IncomingMessage & likeHandler}   req     la requête complétée
 * @param   {ServerResponse}                  res     la réponse
 * @param   {NextFunction}                    next    passe à la fonction suivante
 *
 * @return  {Promise}                                 retourne la modification des likes à l'affichage & envoie une réponse
 */
async function updateLikes(req, res, next) {
    const { userId, like } = req.body;
    const postId = req.params.id
    let msg, todo;
    try {
        if (like === 1) {
            todo = {
                $push: { usersLiked: userId },
                $inc: { likes: 1 }
            };
            msg = "Like ajouté";
        }
        if (like === 0) {
            const post = await likeM.findOne({ _id: postId })
            if (post.usersLiked.includes(userId)) {
                todo = {
                    $pull: { usersLiked: userId },
                    $inc: { likes: -1 }
                };
                msg = "Like retiré";
            }
        }
        await post.updateOne(
            { _id: req.params.id },
            todo
        );
        res.status(200).json({ message: msg });
    } catch (error) {
        res.status(400).json({ error })
    }
}

module.exports = {
    createPost,
    deletePost,
    getAllLikes,
    getAllPosts,
    modifyPost,
    updateLikes
}