export type CellType = 'ground' | 'tree' | 'stone' | 'coal' | 'iron' | 'water';

export interface MapParams {
  width: number;
  height: number;
  seed: number;
  density: { tree: number; stone: number; coal: number; iron: number; water: number }; // fracciones 0..1; el resto es suelo
}

export const DEFAULT_PARAMS: MapParams = {
  width: 50,
  height: 50,
  seed: 1,
  density: { tree: 0.2, stone: 0.12, coal: 0.08, iron: 0.03, water: 0.02 },
};

const MAX_SIZE = 200;
const RESOURCES = ['tree', 'stone', 'coal', 'iron', 'water'] as const;

// PRNG determinista (mulberry32): misma semilla -> misma secuencia.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function checkSize(name: string, v: number): void {
  if (!Number.isInteger(v) || v < 1 || v > MAX_SIZE) {
    throw new Error(`${name} debe ser un entero entre 1 y ${MAX_SIZE} (recibido: ${v})`);
  }
}

export function generateMap(p: MapParams): CellType[][] {
  checkSize('width', p.width);
  checkSize('height', p.height);

  // Clamp a 0..1 (NaN -> 0); si la suma supera 1, normaliza para que sume 1.
  const values = RESOURCES.map((k) => {
    const v = p.density[k];
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
  });
  const sum = values.reduce((a, b) => a + b, 0);
  const fractions = sum > 1 ? values.map((v) => v / sum) : values;

  const rand = mulberry32(p.seed);
  const map: CellType[][] = [];
  for (let y = 0; y < p.height; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < p.width; x++) {
      const r = rand();
      let acc = 0;
      let cell: CellType = 'ground';
      for (let i = 0; i < RESOURCES.length; i++) {
        acc += fractions[i];
        if (r < acc) {
          cell = RESOURCES[i];
          break;
        }
      }
      row.push(cell);
    }
    map.push(row);
  }
  return map;
}
