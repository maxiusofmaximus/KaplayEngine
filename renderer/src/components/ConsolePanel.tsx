import React, { useEffect, useRef } from 'react';
import type { LogLevel } from './KaplayViewport';

export interface LogEntry {
  level: LogLevel;
  msg: string;
  time: number;
}

interface ConsolePanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  info: '#cfd8dc',
  warn: '#ffd54f',
  error: '#ff6b6b',
};

const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs, onClear }) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll al final cada vez que llega una línea nueva.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f0f17' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px', borderBottom: '1px solid #333', fontSize: 12, color: '#999' }}>
        <span>Consola</span>
        <button type="button" onClick={onClear} style={{ fontSize: 12, padding: '2px 8px' }}>
          Limpiar
        </button>
      </div>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '4px 10px', fontFamily: 'Consolas, monospace', fontSize: 12 }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: LEVEL_COLORS[l.level], whiteSpace: 'pre-wrap' }}>
            [{new Date(l.time).toLocaleTimeString()}] {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsolePanel;
