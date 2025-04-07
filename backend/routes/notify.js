const express = require('express');
const router = express.Router();

// Middleware de logging
router.use((req, res, next) => {
  console.log(`[NOTIFY] ${req.method} ${req.originalUrl} | User: ${req.user?.cookieId}`);
  next();
});

module.exports = (db) => {
  // Obtener estado de notificaciones
  router.get('/', async (req, res) => {
    try {
      console.log('[NOTIFY] Obteniendo estado para usuario:', req.user.cookieId);
      
      const user = await db.collection('users').findOne({ 
        cookieId: req.user.cookieId 
      });
      
      if (!user) {
        console.warn('[NOTIFY] Usuario no encontrado');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      console.log('[NOTIFY] Estado encontrado:', user.notify);
      return res.json({ notify: user.notify || false });
      
    } catch (err) {
      console.error('[NOTIFY ERROR] Error obteniendo estado:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  });

  // Actualizar estado de notificaciones
  router.patch('/', async (req, res) => {
    try {
      console.log('[NOTIFY] Actualizando para usuario:', {
        userId: req.user.cookieId,
        newState: req.body.enabled
      });

      const result = await db.collection('users').updateOne(
        { cookieId: req.user.cookieId },
        { $set: { notify: req.body.enabled } },
        { upsert: true }
      );

      console.log('[NOTIFY] Resultado:', result);
      
      return res.json({
        success: true,
        notify: req.body.enabled
      });
      
    } catch (err) {
      console.error('[NOTIFY ERROR] Error actualizando:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  });

  return router;
};