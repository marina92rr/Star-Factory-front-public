/**
 * @description Generador de tickets de venta en formato PDF usando pdfMake.
 * Crea un ticket con formato de recibo (80mm de ancho aprox.) que incluye
 * datos de la empresa, fecha, cliente, productos, descuentos, subtotal, IVA y total.
 * Abre directamente el dialogo de impresion del navegador.
 *
 * @param {Object} venta - Datos de la venta
 * @param {number} venta.total - Total de la venta (IVA incluido)
 * @param {string} venta.fecha - Fecha de la venta en formato ISO
 * @param {string} venta.cliente - Nombre del cliente
 * @param {Array} venta.items - Productos vendidos [{name, price, discount}]
 * @returns {Promise<void>}
 */
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.vfs;

export const generateAndSendTicket = async (venta) => {
  const subtotal = venta.total / 1.21;
  const iva = venta.total - subtotal;

  const docDefinition = {
    pageSize: { width: 226.77, height: 'auto' },
    pageMargins: [10, 10, 10, 10],
    content: [
      { text: 'STAR FACTORY SEVILLA', alignment: 'center', style: 'header' },
      { text: `Fecha: ${new Date(venta.fecha).toLocaleString()}`, style: 'small' },
      { text: `Cliente: ${venta.cliente}`, style: 'small' },
      { text: '-----------------------------', alignment: 'center' },
      ...venta.items.map(item => ({
        columns: [
          { text: `${item.name}`, width: '70%' },
          { text: `${(item.price).toFixed(2)} €`, width: '30%', alignment: 'right' },
        ]
      })),

      { text: '-----------------------------', alignment: 'center' },

     ...venta.items.map(item => ({
        columns: [
          { text: 'Descuento:' },
          { text: `${(item.discount).toFixed(2)} €`, width: '30%', alignment: 'right' },
        ]
      })),

      {
        columns: [
          { text: 'Subtotal:' },
          { text: `${subtotal.toFixed(2)} €`, alignment: 'right' }
        ]
      },
      {
        columns: [
          { text: 'IVA 21%:' },
          { text: `${iva.toFixed(2)} €`, alignment: 'right' }
        ]
      },
      {
        columns: [
          { text: 'TOTAL:', bold: true },
          { text: `${venta.total.toFixed(2)} €`, bold: true, alignment: 'right' }
        ]
      },
      { text: '\n¡Gracias por su compra!', alignment: 'center', style: 'footer' }
    ],
    styles: {
      header: { fontSize: 12, bold: true },
      small: { fontSize: 8 },
      footer: { fontSize: 9, italics: true }
    },
    defaultStyle: {
      fontSize: 9
    }
  };

  // ✅ Imprimir directamente
  pdfMake.createPdf(docDefinition).print();
  
};