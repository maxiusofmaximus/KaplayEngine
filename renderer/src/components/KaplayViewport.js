import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import kaplay from 'kaplay';
const KaplayViewport = ({ width = 800, height = 600, onGameReady, className = '' }) => {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);
    const [isGameReady, setIsGameReady] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!canvasRef.current)
            return;
        // Verificar soporte de WebGL antes de inicializar
        const canvas = canvasRef.current;
        // Verificación básica del canvas
        if (!canvas) {
            const errorMsg = 'Canvas no disponible';
            console.error(errorMsg);
            setError(errorMsg);
            return;
        }
        // Esperar un frame para asegurar que el canvas esté completamente montado
        const initializeKaplay = () => {
            try {
                // Configuración mínima para evitar errores de shader
                const game = kaplay({
                    canvas: canvas,
                    width: canvas.clientWidth || 800,
                    height: canvas.clientHeight || 600,
                    background: [20, 20, 40],
                    global: false,
                    logMax: 1
                });
                gameRef.current = game;
                setIsGameReady(true);
                // Notificar que el juego está listo
                if (onGameReady) {
                    onGameReady(game);
                }
                // Ejemplo básico: agregar un rectángulo
                game.add([
                    game.rect(100, 100),
                    game.color(100, 255, 100),
                    game.pos(width / 2 - 50, height / 2 - 50),
                    game.area(),
                    "test-rect"
                ]);
                // Texto de bienvenida
                game.add([
                    game.text("Kaplay Viewport Ready!", { size: 24 }),
                    game.color(255, 255, 255),
                    game.pos(width / 2, 50),
                    game.anchor("center")
                ]);
            }
            catch (err) {
                const errorMsg = `Error al inicializar Kaplay: ${err instanceof Error ? err.message : 'Error desconocido'}`;
                console.error(errorMsg, err);
                setError(errorMsg);
                setIsGameReady(false);
            }
        };
        // Usar requestAnimationFrame para asegurar que el DOM esté listo
        const timeoutId = setTimeout(() => {
            requestAnimationFrame(initializeKaplay);
        }, 100);
        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            if (gameRef.current) {
                try {
                    // Limpiar el contexto de Kaplay
                    gameRef.current.quit?.();
                }
                catch (error) {
                    console.warn('Error al limpiar Kaplay:', error);
                }
                gameRef.current = null;
            }
            // Cleanup básico del canvas
            if (canvas) {
                // Canvas cleanup si es necesario
            }
            setIsGameReady(false);
            setError(null);
        };
    }, [width, height, onGameReady]);
    // Función para obtener la instancia del juego
    const getGame = () => gameRef.current;
    // Función para limpiar la escena
    const clearScene = () => {
        if (gameRef.current) {
            gameRef.current.destroyAll();
        }
    };
    // Función para pausar/reanudar
    const togglePause = () => {
        if (gameRef.current) {
            // Kaplay no tiene pause built-in, pero podemos implementarlo
            // Por ahora, simplemente loggeamos
            console.log('Toggle pause - implementar lógica de pausa');
        }
    };
    // Función para reintentar la inicialización
    const retryInitialization = () => {
        setError(null);
        setIsGameReady(false);
        // Forzar re-render del useEffect
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // Trigger useEffect by changing a dependency
            canvas.style.display = 'none';
            setTimeout(() => {
                canvas.style.display = 'block';
            }, 10);
        }
    };
    return (_jsxs("div", { className: `kaplay-viewport ${className}`, style: { position: 'relative' }, children: [_jsx("canvas", { ref: canvasRef, width: width, height: height, style: {
                    border: '1px solid #333',
                    display: 'block',
                    backgroundColor: '#141428'
                } }), !isGameReady && (_jsx("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: error ? '#ff6b6b' : 'white',
                    fontSize: '16px',
                    textAlign: 'center',
                    padding: '20px'
                }, children: error ? (_jsxs("div", { children: [_jsx("div", { style: { marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }, children: "\u274C Error" }), _jsx("div", { style: { marginBottom: '15px' }, children: error }), _jsx("button", { onClick: retryInitialization, style: {
                                padding: '8px 16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                marginBottom: '10px'
                            }, children: "\uD83D\uDD04 Reintentar" }), _jsx("div", { style: { fontSize: '14px', opacity: 0.8 }, children: "Revisa la consola para m\u00E1s detalles" })] })) : ('Cargando Kaplay...') }))] }));
};
export default KaplayViewport;
