/**
 * @description Determina si un color hexadecimal es oscuro basandose en su luminancia.
 * Usa la formula de luminancia percibida (0.299*R + 0.587*G + 0.114*B).
 * Util para decidir si el texto sobre un fondo de ese color debe ser blanco o negro.
 *
 * @param {string} hexColor - Color en formato hexadecimal (con o sin #, 3 o 6 digitos)
 * @returns {boolean} true si el color es oscuro (luminancia < 0.5), false si es claro
 */
export function isColorDark(hexColor) {
  hexColor = hexColor.replace('#', '');
  if (hexColor.length === 3) hexColor = hexColor.split('').map(x => x + x).join('');
  const r = parseInt(hexColor.substr(0,2),16);
  const g = parseInt(hexColor.substr(2,2),16);
  const b = parseInt(hexColor.substr(4,2),16);
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance < 0.5;
}