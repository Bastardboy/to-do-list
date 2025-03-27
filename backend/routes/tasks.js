// routes/tasks.js
const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // Ruta para crear una nueva tarea
    router.post('/', async (req, res) => {
        const { title, description } = req.body;
        const id_user = req.id_user;

        const task = {
            id_user,
            title,
            description,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log('Task to be inserted:', task);

        try {
            const result = await db.collection('homeworks-list').insertOne(task);
            console.log('Insert result:', result);
            res.status(201).json({ message: 'Tarea creada con éxito', task });
        } catch (err) {
            console.error('Error creating task:', err);
            res.status(500).json({ error: 'Error creando la tarea' });
        }
    });

    // Ruta para obtener todas las tareas del usuario
    router.get('/', async (req, res) => {
        console.log("GET /tasks");
        const id_user = req.id_user;

        try {

            const tasks = await db.collection('homeworks-list').find({ id_user }).toArray();

            res.json(tasks);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            res.status(500).json({ error: 'Error obteniendo las tareas' });
        }
    });

    return router;
};