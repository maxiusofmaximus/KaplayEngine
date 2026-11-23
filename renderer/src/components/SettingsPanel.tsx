import React from 'react';
import type { MapParams } from '../map/generate';

type DensityKey = keyof MapParams['density'];

const DENSITY_LABELS: Record<DensityKey, string> = {
  tree: 'Árboles',
  stone: 'Piedra',
  coal: 'Carbón',
  iron: 'Hierro',
  water: 'Agua',
};

interface SettingsPanelProps {
  params: MapParams;
  onChange: (params: MapParams) => void;
  onGenerate: () => void;
}

// Un input vacío da NaN: se trata como 0 para no dejar el input en NaN.
const num = (n: number) => (Number.isNaN(n) ? 0 : n);

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#0f0f17',
  color: '#ddd',
  border: '1px solid #444',
  borderRadius: 4,
  padding: '4px 6px',
};

interface NumberFieldProps {
  label: string;
  value: number;
  step: number;
  min?: number;
  max?: number;
  onValue: (v: number) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ label, value, step, min, max, onValue }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#aaa' }}>
    {label}
    <input
      type="number"
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={(e) => onValue(num(e.target.valueAsNumber))}
      style={inputStyle}
    />
  </label>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ params, onChange, onGenerate }) => {
  const { density } = params;

  return (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 14, color: '#ddd' }}>Configuración</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberField label="Ancho" value={params.width} step={1} min={1} max={200}
          onValue={(v) => onChange({ ...params, width: v })} />
        <NumberField label="Alto" value={params.height} step={1} min={1} max={200}
          onValue={(v) => onChange({ ...params, height: v })} />
        <NumberField label="Semilla" value={params.seed} step={1}
          onValue={(v) => onChange({ ...params, seed: v })} />
      </div>

      <div style={{ fontSize: 12, color: '#999' }}>Densidades (0 a 1)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {(Object.keys(DENSITY_LABELS) as DensityKey[]).map((k) => (
          <NumberField
            key={k}
            label={DENSITY_LABELS[k]}
            value={density[k]}
            step={0.01}
            min={0}
            max={1}
            onValue={(v) => onChange({ ...params, density: { ...density, [k]: v } })}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        style={{ padding: '6px 12px', background: '#3f51b5', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        Generar
      </button>
    </div>
  );
};

export default SettingsPanel;
