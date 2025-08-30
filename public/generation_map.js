// Generar y renderizar un mapa aleatorio al estilo del código C#
const TILE_SIZE = 12; // tamaño de cada celda en píxeles
const width = 50;
const height = 50;

// Opcional: distribución de tipos de celda
function pickCell() {
    const r = Math.random();
    if (r < 0.55) return '.';   // 55% suelo vacío
    if (r < 0.75) return 'A';   // 20% árboles
    if (r < 0.87) return 'P';   // 12% piedra
    if (r < 0.95) return 'C';   // 8% carbón
    if (r < 0.98) return 'He';  // 3% hierro (token de 2 caracteres)
    return 'H';                 // 2% agua
}

function generateMap(width, height) {
    const map = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            // Antes: '.' o 'A'
            // row.push(Math.random() < 0.5 ? '.' : 'A');
            // Ahora: variedad de tipos
            row.push(pickCell());
        }
        map.push(row);
    }
    return map;
}

function printMap(map) {
    const lines = map.map(row => row.join(''));
    for (const line of lines) {
        console.log(line);
    }
}

function renderMap(map, tileSize) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            const cell = map[y][x];

            // 1) Suelo base para TODAS las celdas (eliminas los “huecos morados”)
            add([
                rect(tileSize, tileSize),
                pos(x * tileSize, y * tileSize),
                color("#9be7a5"), // verde claro de suelo/cesped
                "ground",
            ]);

            // 2) Capa superior según el tipo de celda
            switch (cell) {
                case 'A': // Árbol
                    add([
                        rect(tileSize, tileSize),
                        pos(x * tileSize, y * tileSize),
                        color("#2e7d32"), // verde más oscuro
                        area(),
                        "tree",
                    ]);
                    break;
                case '#': // Pared (compatibilidad)
                    add([
                        rect(tileSize, tileSize),
                        pos(x * tileSize, y * tileSize),
                        color("#3f3f3f"),
                        area(),
                        "wall",
                    ]);
                    break;
                case 'P': // Piedra
                    add([
                        rect(tileSize, tileSize),
                        pos(x * tileSize, y * tileSize),
                        color("#7f8c8d"),
                        area(),
                        "stone",
                    ]);
                    break;
                case 'C': // Carbón
                    add([
                        rect(tileSize, tileSize),
                        pos(x * tileSize, y * tileSize),
                        color("#3b3b3b"),
                        area(),
                        "coal",
                    ]);
                    break;
                case 'He': // Hierro (token de 2 caracteres)
                    add([
                        rect(tileSize, tileSize),
                        pos(x * tileSize, y * tileSize),
                        color("#b0b0b0"),
                        area(),
                        "iron",
                    ]);
                    break;
                case 'H': // Agua
                    add([
                        rect(tileSize, tileSize),
                        pos(x * tileSize, y * tileSize),
                        color("#3498db"),
                        area(),
                        "water",
                    ]);
                    break;
                // '.' ya queda como suelo base
            }
        }
    }
}

const map = generateMap(width, height);
printMap(map);
renderMap(map, TILE_SIZE);