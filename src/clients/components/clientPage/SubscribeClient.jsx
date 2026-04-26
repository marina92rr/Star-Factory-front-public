/**
 * @description Componente para gestionar la baja/alta de un cliente.
 * Muestra un dropdown con opciones: dar de baja inmediata, programar baja,
 * cancelar baja programada o reactivar cliente. Incluye modal de baja programada.
 * @returns {JSX.Element} Dropdown con opciones de gestion de estado del cliente
 */
import React, { useState } from 'react'
import { ProgramCancelModal } from './ProgramCancelModal ';
import { useClientsStore } from '../../../hooks/useClientsStore';
import { useUiStore } from '../../../hooks/useUiStore';
import { getClientStatus } from '../../../helpers/getClientStatus';

export const SubscribeClient = ({ idClient }) => {

  const { activeClient, toggleClientStatusCancel, starLoadingClientByID, cancelClientScheduledCancellation } = useClientsStore();
  const { openCancelSuscribeClientModal, openClientModal } = useUiStore();

  const { isActive, isImmediateCancellation, isScheduledCancellation, cancelDate } = getClientStatus(activeClient?.dateCancellation);
  const [removeSales, setRemoveSales] = useState(false);


  const handleCancelClient = async () => {
    if (!activeClient) return;

    const isCurrentlyCancelled = !!activeClient.dateCancellation;
    const action = isCurrentlyCancelled ? 'dar de alta' : 'dar de baja';
    const confirm = window.confirm(`¿Estás seguro de querer ${action} al cliente?`);

    if (confirm) {
      await toggleClientStatusCancel(idClient, removeSales);
      await starLoadingClientByID(); // ✅ recarga sin tener que hacer reload
    }
  }

  return (
    <>
      {isImmediateCancellation && (
        <>
          <button className="btn btn-outline-success" onClick={handleCancelClient}>
            Dar alta
          </button>
        </>
      )}

      {isScheduledCancellation && (
        <button className="btn btn-outline-danger" onClick={() => cancelClientScheduledCancellation(idClient)}>
          Cancelar baja programada
        </button>
      )}

      {isActive && (
        <>
          <button className="btn btn-danger me-2" onClick={openCancelSuscribeClientModal}>
            Dar baja
          </button>
          <button className="btn btn-outline-danger me-2" onClick={openClientModal}>
            Programar baja
          </button>
          <ProgramCancelModal idClient={idClient} />

        </>
      )}
    </>
  )

}
