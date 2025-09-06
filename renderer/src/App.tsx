import React, { useState } from 'react';
import KaplayViewport from './components/KaplayViewport';

function App() {
  const [count, setCount] = useState(0);
  const [gameInstance, setGameInstance] = useState<any>(null);

  const handlePing = async () => {
    if (window.api?.ping) {
      const response = await window.api.ping();
      console.log('Ping response:', response);
    } else {
      console.log('API not available');
    }
  };

  const handleGameReady = (game: any) => {
    console.log('Kaplay game instance ready:', game);
    setGameInstance(game);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ margin: '0 0 20px 0' }}>Kaplay Engine Editor</h1>
      
      {/* Controles del Editor */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        <button onClick={handlePing} style={{ padding: '10px 20px' }}>
          Test IPC (Ping)
        </button>
        {gameInstance && (
          <button 
            onClick={() => gameInstance.destroyAll()}
            style={{ padding: '10px 20px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Clear Scene
          </button>
        )}
      </div>

      {/* Viewport de Kaplay */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <KaplayViewport
          width={800}
          height={600}
          onGameReady={handleGameReady}
          className="main-viewport"
        />
      </div>

      <p style={{ marginTop: '20px', color: '#666', textAlign: 'center' }}>
        Editor con React + Vite + HMR + Kaplay funcionando!
      </p>
    </div>
  );
}

export default App;