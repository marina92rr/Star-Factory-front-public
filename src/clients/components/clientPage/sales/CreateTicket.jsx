/**
 * @description Componente para crear, imprimir y enviar tickets de venta.
 * Genera un ticket PDF con los datos de la venta, permite imprimirlo
 * directamente o enviarlo por email/WhatsApp usando la API de Gmail.
 *
 * @param {Object} props
 * @param {Object} props.venta - Datos de la venta para el ticket
 * @returns {JSX.Element} Botones de impresion y envio de ticket
 */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;

import { useClientsStore } from '../../../../hooks/useClientsStore';
import { getGmailAccessToken, sendPdfWithToken } from '../../../../helpers/gmailSendPdf';
import { getTicketBlob, printTicket } from '../../../../helpers/TicketPDF';
import { capitalizeFirstWord } from '../../../../helpers/capitalizeFirstWord';
import points from '../../../../assets/3point.png';
import Swal from 'sweetalert2';




export const CreateTicket = ({ venta }) => {
  const { activeClient } = useClientsStore();

  const handleSendEmail = async () => {
    try {
      const token = await getGmailAccessToken();
      const blob = await getTicketBlob(venta);
      await sendPdfWithToken(token, blob, activeClient.email);
      Swal.fire('Enviado', 'Email enviado correctamente', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo enviar el email', 'error');
    }
  };

  const handleSendEmail2 = async () => {
    try {
      const token = await getGmailAccessToken();
      const blob = await getTicketBlob(venta);
      await sendPdfWithToken(token, blob, activeClient.email2);
      Swal.fire('Enviado', 'Email enviado correctamente', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo enviar el email', 'error');
    }
  };

  const handlePrint = () => {
    printTicket(venta);
  };

  const handleWhatsapp = async () => {
    // 1) Generar el PDF
    const blob = await getTicketBlob(venta);



    // 3) Abrir WhatsApp con el ticket formateado
    const to2 = (n) => Number(n).toFixed(2);
    const fecha = new Date(venta.fecha).toLocaleString();
    const discount = venta.items.reduce((s, i) => s + Number(i.discount || 0), 0);

    const subtotal = venta.total / 1.21;
    const iva = venta.total - subtotal;

    const ticketMsg = [
      '```',
      `Hola ${capitalizeFirstWord(activeClient.name)}, te envío tu ticket`,
      '',
      'Star Factory Sevilla',
      'STAR FACTORY SEVILLA',
      '53273142J',
      'Calle Gordales nave, 3-5, 41930 Bormujos, Sevilla',
      '955116515 starfactorysevilla@hotmail.com',
      'http://www.starfactorysevilla.com',
      `${fecha}`,
      '--------------------------------',
      `${activeClient.name} ${activeClient.lastName}`,
      '--------------------------------',
      'Concepto',
      ...venta.items.map(i => {
        const name = String(i.name).slice(0, 18).padEnd(18, ' ');
        const price = `${to2(i.price)} €`.padStart(10, ' ');
        return `${name}${price}`;
      }),
      '--------------------------------',
      `Descuento: -${to2(discount)} €`,
      `Subtotal: ${to2(subtotal)} €`,
      `IVA 21%:  ${to2(iva)} €`,
      `TOTAL:    ${to2(venta.total)} €`,
      '',
      '¡Gracias por su compra!',
      '```'
    ].join('\n');

    const phone = activeClient.whatsappPhone; //tel cliente
    // 3) Abrir WhatsApp con web
    //window.open(`https://wa.me/${phone}?text=${encodeURIComponent(ticketMsg)}`, '_blank');

    // 3) Abrir Whatsapp con app
    window.location.href = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(ticketMsg)}`;
  };


  return (

    <>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline rounded"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src={points}  
          style={{ width: '20px', height: '20px', objectFit: 'cover' }}/>
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={handlePrint}>Imprimir</button></li>
          <li><button className="dropdown-item" onClick={handleSendEmail}>Enviar Correo 1</button></li>
          <li><button className="dropdown-item" onClick={handleSendEmail2}>Enviar Correo 2</button></li>
          <li><button className="dropdown-item" onClick={handleWhatsapp}>Enviar WhatsApp</button></li>
        </ul>
      </div>

    </>

  );
};
