const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    router.delete('/', async (req, res) => {
        const id_user = req.id_user; // Obtener desde cookies/middleware
        const { taskId } = req.body; // Obtener taskId desde el body

        if (!ObjectId.isValid(taskId)) {
            console.log('ID de tarea inválido:', taskId);
            return res.status(400).json({ error: 'ID de tarea inválido' });
        }

        try {
            const result = await db.collection('homeworks-list').deleteOne({
                _id: new ObjectId(taskId),
                id_user: id_user
            });

            if (result.deletedCount === 0) {
                console.log(`Tarea con ID ${taskId} no encontrada para el usuario ${id_user}`);
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            console.log(`Tarea con ID ${taskId} eliminada correctamente para el usuario ${id_user}`);
            res.status(200).json({ message: 'Tarea eliminada correctamente' });
        } catch (err) {
            console.error('Error eliminando la tarea:', err);
            res.status(500).json({ error: 'Error eliminando la tarea' });
        }
    });

    return router;
};