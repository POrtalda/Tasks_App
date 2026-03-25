const express = require('express');
const { getDB } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

const authRouter = express.Router();

// API POST /api/auth
authRouter.post('/', async (req, res) => {
    try {

        const username = req.body; // è composto da emal e password
        // verifico se nel db esiste un utente che mi è stato passato
        const user = await getDB()
            .collection('users')
            .findOne({ email: username.email });

        // se non trova utente
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utente non trovato nel db', data: null });
        }

        // controllo se la password  è valida con il metodo 'compare' di bcrypt, 
        // che confronta la password in chiaro con quella hashata nel db
        const isPasswordValid = await bcrypt.compare(username.password, user.password);

        // se la password non è valida, ritorno errore 401 (Unauthorized)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
        }

        // se tutto ok, genero un token JWT con il metodo 'sign' di jsonwebtoken,
        // che prende come payload l'email e l'id dell'utente, 
        // la chiave segreta e un'opzione di scadenza
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET,
            { expiresIn: '1h' }
        );

        
        console.log('Token generato:', token);

        return res.status(200).json({
            success: true,
            message: 'Autorizzazione avvenuta con successo',
            data: token
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Errore durante l'autorizzazione: ${error}`,
                data: null
            });
        }
    });

module.exports = authRouter;