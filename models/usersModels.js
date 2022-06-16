const {db, initTable} = require("./database");

/**
 * Le schéma d'un utilisateur
 *
 * @var {Object}
 */
const userSchema =  /*sql*/`
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    pwd TEXT,
    email TEXT NOT NULL UNIQUE,
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

/**
 * Création d'un utilisateur
 *
 * @param   {Object}  user           l'objet de l'utilisateur
 * @param   {String}  user.email     l'adresse email de l'utilisateur
 * @param   {String}  user.name      le nom de l'utilisateur
 * @param   {String}  user.password  le mot de passe hasher
 *
 * @return  {void}                   création de l'utilisateur dans la base de donnée
 */
function create(user){
    db
        .prepare("INSERT INTO users (pwd, email, name, admin) VALUES (@password, @email, @name, 0)")
        .run(user);

}

/**
 * Trouver un utilisateur par son email
 */
function findByEmail(email){
    return db
        .prepare("SELECT * FROM users WHERE email=@email")
        .get(email);
}

/**
 * Modification d'un utilisateur
 *
 * @param   {Object}  newSpecs             l'objet modifié par l'utilisateur
 * @param   {String}  newSpecs.id          l'id de la modification
 * @param   {String}  [newSpecs.email]     si l'utilisateur modifie son email
 * @param   {String}  [newSpecs.name]      si l'utilisateur modifie son nom
 * @param   {String}  [newSpecs.password]  si l'utilisateur modifie son mot de passe hasher
 *
 * @return  {void}                         modification de l'utilisateur dans la base de donnée
 */
function update(newSpecs){
    let sql= "UPDATE users SET";
    for (const key in newSpecs){
        if (key === "id") continue;
        sql+=` ${key}='${newSpecs[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(newSpecs);
}

/**
 * Suppression d'un utilisateur
 * 
 * @param   {Object}   removeUser              l'objet supprimé par l'utilisateur
 * @param   {String}   removeUser.id           l'id de suppression
 * @param   {String}   removeUser.email        l'utilisateur supprime son email
 * @param   {String}   removeUser.name         l'utilisateur supprime son nom
 * @param   {String}   removeUser.password     l'utilisateur supprime son mot de passe hasher
 *
 * @return  {void}                             suppression de l'utilisateur dans la base de donnée
 */
function remove(removeUser){
    let sql= "DELETE FROM users";
    for (const key in removeUser){
        if (key === "id") continue;
        sql+=` ${key}='${removeUser[key]}'`;
    }
    sql+=" WHERE id=@id";
    db.prepare(sql).run(removeUser);
}

module.exports = {
    create,
    emailExists,
    findByEmail,
    remove,
    update
}
