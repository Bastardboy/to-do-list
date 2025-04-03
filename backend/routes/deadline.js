const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    router.patch('/:taskId', async (req, res) => { 
        try {
            const { taskId } = req.params; 
            const { deadline } = req.body;  // Recibir la nueva fecha desde el body

            console.log('📌 ID recibido:', taskId);
            console.log('Nueva fecha límite:', deadline);
    
            if (!ObjectId.isValid(taskId)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const objectId = new ObjectId(taskId);

            // Verificar si la fecha límite es válida
            const parsedDeadline = new Date(deadline);
            if (isNaN(parsedDeadline.getTime())) {
                return res.status(400).json({ error: 'Fecha inválida' });
            }
            
            const result = await db.collection('homeworks-list').updateOne(
                { _id: objectId }, 
                { $set: { deadline: parsedDeadline } } // Guardar la fecha en formato Date
            );
            
            if (result.matchedCount === 0) {
                console.log('❌ No se encontró la tarea');
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            console.log('✅ Fecha límite actualizada');
            res.json({ message: 'Fecha límite actualizada correctamente' });
    
        } catch (err) {
            console.error('❌ Error actualizando la tarea:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    return router;
}
