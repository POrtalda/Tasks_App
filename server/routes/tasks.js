const express = require('express');
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRole');

const taskskRouter = express.Router();

// rotta per fare test e capire req.user 
// che viene aggiunto dal middleware di autenticazione
taskskRouter.get('/me', authMiddleware, (req, res) => {
    return res.json(req.user);
});

// GET /api/tasks
taskskRouter.get('/', authMiddleware, async (req, res) => {

    try {
        let tasks = [];
        // con questo if utente admin deve vedere tutti i tasks
        if (req.user.role === 'admin') {
            tasks = await getDB().collection('tasks').find().toArray();
        }
        else if (req.user.role === 'user') {
            // se utente non admin, deve vedere solo i tasks assegnati a lui
            tasks = await getDB().collection('tasks').find({ assigned_to: req.user.id }).toArray();
        }


        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'nessun tasks trovato',
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: tasks,
            message: 'questi sono tutti i tasks a te assegnati'
        });
    }
    catch (error) {
        // gestisco l'errore
        console.error(`Errore durante il metodo GET api/tasks: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Errore durante il metodo GET api/tasks: ${error}`,
            error: error
        });
    }

});

// GET /tasks/:id
taskskRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // se id non e' un ObjectId valido, ritorna errore 400        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `id non valido: ${id}`
            });
        }

        let task = await getDB().collection('tasks').findOne({ _id: new ObjectId(id) });

        // se l'utente è un user, deve vedere solo i tasks assegnati a lui , quindi quelli con assigned_to uguale al suo id
        if (req.user.role === 'user' && task.assigned_to.toString() !== req.user.id) {
            task = null;
        }


        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'nessun task assegnato',
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: task,
            message: 'questo è il task assegnato a te'
        });
    }
    catch (error) {
        console.error(`Errore durante il metodo GET api/tasks/id: ${error}: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Errore durante il metodo GET api/tasks/id: ${error}`,
            error: error
        });
    }

});

// POST /tasks
// possono creare un task solo gli admin, quindi aggiungo il middleware requireRole che verifica che l'utente abbia il ruolo admin
taskskRouter.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const newTask = req.body;         // leggo i dati del task da creare dal body della richiesta

        console.log('req.user.id: ', req.user.id);  // stampo req.user per vedere che c'è l'utente autenticato
       
        // campi obligatori
        // TITOLO SE MANCA RITORNA ERRORE 400
        if (!newTask.title) {
            return res.status(400).json({
                success: false,
                message: 'titolo è un campo obbligatorio',
                data: null
            });
        }        

        const result = await getDB()
            .collection('tasks')
            .insertOne(newTask);   // inserisco il nuovo task nel db

        // const newTaskDoc = await getDB().collection('tasks').findOne({ _id: result.insertedId }); // recupero il task appena inserito per restituirlo nella risposta

        res.status(201).json({
            success: true,
            data: newTask,
            message: 'nuovo task aggiunto con successo'
        });
    } catch (error) {
        console.error(`Errore durante il metodo POST del task: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Errore durante il metodo POST del task: ${error}`,
            error: error
        });
    }
});

// PUT /tasks/:id
taskskRouter.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `id non valido: ${id}`
            });
        }
        const task = req.body;                 // task da aggiornare, ma sono solo le proprietà che vogliamo aggiornare

        // devo recuparare il task attuale
        let exsistingTask = await getDB().collection('tasks').findOne({ _id: new ObjectId(id) });
        
        if (!exsistingTask) {
            return res.status(404).json({
                success: false,
                message: 'nessun task trovato con questo id',
                data: null
            });
        }

        if (task.completed_perc <  0 || task.completed_perc > 100) {
            return res.status(400).json({
                success: false,
                message: 'la percentuale deve essere un valore tra 0 e 100',
                data: null
            });
        }
        // se sei di tipo user non puoi modificare task non assegnati a te
        if (req.user.role === 'user' && exsistingTask.assigned_to !== req.user.id) {
            return res.status(403)
                .json({
                    success: false,
                    data: null,
                    message: 'utente di tipo user no autorizzato  a modificare task altrui.'
                });
        }
        // se di tipo user non deve poter aggiornare i campi:
        // title, descriptions, expiration-date, assigned_to, expirationDate e assigned_to, 
        // può aggiornare solo completed_perc e notes
        if (req.user.role === 'user' && (task.title || task.descriptions || task.expirationDate || task.assigned_to)) {

            return res.status(403)
                .json({
                    success: false,
                    data: null,
                    message: 'utente di tipo user no autorizzato alla modifica richiesta.'
                });
        }


        const result = await getDB()
            .collection('tasks')
            .updateOne(                      //  fai l'update di un solo record
                { _id: new ObjectId(id) },   // il record da aggiornare è quello con _id = id   
                { $set: task }               // sovrascrivi i campi con i valori di task
            );
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'nessun task trovato con questo id',
                data: null
            });
        }
        return res.status(200).json({
            success: true,
            data: task,
            message: 'task aggiornato con successo'
        });
    } catch (error) {
        console.error(`Errore durante il metodo PUT api/tasks/:id del task: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Errore durante il metodo PUT api/tasks/:id del task: ${error}`,
            error: error
        });
    }
})

// DELETE /tasks/:id
taskskRouter.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `id non valido: ${id}`
            });
        }

        // recuper o dal db il task con l'id richiesto
        let task = await getDB().collection('tasks').findOne({ _id: new ObjectId(id) });
        // controllare se quel task è completo al 100%
        if (task && task.completed_perc < 100) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'non è possibile cancellare un task non completato al 100%'
            });
        }

        // se si cancelliamolo 
        const result = await getDB()
            .collection('tasks')
            .deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'nessun task trovato con questo id',
                data: null
            });
        }
        return res.status(200).json({
            success: true,
            message: 'task eliminato con successo'
        });
    } catch (error) {
        console.error(`Errore durante il metodo DELETE del task: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Errore durante il metodo DELETE del task: ${error}`,
            error: error
        });
    }
});

module.exports = taskskRouter;
