# KaplayEngine — Fall of Diablo

Plantilla de juego con Kaplay servida con Express. Este proyecto arranca un servidor simple que expone los archivos estáticos desde la carpeta `public`, donde se carga la librería de Kaplay vía CDN y los scripts del juego (`background.js` y `generation_map.js`).

- Repositorio: https://github.com/maxiusofmaximus/KaplayEngine

## Características
- Servidor Express minimalista para contenido estático
- Carga de Kaplay por CDN (unpkg)
- Scripts de juego en `public/` listos para iterar rápidamente
- Scripts de desarrollo con recarga automática usando `nodemon`

## Requisitos
- Node.js 18+ (recomendado)
- npm (incluido con Node.js)

## Instalación y ejecución local

1) Clonar el repositorio:
```bash
git clone https://github.com/maxiusofmaximus/KaplayEngine.git
```

2) Entrar al directorio del proyecto:
```bash
cd KaplayEngine
```

3) Instalar dependencias:
```bash
npm install
```

4) Modo desarrollo (con recarga automática vía nodemon):
```bash
npm run dev
```

5) Modo producción (ejecución simple con Node):
```bash
npm start
```

Luego abre en tu navegador:
```
http://localhost:3000
```

## Variables de entorno

El servidor ya soporta `process.env.PORT` y usa `3000` por defecto. Puedes crear un archivo `.env` (basado en `.env.example`) con:
```
PORT=3000
```

## Estructura del proyecto

```
KaplayEngine/
├─ public/
│  ├─ background.js
│  ├─ generation_map.js
│  ├─ game.ico
│  └─ index.html
├─ server.js
├─ package.json
├─ package-lock.json
├─ LICENSE.md
└─ tasks.md
```

- `public/index.html`: HTML principal que carga Kaplay desde CDN y tus scripts de juego.
- `public/background.js` y `public/generation_map.js`: lógicas del juego y utilidades.
- `server.js`: servidor Express que sirve la carpeta `public` y lee el puerto desde `process.env.PORT` o `3000`.
- `tasks.md`: lista de tareas/pendientes del proyecto (roadmap).
- `LICENSE.md`: licencia del proyecto.

## Scripts disponibles

- Desarrollo (con nodemon):
```bash
npm run dev
```

- Producción:
```bash
npm start
```

## Configuración

- Puerto del servidor en `server.js`:
```js
const port = process.env.PORT || 3000;
```
- Kaplay por CDN en `public/index.html`:
```html
<script src="https://unpkg.com/kaplay@3001.0.12/dist/kaplay.js"></script>
```
Si quieres fijar/actualizar la versión, cambia aquí el número de versión. También podrías servir Kaplay localmente si prefieres no depender de CDN.

## Desarrollo del juego

- Agrega/modifica escenas, sprites y mecánicas dentro de `public/background.js` y `public/generation_map.js`.
- Referencia recursos (imágenes, audio) dejándolos en `public/` y cargándolos desde tus scripts.

## Despliegue

Este proyecto es un servidor Node/Express, por lo que puedes desplegarlo en cualquier PaaS que soporte Node.js (por ejemplo Render, Railway, Fly.io, etc.). Asegúrate de:
- Instalar dependencias en el build
- Ejecutar `npm start` como comando de inicio
- Exponer el puerto configurado (la mayoría de plataformas proveen `PORT`)

## Contribuir

1) Haz un fork del repositorio  
2) Crea una rama feature/fix:
```bash
git checkout -b feature/mi-mejora
```
3) Haz commits claros y concisos:
```bash
git commit -m "feat: agrega X"
```
4) Sube tu rama:
```bash
git push origin feature/mi-mejora
```
5) Abre un Pull Request describiendo tus cambios

Antes de abrir un PR, revisa `tasks.md` para alinear tu contribución con el roadmap.

## Licencia

Este proyecto está licenciado bajo la licencia ISC. Revisa el archivo `LICENSE.md` para más detalles.

## Créditos

- Kaplay como motor base (cargado vía CDN).
- Express para el servidor HTTP.
- nodemon para recarga en desarrollo.