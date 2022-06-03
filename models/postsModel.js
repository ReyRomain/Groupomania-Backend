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

function findByUserId(userId){

}


module.exports = {
    findByUserId
}
