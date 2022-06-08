/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
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
    })
}