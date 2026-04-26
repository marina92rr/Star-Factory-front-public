/**
 * @description Vista de ventas de un cliente.
 * Muestra las ventas impagadas y pagadas del cliente, permite liquidar
 * ventas individuales o en total, eliminar ventas y generar tickets PDF.
 * Incluye buscador de ventas y modales de liquidacion.
 * @returns {JSX.Element} Vista de ventas del cliente con tablas y acciones
 */
import React, { useEffect, useMemo, useState } from "react";
import { useClientsStore } from "../../../hooks/useClientsStore";
import { useProductClientStore } from "../../../hooks/useProductClientStore";
import { IVAProduct } from "../../../helpers/IVAProduct";
import { capitalizeFirstWord } from "../../../helpers/capitalizeFirstWord";
import { formatDate } from "../../../helpers/formatDate";
import { DeleteProductClientUnpaid } from "./sales/DeleteProductClientUnpaid";
import { LiquidateProductClient } from "./sales/LiquidateProductClient";
import { LiquidateProductClientModal } from "./sales/LiquidateProductClientModal";
import { CreateTicket } from "./sales/CreateTicket";
import { DateLabel } from "../../../hooks/DateLabel";
import { EditProductClient } from "./accounting/EditProductClient";
import { EditProductClientModal } from "./accounting/EditProductClientModal";
import { DeleteProductClient } from "./accounting/DeleteProductClient";
import { LiquidateTotalProductClientUnpaid } from "./sales/LiquidateTotalProductClientUnpaid";
import { LiquidateTotalProductClientModalUnpaid } from "./sales/LiquidateTotalProductClientModalUnpaid";

