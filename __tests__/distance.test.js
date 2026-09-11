import { getDistanceKm } from '../utils/distance';

describe('getDistanceKm', () => {
  test('kthen 0 per te njejtin lokacion', () => {
    const point = { latitude: 42.6629, longitude: 21.1655 };
    const result = getDistanceKm(point, point);
    expect(result).toBeCloseTo(0, 1);
  });

  test('llogarit distancen mes dy pikave te ndryshme', () => {
    const pristina = { latitude: 42.6629, longitude: 21.1655 };
    const peja = { latitude: 42.6593, longitude: 20.2883 };
    const result = getDistanceKm(pristina, peja);

    // Distanca reale Prishtine-Peje eshte rreth 70-75 km
    expect(result).toBeGreaterThan(60);
    expect(result).toBeLessThan(90);
  });

  test('kthen null nese mungon njeri koordinat', () => {
    const point = { latitude: 42.6629, longitude: 21.1655 };
    expect(getDistanceKm(null, point)).toBeNull();
    expect(getDistanceKm(point, null)).toBeNull();
  });
});
