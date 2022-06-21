const {db, initTable} = require("./database");

/**
 * Le schéma d'un commentaire
 *
 * @var {Object}
 */
const commentSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    commentId INTEGER,
    publication DATE
`

initTable("comments", commentSchema);

/**
 * Trouve le commentaire par son Id
 *
 * @param   {Object}  commentId               récupère l'objet
 * @param   {String}  commentId.commentId     récupère le string entré par l'utilisateur
 *
 * @return  {Boolean}                         retourne true ou false
 */
function findByCommentId(commentId){
    const sql = db.prepare("SELECT id FROM comments WHERE commentId=$commentId");
    return sql.get(commentId) ? true : false;
}

/**
 * Trouve l'utilisateur par son Id
 *
 * @param   {Object}  comment            récupère l'objet
 * @param   {String}  comment.id         récupère le string entré par l'utilisateur
 *
 * @return  {Number}               
 */
 function findAuthorByCommentId(comment){
    return db
        .prepare("SELECT user_id FROM posts WHERE user_id=$id")
        .get(comment);
}

/**
 * Récupère les commentaires
 */
function allComments(comments) {
    return db 
        .prepare("SELECT * FROM comments JOIN users WHERE user.id=userId ORDER BY publication DESC LIMIT 50")
        .get(comments);
}

/**
 * Création d'un post
 *
 * @param   {Object}  comment                l'objet du commentaire
 * @param   {String}  comment.content        le contenu du commentaire
 * @param   {String}  comment.commentId      le nom de l'utilisateur qui à créé le commentaire
 * @param   {String}  comment.publication    la date de publication du commentaire
 *
 * @return  {void}                           création d'un commentaire par l'utilisateur dans la base de donnée
 */
function create(comment){
    db
        .prepare("INSERT INTO comments (content, commentId, publication) VALUES (@content, @commentId, @publication)")
        .run(comment);

}

/**
 * Modification d'un commentaire
 *
 * @param   {Object}  newSpecs                  le commentaire modifié par l'utilisateur
 * @param   {String}  newSpecs.id               l'id de la modification
 * @param   {String}  [newSpecs.content]        si l'utilisateur modifie le contenu du commentaire
 * @param   {String}  [newSpecs.commentId]      si l'utilisateur modifie le nom du commentaire
 * @param   {String}  [newSpecs.publication]    si l'utilisateur modifie la publication du commentaire
 *
 * @return  {void}                              modification du commentaire par l'utilisateur dans la base de donnée
 */
function updateById(newSpecs){
    let sql= "UPDATE comments SET";
    for (const key in newSpecs){
        if (key === "id") continue;
        sql+=` ${key}='${newSpecs[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(newSpecs);
}

/**
 * Suppression d'un commentaire
 * 
 * @param   {Object}   removeComment                   l'objet supprimé par l'utilisateur
 * @param   {String}   removeComment.id                l'id de suppression
 * @param   {String}   [removeComment.content]         l'utilisateur supprime le contenu du commentaire
 * @param   {String}   [removeComment.commentId]       l'utilisateur supprime le nom du commentaire
 * @param   {String}   [removeComment.publication]     l'utilisateur supprime la publication du commentaire
 *
 * @return  {void}                                     suppression du commentaire dans la base de donnée
 */
function removeById(removeComment){
    db
        .prepare("DELETE FROM comments WHERE id=@id")
        .run(removeComment);
}

module.exports = {
    allComments,
    create,
    findAuthorByCommentId,
    findByCommentId,
    removeById,
    updateById
}