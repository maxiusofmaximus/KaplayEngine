import React, { useEffect, useRef, useState } from 'react';
import kaplay from 'kaplay';
import type { CellType } from '../map/generate';

const COLORS: Record<CellType, string> = {
  ground: '#9be7a5',
  tree: '#2e7d32',
  stone: '#7f8c8d',
  coal: '#3b3b3b',
  iron: '#b0b0b0',
  water: '#3498db',
};

type LogLevel = 'info' | 'warn' | 'error';

interface KaplayViewportProps {
  map: CellType[][];
  tileSize?: number;
  onLog?: (level: LogLevel, msg: string) => void;
}

const KaplayViewport: React.FC<KaplayViewportProps> = ({ map, tileSize = 12, onLog }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef(map);
  const onLogRef = useRef(onLog);
  const [error, setError] = useState<string | null>(null);

  mapRef.current = map;
  onLogRef.current = onLog;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // El canvas es nuevo en cada montaje: así StrictMode (monta/desmonta/monta) no reutiliza un canvas ya usado por Kaplay.
    // shortcut: tamaño y tileSize se leen solo al montar; cambiarlos exige remontar, upgrade si hace falta redimensionar en caliente.
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    container.appendChild(canvas);
    setError(null);

    const m = mapRef.current;
    let game: ReturnType<typeof kaplay> | null = null;

    try {
      game = kaplay({
        canvas,
        width: m[0].length * tileSize,
        height: m.length * tileSize,
        background: [20, 20, 40],
        global: false,
        logMax: 1,
      });

      const k = game;
      const colors = new Map(
        (Object.keys(COLORS) as CellType[]).map((t) => [t, k.Color.fromHex(COLORS[t])] as const)
      );

      k.onDraw(() => {
        const grid = mapRef.current;
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            k.drawRect({
              pos: k.vec2(x * tileSize, y * tileSize),
              width: tileSize,
              height: tileSize,
              color: colors.get(grid[y][x]),
            });
          }
        }
      });

      onLogRef.current?.('info', 'Kaplay inicializado');
    } catch (err) {
      const msg = `Error al inicializar Kaplay: ${err instanceof Error ? err.message : 'Error desconocido'}`;
      setError(msg);
      onLogRef.current?.('error', msg);
    }

    return () => {
      try {
        game?.quit();
      } catch (err) {
        onLogRef.current?.('warn', `Error al cerrar Kaplay: ${err instanceof Error ? err.message : String(err)}`);
      }
      canvas.remove();
    };
  }, []);

  // El div del efecto no tiene hijos de React, así el canvas añadido a mano no choca con el reconciliador.
  return (
    <div>
      <div ref={containerRef} />
      {error && <div style={{ color: '#ff6b6b', padding: '12px' }}>{error}</div>}
    </div>
  );
};

export default KaplayViewport;
export type { KaplayViewportProps, LogLevel };
