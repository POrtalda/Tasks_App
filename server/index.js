require ('dotenv').config();
const express = require('express');
const {connectDB} = require('./db');

const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || process.env.PORT_DEV;


// Middleware to parse JSON bodies
app.use(cors({origin:process.env.CORS_ORIGIN}));
app.use(express.json());
app.use('/api/tasks', tasksRouter);   // /api/tasks è il prefisso per tutte le chiamate api dei tasks
app.use('/api/auth', authRouter);


// Start the server
async function startServer() {
    await connectDB();   // aspetta connessione al database
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

startServer();










