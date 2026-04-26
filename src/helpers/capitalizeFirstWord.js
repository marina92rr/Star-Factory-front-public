/**
 * @description Capitaliza la primera letra de un texto y convierte el resto a minusculas.
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto con la primera letra en mayuscula y el resto en minuscula
 */
export const capitalizeFirstWord = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };