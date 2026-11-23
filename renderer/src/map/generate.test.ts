import { describe, it, expect } from 'vitest';
import { generateMap, DEFAULT_PARAMS, type MapParams } from './generate';

const zeroDensity = { tree: 0, stone: 0, coal: 0, iron: 0, water: 0 };

describe('generateMap', () => {
  it('misma semilla y parámetros producen mapas idénticos', () => {
    const a = generateMap(DEFAULT_PARAMS);
    const b = generateMap({ ...DEFAULT_PARAMS });
    expect(a).toEqual(b);
  });

  it('semillas distintas producen mapas distintos', () => {
    const a = generateMap({ ...DEFAULT_PARAMS, seed: 1 });
    const b = generateMap({ ...DEFAULT_PARAMS, seed: 2 });
    expect(a).not.toEqual(b);
  });

  it('las dimensiones son correctas (matriz [y][x])', () => {
    const map = generateMap({ ...DEFAULT_PARAMS, width: 7, height: 3 });
    expect(map.length).toBe(3);
    for (const row of map) expect(row.length).toBe(7);
  });

  it('con todas las densidades a 0 todo es ground', () => {
    const map = generateMap({ ...DEFAULT_PARAMS, density: zeroDensity });
    expect(map.every((row) => row.every((c) => c === 'ground'))).toBe(true);
  });

  it('un mapa 50×50 se genera en menos de 1000 ms', () => {
    const t0 = performance.now();
    generateMap(DEFAULT_PARAMS);
    expect(performance.now() - t0).toBeLessThan(1000);
  });

  it('ancho 0 lanza error', () => {
    const bad: MapParams = { ...DEFAULT_PARAMS, width: 0 };
    expect(() => generateMap(bad)).toThrow(Error);
  });
});
