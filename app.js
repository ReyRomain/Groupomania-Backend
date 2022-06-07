const express = require('express');
const path = require('path')

const { default: helmet } = require('helmet');

const app = express();

/**
 * Permet de faire communiquer les ports entre eux afin d'éviter les erreurs CORS
 */
if (process.env.MODE === "DEV") {
    app.use((req, res, next) => {

        //ce header permet d'accéder à notre API depuis n'importe quelle origine
        res.setHeader('Access-Control-Allow-Origin', '*');

        //ce header permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

        //ce header permet d'envoyer des requêtes avec les méthodes mentionnées
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

        //ce header permet d'autoriser le serveur à fournir des scripts pour la page
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        next();
    });
}
else app.use(helmet());

/**
 * BodyParser
 */
app.use(express.json());

/**
 * Middleware qui permet de charger les fichiers
 */
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;