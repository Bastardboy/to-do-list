const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Middleware de validación de ObjectId
const validateObjectId = (req, res, next) => {
  const { taskId } = req.params;
  if (!ObjectId.isValid(taskId)) {
    console.error('[ERROR] ID de tarea inválido:', taskId);
    return res.status(400).json({ 
      error: 'ID inválido',
      details: 'El formato del ID proporcionado no es válido'
    });
  }
  next();
};

module.exports = (db) => {
  /**
   * @route GET /:taskId
   * @desc Obtiene las fechas (creación y límite) de una tarea
   * @access Privado
   * @param {string} taskId - ID de la tarea
   * @returns {object} Fechas de creación y límite
   */
  router.get('/:taskId', validateObjectId, async (req, res) => {
    const { taskId } = req.params;

    console.debug('[GET /:taskId] Solicitud recibida:', {
      taskId,
      ip: req.ip
    });

    try {
      const task = await db.collection('homeworks-list').findOne({ 
        _id: new ObjectId(taskId) 
      });

      if (!task) {
        console.warn('[WARN] Tarea no encontrada:', taskId);
        return res.status(404).json({ 
          error: 'Tarea no encontrada',
          details: 'No existe una tarea con el ID proporcionado'
        });
      }

      console.info('[INFO] Fechas recuperadas:', {
        taskId,
        createdAt: task.createdAt?.toISOString(),
        deadline: task.deadline?.toISOString()
      });

      res.json({ 
        createdAt: task.createdAt?.toISOString() || null,
        deadline: task.deadline?.toISOString() || null,
        lastUpdated: task.updatedAt?.toISOString() || null
      });

    } catch (err) {
      console.error('[ERROR] Error obteniendo fechas:', {
        error: err.message,
        stack: err.stack,
        taskId
      });
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: 'Ocurrió un error al procesar la solicitud'
      });
    }
  });

  return router;
};