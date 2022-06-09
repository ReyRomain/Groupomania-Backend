/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
 * 
 * @typedef  {import("multer").DiskStorageOptions} multerImage
 * 
 * @typedef  {Object} postRequest
 * @property {Object} body            récupère le corps de la requête
 * @property {String} body.post      récupère le post dans le corps de la requête
*/

const {db} = require("../models/database");
const {findByUserId} = require("../models/postsModel")

/**
 * [getAllPosts description]
 *
 * @param   {IncomingMessage}  req   [req description]
 * @param   {ServerResponse}   res   [res description]
 * @param   {NextFunction}     next  [next description]
 *
 * @return  {void}                   
 */
function getAllPosts(req, res, next) {
    try {
        const posts = findByUserId.find();
        res.status(200).json(posts)
    } catch (error) {
        console.warn(error)
        res.status(400).json({error})
    }
}

function getAllPosts2(req, res, next) {
    const sqlGetAllPosts = "SELECT * FROM posts JOIN users WHERE user.id=userId ORDER BY publication DESC LIMIT 50;";
    db.exec(sqlGetAllPosts, function (error, result){
        if (error) res.status(400).json({ error });
        res.status(200).json(result)
    });
}




/**
 * Récupération d'un post
 *
 * @param   {IncomingMessage}   req    la requête complétée
 * @param   {ServerResponse}    res    la réponse
 * @param   {NextFunction}      next   passe à la fonction suivante
 *
 * @return  {void}                     retourne le post selectionné & envoie une réponse
 */
function getPostByUser (req, res, next) {

    try {
        const onePost = findByUserId.findOne({ _id: req.params.id });
        res.status(200).json(onePost);
    } catch (error) {
        console.warn(error)
        res.status(404).json({ error })
    }
}


function getPostByUser2(req, res, next) {
    const sqlGetOnePost = "SELECT * FROM post JOIN users WHERE user.id=userId ORDER BY publication DESC LIMIT 50;";
    db.exec(sqlGetOnePost, [req.body.id], function (error, result) {
        if (error) res.status(400).json({ error });
        res.status(200).json(result)
    });
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
    const post = new posts({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Le post a bien été ajouté.' }))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Modification d'une sauce
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