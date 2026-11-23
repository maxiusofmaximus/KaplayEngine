import React, { useMemo } from 'react';
import KaplayViewport from './components/KaplayViewport';
import { generateMap, DEFAULT_PARAMS } from './map/generate';

function App() {
  const map = useMemo(() => generateMap(DEFAULT_PARAMS), []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ margin: '0 0 20px 0' }}>Kaplay Engine Editor</h1>

      {/* Viewport de Kaplay */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <KaplayViewport map={map} />
      </div>

      <p style={{ marginTop: '20px', color: '#666', textAlign: 'center' }}>
        Editor con React + Vite + HMR + Kaplay funcionando!
      </p>
    </div>
  );
}

export default App;
