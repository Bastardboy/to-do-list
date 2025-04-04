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
   * @route PATCH /:taskId
   * @desc Actualiza la fecha límite de una tarea
   * @access Privado
   * @param {string} taskId - ID de la tarea
   * @param {string} deadline - Nueva fecha límite (ISO string)
   * @returns {object} Mensaje de éxito/error
   */
  router.patch('/:taskId', validateObjectId, async (req, res) => {
    const { taskId } = req.params;
    const { deadline } = req.body;

    console.debug('[PATCH /:taskId] Solicitud recibida:', {
      taskId,
      deadline,
      ip: req.ip
    });

    // Validación de fecha
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline.getTime())) {
      console.error('[ERROR] Fecha límite inválida:', deadline);
      return res.status(400).json({ 
        error: 'Fecha inválida',
        details: 'El formato de fecha proporcionado no es válido'
      });
    }

    try {
      const result = await db.collection('homeworks-list').updateOne(
        { _id: new ObjectId(taskId) },
        { 
          $set: { 
            deadline: parsedDeadline,
            updatedAt: new Date() 
          } 
        }
      );

      if (result.matchedCount === 0) {
        console.warn('[WARN] Tarea no encontrada para actualización:', taskId);
        return res.status(404).json({ 
          error: 'Tarea no encontrada',
          details: 'No existe una tarea con el ID proporcionado'
        });
      }

      console.info('[INFO] Fecha límite actualizada:', {
        taskId,
        newDeadline: parsedDeadline.toISOString()
      });

      res.json({ 
        message: 'Fecha límite actualizada correctamente',
        deadline: parsedDeadline.toISOString(),
        updatedAt: new Date().toISOString()
      });

    } catch (err) {
      console.error('[ERROR] Error actualizando fecha límite:', {
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