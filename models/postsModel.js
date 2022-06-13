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
 * @param   {String}  userId.userId     récupère le string entré par l'utilisateur
 *
 * @return  {Boolean}                   retourne true ou false
 */
function findByUserId(userId){
    const sql = db.prepare("SELECT id FROM posts WHERE userId=$userId");
    return sql.get(userId) ? true : false;
}

/**
 * Récupère les posts
 */
function allPosts(posts) {
    return db 
        .prepare("SELECT * FROM posts JOIN users WHERE user.id=userId ORDER BY publication DESC LIMIT 50")
        .get(posts);
}

/**
 * Création d'un post
 *
 * @param   {Object}  post              l'objet du post
 * @param   {String}  post.content      le contenu du post
 * @param   {String}  post.user_id      le nom de l'utilisateur qui à créé le post
 * @param   {String}  post.publication  la date de publication du post
 *
 * @return  {void}                      création d'un post par l'utilisateur dans la base de donnée
 */
function create(post){
    db
        .prepare("INSERT INTO posts (content, user_id, publication) VALUES (@content, @user_id, @publication)")
        .run(post);

}

/**
 * Modification d'un post
 *
 * @param   {Object}  newSpecs                le post modifié par l'utilisateur
 * @param   {String}  newSpecs.id             l'id de la modification
 * @param   {String}  [newSpecs.content]      si l'utilisateur modifie le contenu du post
 * @param   {String}  [newSpecs.user_id]      si l'utilisateur modifie le nom du post
 * @param   {String}  [newSpecs.publication]  si l'utilisateur modifie la publication du post
 *
 * @return  {void}                            modification du post par l'utilisateur dans la base de donnée
 */
function updatePost(newSpecs){
    let sql= "UPDATE posts SET";
    for (const key in newSpecs){
        if (key === "id") continue;
        sql+=` ${key}='${newSpecs[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(newSpecs);
}

/**
 * Suppression d'un post
 * 
 * @param   {Object}   removePost                 l'objet supprimé par l'utilisateur
 * @param   {String}   removePost.id              l'id de suppression
 * @param   {String}   removePost.content         l'utilisateur supprime le contenu du post
 * @param   {String}   removePost.user_id         l'utilisateur supprime le nom du post
 * @param   {String}   removePost.publication     l'utilisateur supprime la publication du post
 *
 * @return  {void}                              suppression du post dans la base de donnée
 */
function remove(removePost){
    let sql= "DELETE FROM posts";
    for (const key in removePost){
        if (key === "id") continue;
        sql+=` ${key}='${removePost[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(removePost);
}


module.exports = {
    allPosts,
    create,
    findByUserId,
    updatePost
}
