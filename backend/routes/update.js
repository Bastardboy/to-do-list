const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    router.patch('/', async (req, res) => {
        const id_user = req.id_user;
        const { title, description } = req.body; // Desestructurar title y description directamente

        const taskId = req.body.taskId; // Obtener taskId desde el body

        if (!ObjectId.isValid(taskId)) {
            console.log("taskId inválido:", taskId);
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }

        const filter = { _id: new ObjectId(taskId), id_user };

        const updates = { 
            title,
            description,
            updatedAt: new Date().toLocaleString('es-CL', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                timeZone: 'America/Santiago' 
            }), // Asegúrate de actualizar la fecha de modificación
        };

        try {
            const result = await db.collection('homeworks-list').updateOne(filter, {
                $set: updates,
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
