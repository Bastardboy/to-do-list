const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    router.patch('/', async (req, res) => {
        const id_user = req.id_user; // Obtener desde cookies/middleware
        const { taskId } = req.body; // Obtener taskId desde el body

        if (!ObjectId.isValid(taskId)) {
            console.log('ID de tarea inválido:', taskId);
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }

        try {
            // Primero, buscamos la tarea para verificar su estado actual
            const task = await db.collection('homeworks-list').findOne({
                _id: new ObjectId(taskId),
                id_user: id_user,
            });

            if (!task) {
                console.log(`Tarea con ID ${taskId} no encontrada para el usuario ${id_user}`);
                return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
            }

            // Determinamos el nuevo estado
            const newCompletedState = task.completed === false ? true : false;

            // Actualizamos el estado de la tarea
            const status = await db.collection('homeworks-list').updateOne(
                {
                    _id: new ObjectId(taskId),
                    id_user: id_user,
                },
                {
                    $set: { completed: newCompletedState },
                }
            );

            if (status.modifiedCount === 0) {
                console.log(`Tarea con ID ${taskId} no encontrada para el usuario ${id_user}`);
                return res.status(404).json({ error: 'Tarea no encontrada o ya actualizada' });
            }

            const operationTime = new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' });
            console.log(`Tarea con ID ${taskId} actualizada correctamente para el usuario ${id_user} a las ${operationTime}`);
            res.status(200).json({ message: 'Estado de tarea actualizado correctamente', completed: newCompletedState });

        } catch (err) {
            console.error('Error actualizando el estado de la tarea:', err);
            res.status(500).json({ error: 'Error actualizando estado de tarea' });
        }
    });

    return router;
};
