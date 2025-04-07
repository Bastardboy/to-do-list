const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const helmet = require('helmet');

// Configuración de entorno
dotenv.config();

// Constantes de configuración
const {
  PORT = 5000,
  MONGODBI_URI,
  NODE_ENV = 'development',
  CLIENT_ORIGIN = 'https://752f-2800-150-156-537-f72-bf98-a626-83c8.ngrok-free.app/'
  //CLIENT_ORIGIN = 'http://localhost:5173'
} = process.env;

// Inicialización de la aplicación
const app = express();

// Middlewares de seguridad y configuración
app.use(helmet());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  next();
});
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Cookie'],
  credentials: true
}));

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

    // Middleware de manejo de usuario con colección 'users'
    app.use(async (req, res, next) => {
      try {
        let cookieId = req.cookies.id_user;

        if (!cookieId) {
          cookieId = uuidv4();
          const cookieOptions = {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/'
          };

          if (NODE_ENV === 'production') {
            cookieOptions.domain = process.env.COOKIE_DOMAIN;
          }

          res.cookie('id_user', cookieId, cookieOptions);
          console.debug(`[AUTH] Cookie generada: ${cookieId}`);
        }

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ cookieId });

        if (!user) {
          user = {
            cookieId,
            notify: false,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
          };
          const result = await usersCollection.insertOne(user);
          user._id = result.insertedId;
          console.debug(`[AUTH] Usuario creado en DB: ${user._id}`);
        }

        req.user = user;
        next();
      } catch (err) {
        console.error('[AUTH] Error:', err);
        res.status(500).send('Error de autenticación');
      }
    });

    // Configuración dinámica de rutas
    const routes = [
      { path: '/tasks', router: './routes/tasks' },
      { path: '/update', router: './routes/update' },
      { path: '/delete', router: './routes/delete' },
      { path: '/date', router: './routes/date' },
      { path: '/deadline', router: './routes/deadline' },
      { path: '/notify', router: './routes/notify' },
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
    const server = app.listen(PORT, '0.0.0.0', () => {
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