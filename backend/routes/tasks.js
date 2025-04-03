const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    // Crear una nueva tarea
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

        try {
            const result = await db.collection('homeworks-list').insertOne(task);
            res.status(201).json({ message: 'Tarea creada con éxito', task });
        } catch (err) {
            console.error('Error creating task:', err);
            res.status(500).json({ error: 'Error creando la tarea' });
        }
    });

    // Obtener todas las tareas del usuario
    router.get('/', async (req, res) => {
        const id_user = req.id_user;
        try {
            const tasks = await db.collection('homeworks-list').find({ id_user }).toArray();
            // Convertir la fecha según tus necesidades
            const tasksFormatted = tasks.map(task => {
                const formattedDate = new Date(task.createdAt).toLocaleDateString('es-CL', {
                    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Santiago'
                });
                return { ...task, createdAt: formattedDate };
            });
            res.json(tasksFormatted);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            res.status(500).json({ error: 'Error obteniendo las tareas' });
        }
    });

    // Obtener una tarea por ID
    router.get('/:taskId', async (req, res) => {
        const { taskId } = req.params;
        const id_user = req.id_user;
        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }
        try {
            const task = await db.collection('homeworks-list').findOne({ _id: new ObjectId(taskId), id_user });
            if (!task) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            res.json(task);
        } catch (err) {
            console.error('Error fetching task:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // Actualizar el estado de una tarea (completada/incompleta)
    router.patch('/complete/:taskId', async (req, res) => {
        const { taskId } = req.params;
        const { completed } = req.body;
        const id_user = req.id_user;
    
        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }
    
        try {
            const result = await db.collection('homeworks-list').updateOne(
                { _id: new ObjectId(taskId), id_user },
                { $set: { completed: Boolean(completed) } }
            );
    
            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'Estado actualizado', newStatus: Boolean(completed) });
            } else {
                res.status(404).json({ error: 'Tarea no encontrada' });
            }
        } catch (err) {
            console.error('Error actualizando estado:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
  
    return router;
};
