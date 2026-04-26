/**
 * @description Convierte una fecha (string, Date o parseable) a formato ISO local (YYYY-MM-DD).
 * Ajusta la zona horaria local para evitar desfases por UTC.
 * Si recibe un string, extrae los primeros 10 caracteres directamente.
 * Si no recibe argumento, usa la fecha actual.
 *
 * @param {string|Date|number} [x] - Fecha a convertir. Si es string, se toman los primeros 10 chars.
 * @returns {string} Fecha en formato 'YYYY-MM-DD' ajustada a zona horaria local
 */
export const toLocalISO = (x) => {
  if (typeof x === 'string') return x.slice(0, 10);      // ya viene ISO-ish
  const d = x ? new Date(x) : new Date();                // Date o parseable
  const t = new Date(d.getTime() - d.getTimezoneOffset()*60000);
  return t.toISOString().slice(0, 10);                   // "YYYY-MM-DD"
};