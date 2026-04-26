import { IVAProduct } from '../../helpers/IVAProduct';

describe('IVAProduct', () => {
  test('debe calcular base e IVA correctamente para 121 euros', () => {
    const result = IVAProduct(121);

    expect(result.total).toBe(121);
    expect(result.base).toBe(100);
    expect(result.iva).toBe(21);
  });

  test('debe calcular correctamente para un precio con decimales', () => {
    const result = IVAProduct(24.2);

    expect(result.total).toBe(24.2);
    expect(result.base).toBe(20);
    expect(result.iva).toBe(4.2);
  });

  test('debe devolver 0 para precio 0', () => {
    const result = IVAProduct(0);

    expect(result.total).toBe(0);
    expect(result.base).toBe(0);
    expect(result.iva).toBe(0);
  });

  test('base + iva debe sumar el total', () => {
    const result = IVAProduct(50);

    // Puede haber diferencia de centimos por redondeo
    const sum = +(result.base + result.iva).toFixed(2);
    expect(sum).toBe(result.total);
  });

  test('debe manejar precios grandes', () => {
    const result = IVAProduct(1210);

    expect(result.total).toBe(1210);
    expect(result.base).toBe(1000);
    expect(result.iva).toBe(210);
  });

  test('el IVA debe ser aproximadamente el 21% de la base', () => {
    const result = IVAProduct(100);
    // Puede haber diferencia de centimos por redondeo de punto flotante
    expect(Math.abs(result.iva - result.base * 0.21)).toBeLessThan(0.02);
  });
});
