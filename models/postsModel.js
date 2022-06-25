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
    publication DATE,
    imageUrl TEXT,
    usersLike TEXT
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
    const sql = db.prepare(/*sql*/`SELECT id FROM posts WHERE user_id=$userId`);
    return sql.get(userId) ? true : false;
}


/**
 * Trouve l'utilisateur par son Id
 *
 * @param   {Object}  post            récupère l'objet
 * @param   {String}  post.id         récupère le string entré par l'utilisateur
 *
 * @return  {Number}               
 */
 function findAuthorByPostId(post){
    return db
        .prepare(/*sql*/`SELECT user_id FROM posts WHERE user_id=$id`)
        .get(post);
}

/**
 * Récupère les posts
 */
function allPosts(posts) {
    return db 
        .prepare(/*sql*/`SELECT * FROM posts JOIN users WHERE user.id=userId ORDER BY publication DESC LIMIT 50`)
        .get(posts);
}

/**
 * Création d'un post
 *
 * @param   {Object}  post                l'objet du post
 * @param   {String}  post.content        le contenu du post
 * @param   {String}  post.user_id        le nom de l'utilisateur qui à créé le post
 * @param   {String}  [post.publication]  la date de publication du post
 *
 * @return  {void}                        création d'un post par l'utilisateur dans la base de donnée
 */
function create(post){
    db
        .prepare(/*sql*/`INSERT INTO posts (content, user_id, publication, usersLike ) VALUES (@content, @user_id, NOW, '[]')`)
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
 * @param   {String}  [newSpecs.usersLike]    si l'utilisateur modifie la publication du post
 *
 * @return  {void}                            modification du post par l'utilisateur dans la base de donnée
 */
function updateById(newSpecs){
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
 * @param   {Object}   removePost                   l'objet supprimé par l'utilisateur
 * @param   {String}   removePost.id                l'id de suppression
 * @param   {String}   [removePost.content]         l'utilisateur supprime le contenu du post
 * @param   {String}   [removePost.user_id ]        l'utilisateur supprime le nom du post
 * @param   {String}   [removePost.publication]     l'utilisateur supprime la publication du post
 *
 * @return  {void}                                  suppression du post dans la base de donnée
 */
function removeById(removePost){
    db
        .prepare(/*sql*/`DELETE FROM posts WHERE id=$id`)
        .run(removePost);
}

/*
true j'aime et je n'avais pas d'avis avant
false j'aimais mais je n'aime plus
*/

/**
 * Modification des likes
 *
 * @param   {Object}   arguments           l'objet modifié
 * @param   {Number}   arguments.userId    l'id de l'utilisateur
 * @param   {Number}   arguments.postId    l'id du post
 * @param   {Boolean}  arguments.like      true +1 like par l'utilisateur ou false -1 pour retirer son like
 *
 * @return  {Number}                        le nombre actuels de likes
 */
function updateLikes({userId, postId, like}){
    const usersLike = JSON.parse(
        db
            .prepare(/*sql*/`SELECT usersLike FROM posts WHERE id=$postId`)
            .run({postId})
            .usersLike
    );
    if (like) usersLike.push(userId);
    else usersLike.splice(usersLike.indexOf(userId), 1);
    updateById({"usersLike":JSON.stringify(usersLike), id:postId});
    return usersLike.length;
}


module.exports = {
    allPosts,
    create,
    findAuthorByPostId,
    findByUserId,
    removeById,
    updateById,
    updateLikes
}
