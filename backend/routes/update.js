const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    router.patch('/', async (req, res) => {
        const id_user = req.id_user;
        const { taskId, ...updates } = req.body;

        console.log('Body:', req.body);
        console.log('id_user:', id_user);

        if (!ObjectId.isValid(taskId)) {
            console.log("taskId inválido:", taskId);
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }

        const filter = { _id: new ObjectId(taskId), id_user };

        updates.updatedAt = new Date();

        const update = {
            $set: {
                title,
                description,
                completed: completed === true || completed === 'true', // por si viene como string
                updatedAt: new Date(),
            }
        };

        try {
            const result = await db.collection('homeworks-list').updateOne(filter,{
                $set: updates
            });

            if (result.matchedCount === 0) {
                console.log("No se encontró la tarea para actualizar");
                return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
            }

            res.json({ message: 'Tarea actualizada correctamente' });

        } catch (err) {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Error actualizando la tarea' });
        }
    });

    return router;
};
