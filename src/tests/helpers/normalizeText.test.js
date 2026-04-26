import { normalizeText, normalizeAllTextFields } from '../../helpers/normalizeText';

describe('normalizeText', () => {
  test('debe quitar tildes y poner en mayusculas', () => {
    expect(normalizeText('María')).toBe('MARIA');
  });

  test('debe quitar todas las tildes comunes en espanol', () => {
    // La ñ se descompone en n + tilde combinante, que se elimina -> N (no NE)
    expect(normalizeText('áéíóúñ')).toBe('AEIOUN');
  });

  test('debe poner en mayusculas sin tildes', () => {
    expect(normalizeText('hello world')).toBe('HELLO WORLD');
  });

  test('debe devolver string vacio si recibe null', () => {
    expect(normalizeText(null)).toBe('');
  });

  test('debe devolver string vacio si recibe undefined', () => {
    expect(normalizeText(undefined)).toBe('');
  });

  test('debe funcionar con texto ya en mayusculas', () => {
    expect(normalizeText('MARIA')).toBe('MARIA');
  });

  test('debe manejar dieresis', () => {
    expect(normalizeText('güe')).toBe('GUE');
  });
});

describe('normalizeAllTextFields', () => {
  test('debe normalizar todos los campos string de un objeto', () => {
    const input = {
      name: 'María',
      lastName: 'García',
      age: 25,
      active: true,
    };

    const result = normalizeAllTextFields(input);

    expect(result.name).toBe('MARIA');
    expect(result.lastName).toBe('GARCIA');
    expect(result.age).toBe(25);
    expect(result.active).toBe(true);
  });

  test('no debe mutar el objeto original', () => {
    const input = { name: 'María' };
    const result = normalizeAllTextFields(input);

    expect(input.name).toBe('María');
    expect(result.name).toBe('MARIA');
  });

  test('debe manejar objeto vacio', () => {
    const result = normalizeAllTextFields({});
    expect(result).toEqual({});
  });
});
