const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan'); // Agregado para logging de requests HTTP
const helmet = require('helmet'); // Agregado para seguridad básica

// Configuración de entorno
dotenv.config();

// Constantes de configuración
const {
  PORT = 5000,
  MONGODBI_URI,
  NODE_ENV = 'development',
  CLIENT_ORIGIN = 'http://localhost:5173'
} = process.env;

// Inicialización de la aplicación
const app = express();

// Middlewares de seguridad y configuración
app.use(helmet());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Cookie'],
  credentials: true
}));

// Middleware de manejo de usuario
app.use((req, res, next) => {
  let id_user = req.cookies.id_user;

  if (!id_user) {
    id_user = uuidv4();
    const cookieOptions = {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año en milisegundos
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    };

    if (NODE_ENV === 'production') {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('id_user', id_user, cookieOptions);
    console.debug(`[AUTH] Nueva cookie de usuario generada: ${id_user}`);
  }

  req.id_user = id_user;
  next();
});

// Conexión a MongoDB y configuración de rutas
const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(MONGODBI_URI, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
      wtimeoutMS: 2500
    });

    console.info('[DB] Conectado a MongoDB');
    const db = client.db('to-do-list');

    // Configuración dinámica de rutas
    const routes = [
      { path: '/tasks', router: './routes/tasks' },
      { path: '/update', router: './routes/update' },
      { path: '/delete', router: './routes/delete' },
      { path: '/date', router: './routes/date' },
      { path: '/deadline', router: './routes/deadline' }
    ];

    routes.forEach(({ path, router }) => {
      app.use(path, require(router)(db));
      console.debug(`[ROUTE] Ruta configurada: ${path}`);
    });

    // Middleware para manejo de errores 404
    app.use((req, res) => {
      console.warn(`[404] Ruta no encontrada: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ error: 'Endpoint no encontrado' });
    });

    // Middleware para manejo de errores globales
    app.use((err, req, res, next) => {
      console.error(`[ERROR] ${err.message}`, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
      });
      res.status(500).json({ error: 'Error interno del servidor' });
    });

    return client;
  } catch (err) {
    console.error('[DB ERROR] Error conectando a MongoDB:', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

// Inicio del servidor
const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      console.info(`[SERVER] Servidor corriendo en http://localhost:${PORT} (${NODE_ENV})`);
    });

    // Manejo de cierre elegante
    process.on('SIGTERM', () => {
      console.info('[SERVER] Apagando servidor...');
      server.close(() => {
        console.info('[SERVER] Servidor apagado');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('[SERVER ERROR] Error al iniciar servidor:', err);
    process.exit(1);
  }
};

startServer();