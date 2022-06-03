const {db, initTable} = require("./database");

/**
 * Le schéma d'un utilisateur
 *
 * @var {Object}
 */
const userSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    pwd TEXT,
    email TEXT,
    name TEXT,
    admin BOOLEAN
`

initTable("users", userSchema);

/**
 * Vérification que l'email existe
 *
 * @param   {Object}  email        récupère l'objet 
 * @param   {String}  email.email  récupère le String entré par l'utilisateur
 *
 * @return  {Boolean}              retourne true ou false
 */
function emailExists(email){
    const sql = db.prepare("SELECT id FROM users WHERE email=@email");
    return sql.get(email) ? true : false;

}


module.exports = {
    emailExists
}
