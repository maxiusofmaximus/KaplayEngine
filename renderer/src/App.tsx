import React, { useCallback, useEffect, useState } from 'react';
import KaplayViewport from './components/KaplayViewport';
import type { LogLevel } from './components/KaplayViewport';
import SettingsPanel from './components/SettingsPanel';
import ConsolePanel from './components/ConsolePanel';
import type { LogEntry } from './components/ConsolePanel';
import { generateMap, DEFAULT_PARAMS } from './map/generate';
import type { CellType, MapParams } from './map/generate';

// Valida la forma de la config guardada; el rango lo comprueba generateMap.
function isMapParams(v: unknown): v is MapParams {
  if (typeof v !== 'object' || v === null) return false;
  const { width, height, seed, density } = v as Record<string, unknown>;
  const isNum = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
  if (!isNum(width) || !isNum(height) || !isNum(seed)) return false;
  if (typeof density !== 'object' || density === null) return false;
  return Object.keys(DEFAULT_PARAMS.density).every((k) => isNum((density as Record<string, unknown>)[k]));
}

const errMsg = (err: unknown) => (err instanceof Error ? err.message : String(err));

function App() {
  const [params, setParams] = useState<MapParams>(DEFAULT_PARAMS);
  const [map, setMap] = useState<CellType[][]>(() => generateMap(DEFAULT_PARAMS));
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const log = useCallback((level: LogLevel, msg: string) => {
    setLogs((prev) => [...prev, { level, msg, time: Date.now() }]);
  }, []);

  // Al arrancar: usa la config guardada si es válida; si no, la por defecto (ya es el estado inicial).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      let saved: unknown = null;
      try {
        saved = (await window.api?.loadConfig?.()) ?? null;
      } catch {
        saved = null;
      }
      if (cancelled) return;

      let loaded: { params: MapParams; map: CellType[][] } | null = null;
      if (isMapParams(saved)) {
        try {
          loaded = { params: saved, map: generateMap(saved) };
        } catch (err) {
          log('warn', `Configuración guardada no válida: ${errMsg(err)}`);
        }
      } else if (saved !== null) {
        log('warn', 'Configuración guardada no válida');
      }

      if (loaded) {
        setParams(loaded.params);
        setMap(loaded.map);
        log('info', 'Configuración cargada');
      } else {
        log('info', 'Configuración por defecto');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [log]);

  const handleGenerate = () => {
    let next: CellType[][];
    const t0 = performance.now();
    try {
      next = generateMap(params);
    } catch (err) {
      log('error', `Error al generar el mapa: ${errMsg(err)}`);
      return;
    }
    const ms = Math.round(performance.now() - t0);
    setMap(next);
    log('info', `Mapa ${params.width}x${params.height} generado en ${ms} ms (semilla ${params.seed})`);

    window.api?.saveConfig?.(params)
      .then((ok) => {
        if (!ok) log('warn', 'No se pudo guardar la configuración');
      })
      .catch(() => log('warn', 'No se pudo guardar la configuración'));
  };

  // Kaplay solo lee el tamaño al montar: si cambian las dimensiones, se remonta el viewport.
  const viewportKey = `${map[0].length}x${map.length}`;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#161622', color: '#ddd', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
          <KaplayViewport key={viewportKey} map={map} onLog={log} />
        </div>
        <div style={{ padding: 12, borderLeft: '1px solid #333', overflowY: 'auto' }}>
          <SettingsPanel params={params} onChange={setParams} onGenerate={handleGenerate} />
        </div>
      </div>
      <div style={{ height: 180, borderTop: '1px solid #333' }}>
        <ConsolePanel logs={logs} onClear={() => setLogs([])} />
      </div>
    </div>
  );
}

export default App;
