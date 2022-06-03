//Ce fichier nous permet de nous connecter à notre BDD

const db = require("better-sqlite3")(process.cwd()+"/groupomania.db",{
    fileMustExist:true
});

/**
 * Initialise un tableau pour notre database
 *
 * @param   {String}  tableName  le nom du tableau
 * @param   {Object}  structure  la structure
 *
 * @return  {Object}             retourne le tableau avec sa structure
 */
function initTable(tableName, structure){
    try{
        const result = db.exec("SELECT id FROM "+tableName);
    }
    catch(err){
        db.exec("CREATE TABLE "+tableName+" ("+structure+");");
    }

}

module.exports = {
    db,
    initTable
};