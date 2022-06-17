const { db, initTable } = require("./database");

/**
 * Le schéma d'un like
 *
 * @var {Object}
 */
const likeSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    likeId INTEGER,
    publication DATE
`

initTable("likes", likeSchema);

/**
 * Trouve le like par son Id
 *
 * @param   {Object}  likeId            récupère l'objet
 * @param   {String}  likeId.likeId     récupère le string entré par l'utilisateur
 *
 * @return  {Boolean}                   retourne true ou false
 */
function findByLikeId(likeId){
    const sql = db.prepare("SELECT id FROM likes WHERE likeId=$likeId");
    return sql.get(likeId) ? true : false;
}

/**
 * Récupère les posts
 */
function allLikes(likes) {
    return db 
        .prepare("SELECT * FROM likes JOIN users WHERE user.id=userId ORDER BY publication DESC LIMIT 50")
        .get(likes);
}


/**
 * Création d'un like
 *
 * @param   {Object}  like              l'objet du like
 * @param   {String}  like.content      le contenu du like
 * @param   {String}  like.likeId       le nom de l'utilisateur qui à créé le like
 * @param   {String}  like.publication  la date de publication du like
 *
 * @return  {void}                      création d'un like par l'utilisateur dans la base de donnée
 */
function create(like){
    db
        .prepare("INSERT INTO likes (content, likeId, publication) VALUES (@content, @likeId, @publication)")
        .run(like);

}

/**
 * Suppression d'un like
 * 
 * @param   {Object}   removeLike                 l'objet supprimé par l'utilisateur
 * @param   {String}   removeLike.id              l'id de suppression
 * @param   {String}   removeLike.content         l'utilisateur supprime le contenu du like
 * @param   {String}   removeLike.user_id         l'utilisateur supprime le nom du like
 * @param   {String}   removeLike.publication     l'utilisateur supprime la publication du like
 *
 * @return  {void}                                suppression du like dans la base de donnée
 */
function remove(removeLike){
    let sql= "DELETE FROM likes";
    for (const key in removeLike){
        if (key === "id") continue;
        sql+=` ${key}='${removeLike[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(removeLike);
}

module.exports = {
    allLikes,
    create,
    findByLikeId,
    remove
}