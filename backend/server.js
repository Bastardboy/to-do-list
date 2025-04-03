const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const update = require('./routes/update');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Cookie'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const MONGODBI_URI = process.env.MONGODBI_URI;

// Conectar a MongoDB
let db;

app.use((req, res, next) => {
    let id_user = req.cookies.id_user;

    if (!id_user) {
        id_user = uuidv4();
        res.cookie('id_user', id_user, {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expira en 1 año
            httpOnly: true, // La cookie no es accesible desde JavaScript
            domain: 'localhost', // Dominio sin puerto
            path: '/', // La cookie estará disponible en todas las rutas
            secure: false, // Solo enviar la cookie sobre HTTPS (false para desarrollo en localhost)
            sameSite: 'lax' // Protección contra ataques CSRF
        });
    }

    req.id_user = id_user;
    next();
});


MongoClient.connect(MONGODBI_URI)
    .then(client => {
        console.log('Conectado a MongoDB');
        db = client.db('to-do-list');

        // Pasar la conexión de la base de datos a las rutas
        const tasksRoutes = require('./routes/tasks')(db);
        app.use('/tasks', tasksRoutes);

        const updateRoutes = require('./routes/update')(db);
        app.use('/update', updateRoutes);

        const deleteRoutes = require('./routes/delete')(db);
        app.use('/delete', deleteRoutes);

        const getDateRoutes = require('./routes/date')(db);
        app.use('/date', getDateRoutes);

        const updateDeadlines = require('./routes/deadline')(db);
        app.use('/deadline', updateDeadlines)
    })
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1); // Detener la aplicación si no se puede conectar a MongoDB
    });


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});