const {db, initTable} = require("./database");

/**
 * Le schéma d'un commentaire
 *
 * @var {Object}
 */
const commentSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author_id INTEGER
    content TEXT,
    publication DATE,
`

initTable("comments", commentSchema);

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
        .prepare(/*sql*/`SELECT user_id FROM posts WHERE user_id=$id`)
        .get(comment);
}

/**
 * Récupère les commentaires (50 max) d'une publication
 *
 * @param   {Object}  comments                l'objet du commentaire
 * @param   {String}  comments.postId         l'id du post
 *
 * @return  {Array}                           les commentaires d'un post
 */
function allComments(comments) {
    return db 
        .prepare(/*sql*/`SELECT * FROM comments JOIN users ON user.id=comments.author_id WHERE comments.post_id=@postId ORDER BY publication DESC LIMIT 50`)
        .all(comments);
}

/**
 * Création d'un post
 *
 * @param   {Object}  comment                l'objet du commentaire
 * @param   {String}  comment.content        le contenu du commentaire
 * @param   {String}  comment.authorId       l'id de l'utilisateur qui à créé le commentaire
 * @param   {String}  comment.postId         l'id du post auquel le commentaire est associé
 * @param   {String}  comment.publication    la date de publication du commentaire
 *
 * @return  {void}                           création d'un commentaire par l'utilisateur dans la base de donnée
 */
function create(comment){
    db
        .prepare(/*sql*/`INSERT INTO comments (content, author_id, publication, post_id) VALUES (@content, @authorId, @publication, @postId)`)
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
        .prepare(/*sql*/`DELETE FROM comments WHERE id=@id`)
        .run(removeComment);
}

module.exports = {
    allComments,
    create,
    findAuthorByCommentId,
    removeById,
    updateById
}