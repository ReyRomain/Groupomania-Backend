/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {Object} likeRequest
 * @property {Object} body            récupère le corps de la requête
 * @property {String} body.like       récupère le like dans le corps de la requête
 * 
 * @typedef  {Object} likeHandler
 * @property {Object} body            récupère le corps de la requête
 * @property {Number} body.userId     récupère l'userId
 * @property {Number} body.like       récupère le nombre de like
 * @property {Object} params          récupère les params
 * @property {Number} params.id       récupère l'id des params selectionné
*/

const {db} = require("../models/database");
const likeM = require("../models/likesModel");
const { post } = require('../routes/likeRoute');

/**
 * Récupération des likes
 *
 * @param   {IncomingMessage}  req   la requête complétée
 * @param   {ServerResponse}   res   la réponse
 * @param   {NextFunction}     next  passe à la fonction suivante
 *
 * @return  {void}                   envoie une réponse  
 */
function getAllLikes(req, res, next) {
    try {
        const likes = likeM.allLikes();
        res.status(200).json(likes)
    } catch (error) {
        console.warn(error)
        res.status(400).json({error})
    }
}

/**
 * Ajoute ou supprime un like et un dislike
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
        if (like === -1) {
            todo = {
                $push: { usersDisliked: userId },
                $inc: { dislikes: 1 }
            };
            msg = "Dislike ajouté";
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
            if (post.usersDisliked.includes(userId)) {
                todo = {
                    $pull: { usersDisliked: userId },
                    $inc: { dislikes: -1 }
                };
                msg = "Dislike retiré";
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
    getAllLikes,
    updateLikes
}