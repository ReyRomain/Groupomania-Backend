const { json } = require("express");
const { db, initTable } = require("./database");

/**
 * Le schéma d'un like
 *
 * @var {Object}
 */
const likeSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    likersArray TEXT DEFAULT "[]" NOT NULL
`

initTable("likes", likeSchema);

/**
 * Récupère le nombre de like d'un post
 * 
 * @param   {Object}  post            récupère l'objet
 * @param   {String}  post.id         récupère le string entré par l'utilisateur
 */
function getLikes(post) {
    const likes = db 
        .prepare(/*sql*/`SELECT likersArray FROM likes WHERE post_id=@id`)
        .get(post);
    return JSON.parse(likes).length;
}


/**
 * Création d'un like
 *
 * @param   {Object}  like              l'objet du like
 * @param   {String}  like.userId      
 * @param   {String}  like.postId  
 * @param   {String}  like.likersArray     
 *
 * @return  {void}                      création d'un like par l'utilisateur dans la base de donnée
 */
function add(like){
    //1. on récupère le likersArray quand post_id === @postId
    //const data = db
    //                .prepare(/*sql*/`UPDATE posts SET(userId, postId) VALUES (@user_id, @like, @publication)`)
    //                .get(like)
    //2. on transforme en tableau
    //const likersArray = JSON.parse(data);
    //3. on ajoute userId dans le tableau si il n'y est pas
    //4. on met à jour avec un update
    //db
        //.run({likersArray : JSON.stringify(likersArray)});

    let data = "UPDATE posts SET";
    const likersArray = JSON.parse(data);
    for (const key in like){
        if (key === "like") continue;
        data+=` ${key}='${like[key]}'`;
    }
    data+=" WHERE post_id ===@postId";
    db
        .prepare(data)
        .run({likersArray : JSON.stringify(likersArray)});
}

/**
 * Suppression d'un like
 * 
 * @param   {Object}   like                 l'objet supprimé par l'utilisateur
 * @param   {String}   like.id              l'id de suppression
 * @param   {String}   like.userId          
 * @param   {String}   like.postId
 * 
 * @return  {void}                          suppression du like dans la base de donnée
 */
function remove(like){
    let sql= "DELETE FROM likes";
    for (const key in like){
        if (key === "id") continue;
        sql+=` ${key}='${like[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(like);
}

module.exports = {
    add,
    getLikes,
    remove
}