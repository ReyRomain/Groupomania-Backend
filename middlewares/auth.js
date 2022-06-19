/**
 * @typedef  {import('express').Request}      IncomingMessage
 * @typedef  {import('express').Response}     ServerResponse
 * @typedef  {import('express').NextFunction} NextFunction
*/

const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification
 *
 * @param   {IncomingMessage}   req   récupère la requête d'authentification
 * @param   {ServerResponse}    res   la réponse
 * @param   {NextFunction}      next  passe à la fonction suivante
 *
 * @return  {void}
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PASS);
        // @ts-ignore
        if (req.body.userId && req.body.userId !== decodedToken.userId) throw 'Invalid user ID';
        req.authorizedUserId = decodedToken.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error
        });
    }
};