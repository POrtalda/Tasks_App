require ('dotenv').config();
const express = require('express');
const {connectDB} = require('./db');

const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const cors = require('cors');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || process.env.PORT_DEV;


// Middleware to parse JSON bodies
app.set('trust proxy', 1); // trust first proxy
app.use(helmet());
app.use(express.json({limit:'40kb'}));   // per limitare la dimensione del body delle richieste, in modo da evitare attacchi di tipo DoS
app.use(cors({origin:process.env.CORS_ORIGIN}));
app.use('/api/tasks', ratelimit({windowMs: 15*60*1000, max: 500, message: 'Troppe richieste , ritenta dopo'}), tasksRouter);   // /api/tasks è il prefisso per tutte le chiamate api dei tasks
app.use('/api/auth', ratelimit({windowMs: 15*60*1000, max: 4, message: 'Troppe richieste , ritenta dopo'}),authRouter);


// Start the server
async function startServer() {
    await connectDB();   // aspetta connessione al database
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

startServer();










