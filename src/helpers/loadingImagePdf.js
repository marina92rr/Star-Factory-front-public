/**
 * @description Carga una imagen de forma asincrona para su uso en la generacion de PDFs con jsPDF.
 * Crea un elemento Image del DOM y espera a que la imagen se cargue completamente.
 *
 * @param {string} src - URL o ruta de la imagen a cargar
 * @returns {Promise<HTMLImageElement>} Promesa que resuelve con el elemento Image cargado
 */
export const loadingImagePdf = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
  });