# Task-Manager

Task-Manager es una aplicación web para organizar tareas personales de cualquier índole. Permite crear, editar, eliminar y gestionar tareas con fechas límite, integrando notificaciones y una interfaz visual atractiva con cambios dinámicos de color de fondo.

## Características

- 📝 Crear nuevas tareas con título y descripción
- 📆 Asignar o modificar fecha límite para cada tarea
- ⏰ Notificación visual de cuántos días quedan para la fecha límite
- 🔔 Sistema de notificaciones (en desarrollo)
- ✅ Marcar tareas como completadas
- 🎨 Interfaz dinámica con fondo animado y diseño colorido
- 🔍 Ordenar tareas por fecha de creación, fecha límite o título
- 🎙️ Introducir texto por voz y ejecutar comandos específicos mediante reconocimiento de voz

## Tecnologías utilizadas

### Frontend
- React
- Vite
- TailwindCSS v4
- React Calendar
- Service Workers (para notificaciones)

### Backend
- Node.js
- Express
- MongoDB

## Estructura del proyecto

```
Task-Manager/
├── backend/
│ ├── routes/
│ │ ├── date.js
│ │ ├── deadline.js
│ │ ├── delete.js
│ │ ├── notify.js
│ │ ├── tasks.js
│ │ ├── update.js
│ ├── server.js
│ ├── .env
├── frontend/
│ ├── public/
│ │ ├── manifest.json
│ │ ├── sw.js (service worker)
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ ├── styles/
│ │ └── index.css
│ ├── index.html
```


## Cómo correr el proyecto

### Backend

1. Navega al directorio backend
   ```bash
   cd backend
   ```
2. Instalar dependencias
   ```bash
    npm install
   ```
3. Crear un archivo .env con la cadena de conexión a tu MongoDB
4. Iniciar el servidor
   ```bash
   node server.js
   ```
   
### Frontend
1. Navega al directorio frontend
   ```bash
   cd frontend
   ```
2. Instalar dependencias
   ```bash
    npm install
   ```
3. Iniciar el servidor
   ```bash
   node server.js
   ```

## En desarrollo

- 🔔 Notificaciones push al escritorio o móvil
- 🔄 Soporte para tareas recurrentes
- 📱 Sincronización entre dispositivos
- 📴 Modo offline con Service Workers

## Capturas

*¡Próximamente!*

## Autor

**David Pazán**

*Siéntete libre de contribuir, proponer mejoras o reportar bugs. 🚀*
