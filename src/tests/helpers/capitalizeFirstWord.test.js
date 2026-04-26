import { capitalizeFirstWord } from '../../helpers/capitalizeFirstWord';

describe('capitalizeFirstWord', () => {
  test('debe poner la primera letra en mayuscula y el resto en minuscula', () => {
    expect(capitalizeFirstWord('hello')).toBe('Hello');
  });

  test('debe funcionar con texto todo en mayusculas', () => {
    expect(capitalizeFirstWord('HELLO')).toBe('Hello');
  });

  test('debe funcionar con texto mixto', () => {
    expect(capitalizeFirstWord('hElLo WoRlD')).toBe('Hello world');
  });

  test('debe devolver string vacio si recibe null', () => {
    expect(capitalizeFirstWord(null)).toBe('');
  });

  test('debe devolver string vacio si recibe undefined', () => {
    expect(capitalizeFirstWord(undefined)).toBe('');
  });

  test('debe devolver string vacio si recibe string vacio', () => {
    expect(capitalizeFirstWord('')).toBe('');
  });

  test('debe funcionar con un solo caracter', () => {
    expect(capitalizeFirstWord('a')).toBe('A');
  });
});
