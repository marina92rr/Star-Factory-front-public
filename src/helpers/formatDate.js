/**
 * @description Formatea una fecha ISO a formato DD/MM/YYYY.
 * @param {string} isoDateString - Fecha en formato ISO (ej: '2025-01-15T10:30:00Z')
 * @returns {string} Fecha formateada como DD/MM/YYYY o cadena vacia si no hay fecha
 */
export const formatDate = (isoDateString) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  
  };