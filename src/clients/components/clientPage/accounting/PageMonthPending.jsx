import { useEffect, useMemo, useState } from "react";
import { useProductClientStore } from "../../../../hooks/useProductClientStore";
import { IVAProduct } from "../../../../helpers/IVAProduct";
import { capitalizeFirstWord } from "../../../../helpers/capitalizeFirstWord";
import { ClientName } from "../sales/ClientName";

export const PageMonthPending = () => {
  const {
    startProductPendingMonth,
    productsPendingMonth,
    page,
    totalPages,
    productsPendingMonthAll,
    startProductPendingMonthAll,
    starResetPagination
  } = useProductClientStore();

  // mes actual por defecto
  const today = new Date();
  const [monthValue, setMonthValue] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
  );

  const [year, month] = monthValue.split("-").map(Number);

  useEffect(() => {
      starResetPagination();

    if (!year || !month) return;

    startProductPendingMonth(year, month, 1);
    startProductPendingMonthAll(year, month);
  }, [year, month]);

  const productsPendingAll = productsPendingMonthAll;

  // 🔹 Totales (impagos del mes)
  const { totalCash, totalTPV, totalAll, hasData } = useMemo(() => {
    const sum = (filterFn) =>
      productsPendingAll
        .filter(filterFn)
        .reduce((acc, p) => acc + (p.price - p.discount), 0);

    const cash = sum((p) => p.paymentMethod === "efectivo");
    const card = sum((p) => p.paymentMethod === "tarjeta");

    return {
      totalCash: cash,
      totalTPV: card,
      totalAll: cash + card,
      hasData: productsPendingAll.length > 0,
    };
  }, [productsPendingAll]);

  //Paginacion
  const showPag = totalPages > 1;

  return (
    <div className="m-5 fade-in">
      <div className="d-flex justify-content-between">
        <div>
          <h2 className="mb-4">Impagos del mes</h2>

          <div className="d-flex gap-3 mb-4">
            <div>
              <label className="form-label">Mes</label>
              <input
                type="month"
                className="form-control"
                value={monthValue}
                onChange={(e) => setMonthValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 🔹 Totales */}
        <div className="col-4">
          <table className="table border align-middle rounded mt-3">
            <thead className="table-light">
              <tr>
                <th className="text-center">Total Efectivo</th>
                <th className="text-center">Total TPV</th>
                <th className="text-center">IVA</th>
                <th className="text-center">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                <tr>
                  <td className="text-center">{totalCash.toFixed(2)} €</td>
                  <td className="text-center">{totalTPV.toFixed(2)} €</td>
                  <td className="text-center">{IVAProduct(totalAll).iva} €</td>
                  <td className="fw-bold text-center">
                    {totalAll.toFixed(2)} €
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No hay impagos este mes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* 🔹 Paginación */}
      {showPag && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn m-2 btn-primary btn-sm"
            disabled={!totalPages || page <= 1}
            onClick={() =>
              startProductPendingMonth(year, month, page - 1)
            }
          >
            ←
          </button>

          <span>
            {page || 1} de {totalPages || 1}
          </span>

          <button
            className="btn m-2 btn-primary btn-sm"
            disabled={!totalPages || page >= totalPages}
            onClick={() =>
              startProductPendingMonth(year, month, page + 1)
            }
          >
            →
          </button>
        </div>
      )}

      {/* 🔹 Tabla de registros */}
      <table className="table border align-middle rounded-3">
        <thead className="table-light">
          <tr>
            <th>Concepto</th>
            <th>Entrada (€)</th>
            <th>Desc. (€)</th>
            <th>IVA (€)</th>
            <th>Fecha Pago</th>
            <th>Método de pago</th>
            <th>Editar/Borrar</th>
          </tr>
        </thead>
        <tbody>
          {productsPendingMonth.length ? (
            productsPendingMonth.map((p) => (
              <tr key={p._id}>
                <td className="p-3 d-flex gap-2 align-items-center">
                  {capitalizeFirstWord(p.name)} —{" "}
                  {Number(p?.idClient) > 0 ? (
                    <ClientName idClient={p.idClient} />
                  ) : (
                    <span className="badge text-bg-secondary">
                      Administración
                    </span>
                  )}
                </td>
                <td>{p.price.toFixed(2)} €</td>
                <td>{p.discount.toFixed(2)} €</td>
                <td>{IVAProduct(p.price - p.discount).iva} €</td>
                <td className="text-muted">—</td>
                <td>{p.paymentMethod}</td>
                <td>{/* aquí tus botones editar / borrar */}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                No hay registros
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Paginación */}
      {showPag && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn m-2 btn-primary btn-sm"
            disabled={!totalPages || page <= 1}
            onClick={() =>
              startProductPendingMonth(year, month, page - 1)
            }
          >
            ←
          </button>

          <span>
            {page || 1} de {totalPages || 1}
          </span>

          <button
            className="btn m-2 btn-primary btn-sm"
            disabled={!totalPages || page >= totalPages}
            onClick={() =>
              startProductPendingMonth(year, month, page + 1)
            }
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
export default PageMonthPending;
