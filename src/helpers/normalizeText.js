/**
 * @description Normaliza un texto: elimina tildes (marcas diacriticas) y convierte a mayusculas.
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto sin tildes y en mayusculas
 */
export const normalizeText = (text) =>
  text?.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase() || '';

/**
 * @description Normaliza todos los campos de tipo string de un objeto aplicando normalizeText.
 * Los campos que no son string se mantienen sin cambios.
 * @param {Object} obj - Objeto cuyos campos string se normalizaran
 * @returns {Object} Nuevo objeto con todos los campos string normalizados
 */
export const normalizeAllTextFields = (obj) => {
  const normalized = { ...obj };

  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalizeText(normalized[key]);
    }
  });

  return normalized;
};