export const SalesClient = () => {
  const { activeClient, setActiveClient } = useClientsStore();
  const {
    productsClientPaid,
    productsClientUnpaid,
    startLoadingProductsClientPaid,
    startLoadingProductsClientUnpaid,
  } = useProductClientStore();

  useEffect(() => {
    setActiveClient(activeClient);
    if (activeClient?.idClient) {
      startLoadingProductsClientPaid(activeClient.idClient);
      startLoadingProductsClientUnpaid(activeClient.idClient);
    }
  }, [activeClient]);

  // --- paginación ventas pagadas ---
  const PAID = 30; // productos por página
  const [paidPage, setPaidPage] = useState(1); // página actual
  const totalPaidPages = Math.max(
    1,
    Math.ceil(productsClientPaid.length / PAID),
  ); // total páginas
  const paidSlice = productsClientPaid.slice(
    (paidPage - 1) * PAID,
    paidPage * PAID,
  ); // productos a mostrar en la página actual

  const prevPage = () => setPaidPage((p) => Math.max(1, p - 1)); // –
  const nextPage = () => setPaidPage((p) => Math.min(totalPaidPages, p + 1)); // +

  const total = productsClientUnpaid.reduce(
    (sum, item) => sum + (item.price - (item.discount || 0)),
    0,
  );

  return (
    <div>
      {/* Pendientes */}
      <div className="pb-3">
        <div className="border rounded-top p-3 d-flex align-items-center flex-wrap bg-light">
          <h4 className="mb-1 me-2">Ventas pendientes de pago</h4>
          <span className="text-secondary" style={{ fontSize: "1rem" }}>
            {productsClientUnpaid.length}
          </span>

          <div className="ms-auto d-flex align-items-center">
            {productsClientUnpaid.length > 0 && (
              <div className="d-flex align-items-center">
                <h5 className="mb-1 me-3">Total: {total}€</h5>
                <LiquidateTotalProductClientUnpaid
                  productsClientUnpaid={productsClientUnpaid}
                />
                <LiquidateTotalProductClientModalUnpaid
                  total={total}
                  idClient={activeClient?.idClient}
                />
              </div>
            )}
          </div>
        </div>

        <table className="table border col-12">
          <thead>
            <tr>
              <th className="p-3 col-4">Concepto</th>
              <th className="p-3 col-1">Total</th>
              <th className="p-3 col-1">Desc.</th>
              <th className="p-3 col-1">IVA</th>
              <th className="p-3 col-2">Fecha</th>
              <th className="p-3 col-2">Deuda</th>
            </tr>
          </thead>
          <tbody>
            {productsClientUnpaid.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted">
                  No hay productos pendientes de pago
                </td>
              </tr>
            ) : (
              [...productsClientUnpaid]
                .sort((a, b) => new Date(b.buyDate) - new Date(a.buyDate))
                .map((unpaid, i) => {
                  const { iva, total } = IVAProduct(unpaid.price);
                  return (
                    <tr key={i}>
                      <td className="text-primary p-3 col-4">
                        {capitalizeFirstWord(unpaid.name)}
                      </td>
                      <td className="p-3">{total - unpaid.discount}€</td>
                      <td className="p-3">{unpaid.discount}€</td>
                      <td className="p-3">{iva}€</td>
                      <td className="p-3">
                        <DateLabel isoDate={unpaid.buyDate} />
                      </td>
                      <td className="p-3">
                        <div className="d-flex align-items-center">
                          <LiquidateProductClient unpaid={unpaid} />
                          <LiquidateProductClientModal />
                          <DeleteProductClientUnpaid unpaid={unpaid} />
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Realizadas */}
      <div>
        <div className="border rounded-top p-3 d-flex align-items-center flex-wrap bg-light">
          <h4 className="mb-1 me-2">Ventas realizadas</h4>
          <span className="text-secondary" style={{ fontSize: "1rem" }}>
            {productsClientPaid.length}
          </span>
        </div>

        <table className="table border col-12">
          <thead>
            <tr>
              <th className="p-3 col-3">Concepto</th>
              <th className="p-3 col-1">Total</th>
              <th className="p-3 col-1">Desc.</th>
              <th className="p-3 col-1">IVA</th>
              <th className="p-3 col-2">Fecha</th>
              <th className="p-3 col-2">Pago</th>
              <th className="p-3 col-2">Método de pago</th>
              <th className="p-3 col-1">Editar</th>
              <th className="p-3 col-1">ticket</th>
            </tr>
          </thead>
          <tbody>
            {productsClientPaid.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted">
                  No hay Productos en esta categoría
                </td>
              </tr>
            ) : (
              [...paidSlice]
                .sort(
                  (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
                )
                .map((row) => {
                  const saleId = row.idSalesClient; // id de la venta
                  const group = productsClientPaid.filter(
                    (i) =>
                      i.idSalesClient === saleId &&
                      new Date(i.paymentDate).getTime() ===
                        new Date(row.paymentDate).getTime(),
                  );

                  const venta = {
                    fecha: row.paymentDate,
                    cliente: `${activeClient.name} ${activeClient.lastName}`,
                    items: group.map((i) => ({
                      name: i.name,
                      price: Number(i.price),
                      discount: Number(i.discount || 0),
                    })),
                    total: group.reduce(
                      (s, i) => s + (Number(i.price) - Number(i.discount || 0)),
                      0,
                    ),
                  };

                  const { iva } = IVAProduct(row.price);

                  return (
                    <tr key={row.idProductClient || row._id}>
                      <td className="text-primary p-3">
                        {capitalizeFirstWord(row.name)}
                      </td>
                      <td className="p-3">{row.price - row.discount}€</td>
                      <td className="p-3">{row.discount}€</td>
                      <td className="p-3">{iva}€</td>
                      <td className="p-3">{formatDate(row.buyDate)}</td>
                      <td className="p-3">
                        <DateLabel isoDate={row.paymentDate} />
                      </td>
                      <td className="p-3">
                        {capitalizeFirstWord(row.paymentMethod)}
                      </td>
                      <td className="p-3 text-nowrap">
                        <div className="d-inline-flex gap-2">
                          <EditProductClient productClient={row} />
                          <EditProductClientModal />
                          <DeleteProductClient productClient={row} />
                        </div>
                      </td>

                      <td className="p-3">
                        <CreateTicket venta={venta} />
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
        {/* Controles – / + */}
        {productsClientPaid.length > 0 && totalPaidPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={prevPage}
              disabled={paidPage === 1}
            >
              –
            </button>
            <span>
              {paidPage} de {totalPaidPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={nextPage}
              disabled={paidPage === totalPaidPages}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
