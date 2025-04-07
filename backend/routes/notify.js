const express = require('express');
const router = express.Router();

// Middleware de logging para esta ruta
router.use((req, res, next) => {
  console.log(`[NOTIFY] ${req.method} ${req.originalUrl} | User: ${req.user?.cookieId}`);
  next();
});

module.exports = (db) => {
  // Obtener estado de notificaciones
  router.get('/', async (req, res) => {
    try {
      console.log('[NOTIFY] Obteniendo estado de notificaciones para usuario:', req.user.cookieId);
      
      // Busca al usuario por su cookieId
      const user = await db.collection('users').findOne({ cookieId: req.user.cookieId });
      
      if (!user) {
        console.warn('[NOTIFY] Usuario no encontrado en la base de datos');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Si el usuario tiene la propiedad "notify", la devuelve; de lo contrario, false
      console.log('[NOTIFY] Estado de notificaciones encontrado:', user.notify);
      return res.json({ notify: user.notify || false });
      
    } catch (err) {
      console.error('[NOTIFY ERROR] Error obteniendo notificación:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  });

  // Actualizar estado de notificaciones
  router.patch('/:cookieId', async (req, res) => {
    try {
      console.log('[NOTIFY] Actualizando notificaciones para usuario:', {
        userId: req.user.cookieId,
        newState: req.body.enabled
      });

      // Actualiza el estado de las notificaciones del usuario
      const result = await db.collection('users').updateOne(
        { cookieId: req.user.cookieId },
        { $set: { notify: req.body.enabled } },
        { upsert: true }
      );

      // Si la actualización fue exitosa, responde con los datos actualizados
      console.log('[NOTIFY] Resultado de actualización:', result);
      
      return res.json({
        success: true,
        notify: req.body.enabled
      });
      
    } catch (err) {
      console.error('[NOTIFY ERROR] Error actualizando notificaciones:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  });

  return router;
};
