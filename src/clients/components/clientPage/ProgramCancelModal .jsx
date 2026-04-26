/**
 * @description Modal para programar la baja futura de un cliente.
 * Permite seleccionar una fecha de baja y opcionalmente eliminar ventas pendientes.
 * @returns {JSX.Element} Modal de baja programada con selector de fecha
 */
import Modal from 'react-modal';
import { useState } from 'react';
import { useUiStore } from '../../../hooks/useUiStore';
import { useClientsStore } from '../../../hooks/useClientsStore';
import {customStyleModal} from '../../../helpers/customStyleModal';
import Swal from 'sweetalert2';

Modal.setAppElement('#root');


export const ProgramCancelModal = ({ idClient }) => {

  // Hooks
  const { isModalClientOpen, closeClientModal } = useUiStore();
  const { programClientCancellation, starLoadingClientByID } = useClientsStore();
  const [removeSales, setRemoveSales] = useState(false);


  // 🕒 Obtener la fecha actual en formato YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [cancelDate, setCancelDate] = useState(todayStr);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cancelDate) return Swal.fire('Atención', 'Selecciona una fecha válida', 'warning');

    await programClientCancellation(idClient, cancelDate, removeSales);
    await starLoadingClientByID(); // ✅ recarga sin tener que hacer reload
    setCancelDate('');
    closeClientModal();
  };


  return (
    <Modal
      isOpen={isModalClientOpen}
      closeTimeoutMS={200}
      onRequestClose={closeClientModal}
      style={customStyleModal}
      contentLabel="Programar baja"
    >
      <h3 className="m-3">Programar baja del cliente</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">

          <div className="mb-4">
            <label htmlFor="cancelDate" className="form-label">Fecha de baja:</label>
            <input
              type="date"
              className="form-control"
              value={cancelDate}
              onChange={(e) => setCancelDate(e.target.value)}
              min={todayStr}
            />
          </div>

          <div className='input-group mb-4'>
            <label className="d-inline-flex align-items-center gap-2">
              <input
                type="checkbox"
                className="me-1"           // margen a la derecha del check
                checked={removeSales}
                onChange={(e) => setRemoveSales(e.target.checked)}
              />
              Eliminar todas las ventas no pagadas del cliente

            </label>
          </div>


        </div>

        <div className="d-flex justify-content-end mb-3">

          <button type="submit" className="btn btn-success"
            style={{ background: '#38b647', color: 'white' }}>
            Confirmar fecha
          </button>
        </div>
      </form>
    </Modal >
  );

}
