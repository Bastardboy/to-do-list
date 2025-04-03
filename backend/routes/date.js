const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
    // Ruta para obtener la fecha de creación y la fecha límite
    router.get('/:taskId', async (req, res) => { 
        try {
            const taskId = req.params.taskId; 
            console.log('📌 ID recibido:', taskId);
    
            if (!ObjectId.isValid(taskId)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
    
            const objectId = new ObjectId(taskId);
            console.log('🔍 Buscando tarea con ObjectId:', objectId);
    
            const task = await db.collection('homeworks-list').findOne({ _id: objectId });
    
            if (!task) {
                console.log('❌ No se encontró la tarea en la base de datos');
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
    
            console.log('✅ Tarea encontrada:', task);
            res.json({ 
                createdAt: task.createdAt, 
                deadline: task.deadline || null  // Devuelve la fecha límite, si existe
            });
    
        } catch (err) {
            console.error('❌ Error obteniendo la tarea:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    return router;
}
