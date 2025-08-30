# Roadmap del Editor (Electron + React) con runtime Kaplay
Objetivo: Construir una aplicación de escritorio tipo “mini Unity 2D” basada en Electron (shell), React (UI de editor) y Kaplay (runtime gráfico 2D), con un panel de configuración (arriba a la derecha) para la generación de mapas y un flujo sólido de proyecto/escenas/recursos.

## MVP (alcance mínimo)
- App de escritorio que:
  - Abre una ventana con layout de editor: 
    - Viewport (centro) renderizado por Kaplay
    - Panel de Configuración (arriba-derecha) con parámetros de generación (ancho, alto, seed, densidades, capas)
    - Panel de Consola (abajo) para logs y errores
  - Botón “Generar” que aplica los cambios al mapa en vivo
  - Persistencia básica de parámetros en disco (config.json del proyecto)
- “Play Mode” con toggle: Editor (pausa) / Runtime (simulación Kaplay)
- Exportar un “build” HTML5 simple del mapa generado

Definition of Done (MVP):
- App empaquetable en Windows (instalador o carpeta portable)
- Cambiar parámetros en el panel y ver el mapa regenerado en < 1s para 50x50
- Estado guardado/reabierto correctamente

---

## Fase 0 — Arquitectura base y tooling
Entregables:
- Decisión TS (recomendado TypeScript)
- Estructura Electron:
  - Proceso principal (main) y preload con IPC seguro
  - Renderer con React
- Integración Kaplay en un componente React (montaje/desmontaje seguro del canvas)
- Tooling:
  - Linter/Formatter (ESLint + Prettier)
  - Tests unitarios (Vitest/Jest)
  - Scripts npm para dev, build (renderer) y package (Electron Builder)

Tareas:
- [ ] Decidir TypeScript e inicializar tsconfig
- [ ] Crear main (Electron) con contextIsolation habilitado
- [ ] Crear preload con canal IPC estrictamente limitado (whitelist)
- [ ] Crear renderer React (Vite/CRA) y App base
- [ ] Componente <KaplayViewport/> que inicializa/detiene Kaplay correctamente
- [ ] ESLint/Prettier configurados
- [ ] Scripts: `dev`, `build`, `package` (Windows)

DoD:
- `npm run dev` abre la app con editor vacío
- Prueba de canal IPC: ping/pong

---

## Fase 1 — Layout del Editor
Entregables:
- Layout al estilo Unity:
  - Topbar (menú de proyecto/escena/exportar)
  - Panel derecho superior: Configuración de Generación (Settings)
  - Viewport central (Kaplay)
  - Consola inferior (logs)
  - (Opcional) Panel izquierdo: Jerarquía / Archivos
- Theming y estilos básicos

Tareas:
- [ ] Topbar con acciones stub (Nuevo Proyecto, Abrir, Guardar, Exportar)
- [ ] Panel de Configuración (arriba-derecha) con formulario reactivo
- [ ] Consola con niveles (info/warn/error)
- [ ] Estado global (Zustand/Redux) para parámetros y UI
- [ ] Persistencia de UI mínima (último layout)

DoD:
- Cambiar valores en el panel y verlos en estado global

---

## Fase 2 — Motor runtime (Kaplay)
Entregables:
- Módulo de runtime sobre Kaplay:
  - Entidades y componentes mínimos (ECS-lite u objetos con tags)
  - Capa de Render, Input, Colisiones sencillas (area/body), Cámara y Zoom
  - AssetManager simple (carga de sprites/atlases)
  - TileMap renderer (rects primero; luego sprites si procede)
  - Sistema de “Play/Pause” con clear y reinicio determinista

Tareas:
- [ ] Servicio RuntimeController (start/stop/reload)
- [ ] Tile renderer (rects) y capas
- [ ] Cámara: pan/zoom (mouse/teclas)
- [ ] Input mapeado (teclas WASD, flechas)
- [ ] Asset loader (caché + preload)

DoD:
- El viewport renderiza una grilla/mundo básico controlable por cámara

---

## Fase 3 — Generación Procedural de Mapas
Entregables:
- Servicio de generación:
  - Parámetros: width, height, seed
  - Distribuciones para tipos: '.' Tierra, 'A' árbol, 'P' piedra, 'C' carbón, 'He' hierro, 'H' agua
  - Reglas para lagunas (unir H cercanos)
  - Serialización a JSON (escena y mapa)
- Integración con panel de Configuración (aplicar en vivo)

Tareas:
- [ ] RNG determinista por seed
- [ ] pickCell por probabilidades configurables
- [ ] Post-proceso: clusterización de agua
- [ ] Serializar resultado (mapa + metadatos) y deserializar
- [ ] Aplicar cambios en vivo (debounce)

DoD:
- La misma seed produce el mismo mapa
- Cambiar sliders/inputs y regenerar al instante

---

## Fase 4 — Editor de Contenido
Entregables:
- Herramientas del editor:
  - Grid y snapping
  - Inspector de selección (tile/entidad)
  - Brocha y balde para pintar tilemap (modo manual)
  - Layers de tilemap (suelo, recursos, colisiones)
  - Undo/Redo

