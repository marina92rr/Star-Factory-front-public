/**
 * @description Boton para crear una nueva factura para el cliente activo.
 * Abre el modal de facturacion con los datos del cliente precargados.
 * @returns {JSX.Element} Boton "Nueva factura"
 */
import { useClientsStore } from "../../hooks/useClientsStore";
import { useUiStore } from "../../hooks/useUiStore";

export const ClientBill = () => {
  const { openClientBillModal } = useUiStore(); //Abrir modal
  const { setActiveClient, activeClient } = useClientsStore();

  const handleClickNew = () => {
    if (activeClient) {
      setActiveClient(activeClient);
    }
    openClientBillModal();
  };

  return (
    <button
      className="btn btn-primary ms-auto d-flex align-items-center cursor-pointer me-2"
      onClick={handleClickNew}
      style={{ userSelect: "none", cursor: "pointer" }}
    >
      Nueva factura
    </button>
  );
};
