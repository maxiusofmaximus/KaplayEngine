const express = require('express');
const path = require('path'); // Módulo para trabajar con rutas de archivos

const app = express();
const port = process.env.PORT || 3000; // Puedes cambiar el puerto

// Sirve los archivos estáticos desde la carpeta 'public'
// __dirname se refiere al directorio actual del archivo server.js
app.use(express.static(path.join(__dirname, 'public')));

// Define una ruta para la raíz (/) que servirá el index.html automáticamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});