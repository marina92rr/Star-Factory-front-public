/**
 * @description Calcula el desglose de IVA (21%) a partir de un precio con IVA incluido.
 * @param {number} precioConIVA - Precio total con IVA incluido
 * @returns {{base: number, iva: number, total: number}} Objeto con base imponible, importe de IVA y total
 */
export const IVAProduct = (precioConIVA) => {
    const tipoIVA = 0.21;
    const base = +(precioConIVA / (1 + tipoIVA)).toFixed(2);
    const iva = +(precioConIVA - base).toFixed(2);
  
    return {
      base,
      iva,
      total: precioConIVA
    };
  };