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
    likersArray TEXT DEFAULT "[]" NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
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
    const sql = db.prepare(/*sql*/`
        SELECT id 
        FROM posts 
        WHERE user_id=$userId
    `);
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
        .prepare(/*sql*/`
            SELECT user_id 
            FROM posts 
            WHERE user_id=$id
        `)
        .get(post);
}

/**
 * Récupère les posts
 */
function allPosts(posts) {
    return db 
        .prepare(/*sql*/`
            SELECT content, user_id, publication, imageUrl, likes 
            FROM posts 
            JOIN users ON user.id=userId 
            ORDER BY publication DESC 
            LIMIT 50`)
        .get(posts);
}

/**
 * Création d'un post
 *
 * @param   {Object}  post                l'objet du post
 * @param   {String}  post.content        le contenu du post
 * @param   {String}  post.user_id        le nom de l'utilisateur qui à créé le post
 * @param   {String}  [post.now]  la date de publication du post
 *
 * @return  {void}                        création d'un post par l'utilisateur dans la base de donnée
 */
function create(post){
    post.now = new Date().toLocaleString();
    db
        .prepare(/*sql*/`
            INSERT INTO posts (content, user_id, publication ) 
            VALUES (@content, @user_id, @now)
        `)
        .run(post);
}

/**
 * Modification d'un post
 *
 * @param   {Object}  newSpecs                le post modifié par l'utilisateur
 * @param   {String}  newSpecs.id             l'id de la modification
 * @param   {String}  [newSpecs.user_id]      si l'utilisateur modifie le propriétaire du post
 * @param   {Boolean} [newSpecs.like]         true +1 like par l'utilisateur ou false -1 pour retirer son like (true j'aime et je n'avais pas d'avis avant false j'aimais mais je n'aime plus)
 *
 * @return  {void}                            modification du post par l'utilisateur dans la base de donnée
 */
function updateById(newSpecs){
    if (newSpecs.like !== undefined){
        const data = db
            .prepare(/*sql*/`
                SELECT likersArray 
                FROM posts 
                WHERE id=@id
            `)
            .get(newSpecs)
        const likersArray = JSON.parse(data.likersArray);
        if (newSpecs.like) likersArray.push(newSpecs.user_id);
        else likersArray.slice(likersArray.indexOf(newSpecs.user_id),1);
        const add = {
            likersArray : JSON.stringify(likersArray),
            likes : likersArray.length
        }
        newSpecs = {
            ...newSpecs,
            ...add
        }
    }

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
 * @return  {void}                                  suppression du post dans la base de donnée
 */
function removeById(removePost){
    db
        .prepare(/*sql*/`
            DELETE FROM posts 
            WHERE id=$id
        `)
        .run(removePost);
}

module.exports = {
    allPosts,
    create,
    findAuthorByPostId,
    findByUserId,
    removeById,
    updateById
}
