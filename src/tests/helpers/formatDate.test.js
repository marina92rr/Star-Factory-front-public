import { formatDate } from '../../helpers/formatDate';

describe('formatDate', () => {
  test('debe formatear una fecha ISO a DD/MM/YYYY', () => {
    // Usar una fecha que no cambie con timezone
    const result = formatDate('2024-01-15T12:00:00.000Z');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(result).toContain('2024');
  });

  test('debe devolver string vacio si recibe null', () => {
    expect(formatDate(null)).toBe('');
  });

  test('debe devolver string vacio si recibe undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  test('debe devolver string vacio si recibe string vacio', () => {
    expect(formatDate('')).toBe('');
  });

  test('debe formatear correctamente el mes con zero padding', () => {
    const result = formatDate('2024-03-05T12:00:00.000Z');
    // Debe contener /03/ o /3/ dependiendo del timezone, pero siempre 2 digitos por el padStart
    expect(result).toMatch(/\/0[3-5]?\//);
  });

  test('debe formatear correctamente el dia con zero padding', () => {
    const result = formatDate('2024-06-01T12:00:00.000Z');
    expect(result).toMatch(/^0[1-2]\//);
  });
});
