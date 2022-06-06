const {db, initTable} = require("./database");

/**
 * Le schéma d'un post
 *
 * @var {Object}
 */
const postSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user_id INTEGER,
    publication DATE
`

initTable("posts", postSchema);

/**
 * Trouve l'utilisateur par son Id
 *
 * @param   {Object}  userId            récupère l'objet
 * @param   {String}  userId.user_id    récupère le string entré par l'utilisateur
 *
 * @return  {Boolean}                   retourne true ou false
 */
function findByUserId(userId){
    const sql = db.prepare("SELECT id FROM posts WHERE userId=$userId");
    return sql.get(userId) ? true : false;
}


module.exports = {
    findByUserId
}