Tareas:
- [ ] Gizmos (highlight al hover/selección)
- [ ] Herramienta Brush y Fill
- [ ] Capas y visibilidad
- [ ] Histórico Undo/Redo

DoD:
- Pintar tiles y deshacer/rehacer

---

## Fase 5 — Persistencia de Proyecto y Escenas
Entregables:
- Estructura de proyecto:
  - project.json (metadatos, paths)
  - scenes/*.json (mapas/escenas)
  - assets/
- Operaciones: Nuevo, Abrir, Guardar, Guardar como…

Tareas:
- [ ] Modelos y validación de esquema
- [ ] Diálogo abrir/guardar (IPC)
- [ ] Autosave

DoD:
- Abrir un proyecto y restaurar escena y parámetros

---

## Fase 6 — API de Scripting
Entregables:
- API de scripting (JS/TS) en sandbox con hot-reload
- Documentación (TSDoc/typedoc)

Tareas:
- [ ] API de hook al runtime (update, onInit, etc.)
- [ ] Carga y aislamiento de scripts (VM/sandbox)
- [ ] Ejemplos de scripts

DoD:
- Scripts de usuario pueden añadir lógica al mapa en play mode

---

## Fase 7 — Exportación y Build
Entregables:
- Exportar:
  - HTML5 standalone (runtime Kaplay) del mapa/escena
  - Paquete desktop (Electron) opcional
- Plantillas de exportación y empaquetado

Tareas:
- [ ] Exportar HTML5 con assets y escena
- [ ] electron-builder: targets Windows
- [ ] (Opcional) Auto-update

DoD:
- Un usuario puede exportar un zip HTML5 y abrirlo en navegador

---

## Fase 8 — Herramientas de Depuración y Rendimiento
Entregables:
- Overlay de debug (FPS, draw calls, entidades)
- Logger centralizado
- Perfilado simple de generación (tiempos por etapa)

Tareas:
- [ ] HUD de métricas
- [ ] Marcadores de performance en generación
- [ ] Trazas en consola con niveles

DoD:
- Ver FPS y tiempos de generación al activar “Debug”

---

## Fase 9 — Seguridad e IPC
Entregables:
- Context Isolation (true)
- Preload con “puente” minimal y seguro
- CSP básica

Tareas:
- [ ] Canal IPC con allowlist de invocaciones
- [ ] Validación de entrada/salida
- [ ] CSP y manejo de recursos locales

DoD:
- No se puede acceder a Node desde renderer directamente

---

## Fase 10 — QA y Pruebas
Entregables:
- Suite de tests:
  - Unitarios (generación, utilidades)
  - Integración (renderer + estado)
  - E2E básicos (flujos editoriales)

Tareas:
- [ ] Config test runner
- [ ] Mocks de Kaplay donde aplique
- [ ] Pruebas de serialización consistente

DoD:
- Pipeline de tests en CI local (script npm) pasando

---

## Fase 11 — Roadmap Futuro
- Pathfinding (A*)
- Editor de animaciones
- Sistema de prefabs/plantillas
- Plugins/extensiones del editor
- Reemplazar rects por sprites/atlas
- Herramientas de iluminación 2D
- Soporte multi-ventana (dockable panels)

---

## Estructura de directorios (propuesta)
- electron/
  - main.(ts)
  - preload.(ts)
- renderer/
  - index.html
  - src/
    - main.(tsxx)
    - App.(tsxx)
    - components/
      - KaplayViewport.(tsxx)
      - SettingsPanel.(tsxx)  // Panel arriba-derecha
      - ConsolePanel.(tsxx)
    - modules/
      - runtime/
        - RuntimeController.(ts)
        - tilemap/
      - generation/
        - mapGenerator.(ts)   // seed, probabilidades, post-procesos
      - state/
        - store.(ts)
      - ipc/
        - bridge.(ts)
- assets/
- projects/

---

## Estrategia de migración desde el prototipo actual
1) Extraer tu lógica de generation_map.js a modules/generation/mapGenerator.(ts)  
2) Convertir el render actual a un KaplayViewport controlado por React (montar/desmontar sin fugas)  
3) Crear SettingsPanel que edita el estado global y dispara regeneración con debouncing  
4) Añadir persistencia de parámetros (config.json en projects/)  
5) Mover a empaquetado Electron y mantener build HTML5 para exportar

---

## Riesgos y mitigaciones
- Fugas de recursos si Kaplay se reinicia mal → encapsular start/stop y tests
- IPC inseguro → contextIsolation + allowlist + validación
- Rendimiento de generación → usar seed con PRNG rápido y evitar GC en loops
- Desalineación UI/Viewport → sistema de layout responsivo, eventos de resize

---

## Hitos (milestones)
- M1: Arquitectura y ventana con layout (2 semanas)
- M2: Viewport con Kaplay y panel de settings funcional (1-2 semanas)
- M3: Generación con seed y exportación HTML5 (2 semanas)
- M4: Editor de contenido (brush/fill, undo/redo) (3-4 semanas)
- M5: Empaquetado estable + tests básicos (1-2 semanas)