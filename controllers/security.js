const {findById} = require("../models/usersModels");

/**
 * Autorise l'utilisateur
 *
 * @param   {Object}   argument                  l'objet à vérifier
 * @param   {Number}   argument.id               l'id de l'objet
 * @param   {Number}   argument.idFromToken      l'id du token
 * @param   {Boolean}  [argument.couldBeAdmin]   true ou false
 *
 * @return  {void}                               une autorisation ou
 * @throw   un message d'erreur
 */
function isAllowedUser({id, idFromToken, couldBeAdmin}){
    const isAdmin = couldBeAdmin? findById(id).admin : false;
    if (id !== idFromToken && !isAdmin ) throw "Utilisateur non autorisé";
}

module.exports = {
    isAllowedUser
} 