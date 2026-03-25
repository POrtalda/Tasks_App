const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const authMiddleware = (req, res, next) => {
// prendo il token dall'header 'Authorization' della richiesta
const authHeader = req.headers['authorization'];

// se non c'è l'header, ritorno errore 401 (Unauthorized)
if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token mancante' });
}

// leggo il token dal formato "Bearer <token>"
const token = authHeader.split(' ')[1];

// verifico che il token sia valido
try {
    // se il token è valido, decodifico il payload 
    // e lo aggiungo alla richiesta
    const decoded = jwt.verify(token, SECRET);

    // aggiungo l'utente decodificato alla richiesta
    req.user = decoded;

    // passo al prossimo middleware o alla route handler
    next(); 
} catch (error) {
    return res.status(403).json({ success: false, message: 'Token non valido o scaduto' });
}
};

module.exports = authMiddleware;
