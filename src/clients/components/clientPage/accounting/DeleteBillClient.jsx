/**
 * @description Boton para eliminar una factura o linea de factura.
 * Solicita confirmacion con SweetAlert2 antes de eliminar.
 *
 * @param {Object} props
 * @param {Object} props.bill - Datos de la factura a eliminar
 * @returns {JSX.Element} Boton de eliminacion de factura
 */
import React from "react";
import { useProductClientStore } from "../../../../hooks/useProductClientStore";

export const DeleteBillClient = ({ bill, date }) => {

  const { startDeleteBillClient } = useProductClientStore();

  const handleDeleteBill = async () => {
    const ok = window.confirm(
      `¿Seguro que deseas eliminar la factura #${bill.numBill}?`
    );
    if (!ok) return;

    try {
      await startDeleteBillClient({
        billId: bill.billId,
        total: true,
        date,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className="btn btn-danger btn-sm"
      onClick={handleDeleteBill}
      title="Eliminar factura"
    >
      <i className="bi bi-trash-fill"></i>
    </button>
  );
};
