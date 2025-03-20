const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}
));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const MONGODBI_URI = process.env.MONGODBI_URI;

// Conectar a MongoDB
let db;

MongoClient.connect(MONGODBI_URI)
    .then(client => {
        console.log('Conectado a MongoDB');
        db = client.db('to-do-list');
    })
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1); // Detener la aplicación si no se puede conectar a MongoDB
    });

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


app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    const id_user = req.id_user;

    const task = {
        id_user,
        title,
        description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    console.log('Task to be inserted:', task);

    try {
        const result = await db.collection('homeworks-list').insertOne(task);
        console.log('Insert result:', result);

    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Error creando la tarea' });
    }
});

app.get('/tasks', async (req, res) => {
    console.log("GET /tasks");
    const id_user = req.id_user;

    try {
        const tasks = await db.collection('homeworks-list').find({ id_user }).toArray();
        
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Error obteniendo las tareas' });
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});