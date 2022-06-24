/**
 * Package Multer
*/
const multer = require('multer');
const maxSize = 1 * 1000 * 1000; //1Mo

/**
 * Dictionnaire pour générer l'extension du fichier
 *
 * @type {Object}
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * Explique à multer où enregistrer les fichiers
 */
const destination = (req, file, callback) => {
   callback(null, 'images');
}
 
/**
 * Explique à multer quel nom de fichier utiliser
 */
const filename = (req, file, callback) => {

    /**
     * On utilise le nom d'origine du fichier et on remplace les espaces par underscore
     */
    const name = file.originalname.split(' ').join('_');

    /**
     * Création de l'extension de fichier
     */
    const extension = MIME_TYPES[file.mimetype];

    const filename = name + Date.now() + '.' + extension;

    req.body.imageUrl= `${req.protocol}://${req.get('host')}/images/${filename}`
    
    /**
     * Création du fileName entier
     */
    callback(null, filename );
};

module.exports = multer({
    storage: multer.diskStorage({ destination, filename }),  
    limits: { fileSize: maxSize }
}).single('image');