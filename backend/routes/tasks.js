const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Función para formatear fechas (reutilizable)
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Santiago'
  });
};

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  const { taskId } = req.params;
  if (!ObjectId.isValid(taskId)) {
    console.debug(`[DEBUG] ID de tarea inválido recibido: ${taskId}`);
    return res.status(400).json({ error: 'ID de tarea inválido' });
  }
  next();
};

// Middleware de logging para todas las rutas
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

module.exports = (db) => {
  // Crear una nueva tarea
  router.post('/', async (req, res) => {
    const { title, description } = req.body;
    const id_user = req.id_user;
    
    console.debug('[DEBUG] Creando nueva tarea:', {
      id_user,
      title,
      description: description ? `${description.substring(0, 30)}...` : 'null'
    });

    const task = {
      id_user,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await db.collection('homeworks-list').insertOne(task);
      
      console.debug('[DEBUG] Tarea creada exitosamente:', {
        insertedId: result.insertedId,
        title: task.title
      });

      const response = {
        message: 'Tarea creada con éxito',
        task: {
          ...task,
          _id: result.insertedId,
          createdAt: formatDate(task.createdAt),
          updatedAt: formatDate(task.updatedAt)
        }
      };

      res.status(201).json(response);
      
      console.debug('[DEBUG] Respuesta enviada:', {
        status: 201,
        data: { 
          ...response,
          task: {
            ...response.task,
            description: response.task.description ? `${response.task.description.substring(0, 30)}...` : 'null'
          }
        }
      });
    } catch (err) {
      console.error('[ERROR] Error creating task:', {
        error: err.message,
        stack: err.stack,
        body: req.body
      });
      res.status(500).json({ error: 'Error creando la tarea' });
    }
  });

  // Obtener tareas con opción de ordenamiento
  const getTasksHandler = async (req, res) => {
    const id_user = req.id_user;
    const { sortBy = 'createdAt', order = 'desc' } = req.query;
    
    console.debug('[DEBUG] Obteniendo tareas con parámetros:', {
      id_user,
      sortBy,
      order
    });

    try {
      // Caso especial para ordenar por título sin considerar mayúsculas
      if (sortBy === 'title') {
        console.debug('[DEBUG] Usando agregación para ordenamiento case-insensitive');
        
        const aggregation = [
          { $match: { id_user } },
          { $addFields: { 
            lowercaseTitle: { $toLower: "$title" },
            originalOrder: { $literal: 1 }
          } },
          { $sort: { 
            lowercaseTitle: order === 'asc' ? 1 : -1,
            originalOrder: 1
          } },
          { $project: { 
            lowercaseTitle: 0,
            originalOrder: 0 
          } }
        ];
        
        const tasks = await db.collection('homeworks-list')
          .aggregate(aggregation)
          .toArray();
          
        console.debug(`[DEBUG] Se encontraron ${tasks.length} tareas ordenadas por título (case-insensitive)`);

        const response = tasks.map(task => ({
          ...task,
          createdAt: formatDate(task.createdAt),
          updatedAt: formatDate(task.updatedAt)
        }));

        res.json(response);
        return;
      }
      
      // Ordenamiento normal para otros campos
      const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };
      console.debug('[DEBUG] Ordenamiento estándar con opciones:', sortOptions);
      
      const tasks = await db.collection('homeworks-list')
        .find({ id_user })
        .sort(sortOptions)
        .toArray();
        
      console.debug(`[DEBUG] Se encontraron ${tasks.length} tareas ordenadas por ${sortBy}`);

      const response = tasks.map(task => ({
        ...task,
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt)
      }));

      res.json(response);
    } catch (err) {
      console.error('[ERROR] Error fetching tasks:', {
        error: err.message,
        stack: err.stack,
        query: req.query
      });
      res.status(500).json({ error: 'Error obteniendo las tareas' });
    }
  };
  
  // Rutas para obtener tareas
  router.get('/', getTasksHandler);
  router.get('/ordenar', getTasksHandler);

  // Obtener una tarea por ID
  router.get('/:taskId', validateObjectId, async (req, res) => {
    const { taskId } = req.params;
    const id_user = req.id_user;
    
    console.debug('[DEBUG] Buscando tarea por ID:', { taskId, id_user });

    try {
      const task = await db.collection('homeworks-list').findOne({ 
        _id: new ObjectId(taskId), 
        id_user 
      });
      
      if (!task) {
        console.debug('[DEBUG] Tarea no encontrada:', { taskId });
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      
      console.debug('[DEBUG] Tarea encontrada:', {
        taskId,
        title: task.title
      });

      const response = {
        ...task,
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt)
      };

      res.json(response);
    } catch (err) {
      console.error('[ERROR] Error fetching task:', {
        error: err.message,
        stack: err.stack,
        params: req.params
      });
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Actualizar el estado de una tarea
  router.patch('/complete/:taskId', validateObjectId, async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;
    const id_user = req.id_user;
    
    console.debug('[DEBUG] Actualizando estado de tarea:', {
      taskId,
      completed,
      id_user
    });

    try {
      const result = await db.collection('homeworks-list').updateOne(
        { _id: new ObjectId(taskId), id_user },
        { $set: { 
          completed: Boolean(completed),
          updatedAt: new Date() 
        } }
      );

      if (result.modifiedCount === 1) {
        console.debug('[DEBUG] Estado de tarea actualizado exitosamente:', {
          taskId,
          newStatus: Boolean(completed)
        });

        const response = { 
          message: 'Estado actualizado', 
          newStatus: Boolean(completed)
        };

        res.status(200).json(response);
      } else {
        console.debug('[DEBUG] Tarea no encontrada para actualizar:', { taskId });
        res.status(404).json({ error: 'Tarea no encontrada' });
      }
    } catch (err) {
      console.error('[ERROR] Error actualizando estado:', {
        error: err.message,
        stack: err.stack,
        params: req.params,
        body: req.body
      });
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  return router;
};