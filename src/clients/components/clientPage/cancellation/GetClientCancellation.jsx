/**
 * @description Enlace que muestra el numero de clientes con baja programada.
 * Carga la lista al montar y abre el modal de bajas programadas al hacer clic.
 * @returns {JSX.Element} Texto clicable con el contador de bajas programadas
 */
import { useEffect } from "react";
import { useClientsStore } from "../../../../hooks/useClientsStore";
import { useUiStore } from "../../../../hooks/useUiStore";

export const GetClientCancellation = () => {


    const {loadClientsWithScheduledCancellation, scheduledCancellationClients} = useClientsStore();
    const {openCancellationModal} = useUiStore();

    useEffect(() => {
        loadClientsWithScheduledCancellation();
    }, []);

    const handleClick = () => {
       openCancellationModal();
    }

  return (
   <span className="text-nowrap text-primary " 
   style={{ cursor: 'pointer' }}
   onClick={handleClick}
   >
        Bajas programadas ({scheduledCancellationClients.length})
    </span>
  );
};
