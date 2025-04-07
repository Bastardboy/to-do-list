const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Middleware para validar el formato del ID de MongoDB
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
   * @desc Obtiene las fechas de creación, límite y actualización de una tarea
   * @access Privado
   */
  router.get('/:taskId', validateObjectId, async (req, res) => {
    const { taskId } = req.params;

    console.debug('[GET /:taskId] Solicitud recibida', {
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

      const createdAt = task.createdAt instanceof Date ? task.createdAt.toISOString() : null;
      const deadline = task.deadline instanceof Date ? task.deadline.toISOString() : null;
      const updatedAt = task.updatedAt instanceof Date ? task.updatedAt.toISOString() : null;

      console.info('[INFO] Fechas recuperadas:', {
        taskId,
        createdAt,
        deadline,
        updatedAt
      });

      res.json({
        createdAt,
        deadline,
        lastUpdated: updatedAt
      });

    } catch (err) {
      console.error('[ERROR] Error obteniendo fechas:', {
        taskId,
        error: err.message,
        stack: err.stack
      });

      res.status(500).json({
        error: 'Error interno del servidor',
        details: 'Ocurrió un error al procesar la solicitud'
      });
    }
  });

  return router;
};
