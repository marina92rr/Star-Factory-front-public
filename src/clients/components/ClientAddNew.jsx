/**
 * @description Boton para crear un nuevo cliente.
 * Limpia el cliente activo y abre el modal de cliente para crear uno nuevo.
 * @returns {JSX.Element} Boton "Nuevo cliente"
 */
import { useClientsStore } from "../../hooks/useClientsStore";
import { useUiStore } from "../../hooks/useUiStore"

export const ClientAddNew = () => {
  const { openClientModal } = useUiStore(); // Abrir modal
  const { startClearingActiveClient } = useClientsStore();
  // Abrir modal y limpiar cliente activo
  const handleClickNew = () => {
    startClearingActiveClient();
    openClientModal();
  }


  return (
    <button
      className="btn btn-primary btn-sm ms-auto"
      onClick={handleClickNew}
      style={{
        height: '40px',        // Forzar altura baja (prueba 24, 28 o 30 según te guste)
       
       
      }}
    >
      Nuevo cliente
    </button>
  )
}

