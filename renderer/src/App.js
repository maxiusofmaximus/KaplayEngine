import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import KaplayViewport from './components/KaplayViewport';
function App() {
    const [count, setCount] = useState(0);
    const [gameInstance, setGameInstance] = useState(null);
    const handlePing = async () => {
        if (window.api?.ping) {
            const response = await window.api.ping();
            console.log('Ping response:', response);
        }
        else {
            console.log('API not available');
        }
    };
    const handleGameReady = (game) => {
        console.log('Kaplay game instance ready:', game);
        setGameInstance(game);
    };
    return (_jsxs("div", { style: { padding: '20px', fontFamily: 'Arial, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsx("h1", { style: { margin: '0 0 20px 0' }, children: "Kaplay Engine Editor" }), _jsxs("div", { style: { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }, children: [_jsxs("button", { onClick: () => setCount(count + 1), children: ["Count: ", count] }), _jsx("button", { onClick: handlePing, style: { padding: '10px 20px' }, children: "Test IPC (Ping)" }), gameInstance && (_jsx("button", { onClick: () => gameInstance.destroyAll(), style: { padding: '10px 20px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px' }, children: "Clear Scene" }))] }), _jsx("div", { style: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }, children: _jsx(KaplayViewport, { width: 800, height: 600, onGameReady: handleGameReady, className: "main-viewport" }) }), _jsx("p", { style: { marginTop: '20px', color: '#666', textAlign: 'center' }, children: "Editor con React + Vite + HMR + Kaplay funcionando!" })] }));
}
export default App;
