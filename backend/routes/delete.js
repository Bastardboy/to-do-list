const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Middleware de logging para todas las rutas DELETE
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] DELETE ${req.originalUrl}`);
  next();
});

module.exports = (db) => {
  /**
   * @route DELETE /
   * @desc Elimina una tarea existente
   * @access Privado
   * @param {string} taskId - ID de la tarea a eliminar (en el body)
   * @returns {object} Mensaje de éxito o error
   */
  router.delete('/:taskId', async (req, res) => {
    const id_user = req.user.cookieId;
    const { taskId } = req.params;

    // Debug: Log de la solicitud entrante
    console.debug('[DELETE /] Solicitud recibida:', {
      id_user,
      taskId,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Validación del ID
    if (!ObjectId.isValid(taskId)) {
      console.error('[ERROR] ID de tarea inválido:', {
        taskId,
        id_user,
        receivedType: typeof taskId
      });
      return res.status(400).json({ 
        error: 'ID de tarea inválido',
        details: 'El formato del ID proporcionado no es válido'
      });
    }

    const filter = {
      _id: new ObjectId(taskId),
      id_user
    };

    try {
      // Debug: Log antes de la operación de base de datos
      console.debug('[DEBUG] Ejecutando eliminación con filtro:', filter);

      const result = await db.collection('homeworks-list').deleteOne(filter);

      // Manejo de resultados
      if (result.deletedCount === 0) {
        console.warn('[WARN] Tarea no encontrada para eliminación:', {
          taskId,
          id_user,
          deletedCount: result.deletedCount
        });
        return res.status(404).json({ 
          error: 'Tarea no encontrada o no autorizada',
          details: 'No se encontró la tarea con el ID proporcionado o no pertenece al usuario'
        });
      }

      // Debug: Log de eliminación exitosa
      console.info('[INFO] Tarea eliminada exitosamente:', {
        taskId,
        id_user,
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString()
      });

      // Respuesta exitosa
      res.status(200).json({ 
        message: 'Tarea eliminada correctamente',
        taskId,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('[ERROR] Error al eliminar tarea:', {
        error: {
          message: err.message,
          stack: err.stack
        },
        taskId,
        id_user,
        timestamp: new Date().toISOString()
      });
      res.status(500).json({ 
        error: 'Error eliminando la tarea',
        details: 'Ocurrió un error interno al procesar la solicitud'
      });
    }
  });

  return router;
};