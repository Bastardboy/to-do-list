const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Función para formatear fecha (reutilizable)
const formatDate = () => {
  return new Date().toLocaleString('es-CL', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZone: 'America/Santiago' 
  });
};

module.exports = (db) => {
  /**
   * @route PATCH /
   * @desc Actualiza una tarea existente
   * @access Privado
   * @param {string} taskId - ID de la tarea a actualizar
   * @param {string} title - Nuevo título de la tarea
   * @param {string} description - Nueva descripción de la tarea
   * @returns {object} Mensaje de éxito o error
   */
  router.patch('/', async (req, res) => {
    const id_user = req.id_user;
    const { taskId, title, description } = req.body;

    // Debug: Log de la solicitud entrante
    console.debug('[PATCH /] Solicitud recibida:', {
      id_user,
      taskId,
      title: title ? `${title.substring(0, 30)}${title.length > 30 ? '...' : ''}` : 'null',
      description: description ? `${description.substring(0, 30)}${description.length > 30 ? '...' : ''}` : 'null'
    });

    // Validación del ID
    if (!ObjectId.isValid(taskId)) {
      console.error('[ERROR] ID de tarea inválido:', taskId);
      return res.status(400).json({ 
        error: 'ID de tarea inválido',
        details: `El ID proporcionado (${taskId}) no es válido`
      });
    }

    const filter = { 
      _id: new ObjectId(taskId), 
      id_user 
    };

    const updates = { 
      title,
      description,
      updatedAt: formatDate() // Usamos la función reutilizable
    };

    try {
      // Debug: Log antes de la operación de base de datos
      console.debug('[DEBUG] Ejecutando actualización con:', {
        filter,
        updates: {
          ...updates,
          description: updates.description ? `${updates.description.substring(0, 30)}...` : 'null'
        }
      });

      const result = await db.collection('homeworks-list').updateOne(
        filter, 
        { $set: updates }
      );

      // Manejo de resultados
      if (result.matchedCount === 0) {
        console.warn('[WARN] Tarea no encontrada:', {
          taskId,
          id_user,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        });
        return res.status(404).json({ 
          error: 'Tarea no encontrada o no autorizada',
          details: 'No se encontró la tarea con el ID proporcionado o no pertenece al usuario'
        });
      }

      // Debug: Log de actualización exitosa
      console.debug('[DEBUG] Tarea actualizada exitosamente:', {
        taskId,
        modifiedCount: result.modifiedCount,
        title: updates.title
      });

      // Respuesta exitosa
      res.json({ 
        message: 'Tarea actualizada correctamente',
        updatedFields: Object.keys(updates),
        updatedAt: updates.updatedAt
      });

    } catch (err) {
      console.error('[ERROR] Error al actualizar tarea:', {
        error: err.message,
        stack: err.stack,
        taskId,
        id_user
      });
      res.status(500).json({ 
        error: 'Error actualizando la tarea',
        details: 'Ocurrió un error interno al procesar la solicitud'
      });
    }
  });

  return router;
};