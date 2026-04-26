//Librerias pdf

import { useEffect, useMemo, useState } from "react";
import { useProductClientStore } from "../../../../hooks/useProductClientStore";
import { IVAProduct } from "../../../../helpers/IVAProduct";
import { exportSummaryPdf } from "../../../../helpers/exportSumaryPdf";
import { formatDate } from "date-fns";

export const PageMonthSummary = () => {
  const {
    startProductClientByRange,
    productsClientRange,
    totalPages,
    page,
    startProductClientByRangeAll,
    productsByRangeAll,
    starResetPagination
  } = useProductClientStore();

  const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const productsAll = productsByRangeAll;
  useEffect(() => {
  starResetPagination();
}, []);


  const { totalCash, totalTPV, totalAll, hasData } = useMemo(() => {
    const sum = (key) => productsAll.reduce((acc, d) => acc + (d[key] || 0), 0);

    const cash = sum("cash");
    const card = sum("card");

    return {
      totalCash: cash,
      totalTPV: card,
      totalAll: cash + card,
      hasData: productsAll.length > 0,
    };
  }, [productsAll]);

  const handleSearch = () => {
    startProductClientByRange(fromDate, toDate, 1); // tabla
    startProductClientByRangeAll(fromDate, toDate); // totales
  };

  //Enviar datos al helpers pdf
  const printPdf = () => {
    exportSummaryPdf({
      fromDate,
      toDate,
      products: productsAll,
      totalCash,
      totalTPV,
      totalAll,
    });
  };

  //Paginacion
  const showPag = totalPages > 1;

  return (
    <div className="m-5 fade-in">
      <div className="d-flex justify-content-between">
        <div>
          <div>
            <h2 className="mb-4">Resumen Mensual</h2>

            <div className="d-flex justify-content-between">
              <div className="d-flex gap-3 align-items-end mb-4">
                <div>
                  <label className="form-label">Desde</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Hasta</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-outline-secondary"
                  disabled={!fromDate || !toDate || fromDate > toDate}
                  onClick={handleSearch}
                >
                  Buscar
                </button>
                <button className="btn btn-outline-primary" onClick={printPdf}>
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4 ">
          <table className="table border align-middle rounded mt-3">
            <thead className="table-light">
              <tr>
                <th scope="col" className="col-1 text-center">
                  Total Efectivo
                </th>
                <th scope="col" className="col-1 text-center">
                  Total TPV
                </th>
                <th scope="col" className="col-1 text-center">
                  IVA
                </th>
                <th scope="col" className="col-1 text-center">
                  TOTAL
                </th>
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
                  <td colSpan={4} className="text-muted text-center">
                    No hay ventas en el rango seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex flex-column mt-3">
        {showPag && (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              className="btn m-2 btn-primary btn-sm"
              disabled={!totalPages || page <= 1}
              onClick={() =>
                startProductClientByRange(fromDate, toDate, page - 1)
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
                startProductClientByRange(fromDate, toDate, page + 1)
              }
            >
              →
            </button>
          </div>
        )}

        <table className="table border align-middle rounded-3 ">
          <thead className="table-light">
            <tr>
              <th scope="col" className="col-4">
                Fecha
              </th>
              <th scope="col" className="col-1 ">
                Total efectivo
              </th>
              <th scope="col" className="col-1 ">
                Total TPV
              </th>
              <th scope="col" className="col-1 ">
                IVA
              </th>
              <th scope="col" className="col-1 ">
                TOTAL (€)
              </th>
            </tr>
          </thead>
          <tbody>
            {productsClientRange?.length ? (
              productsClientRange.map((d, i) => (
                <tr key={i}>
                  <td className="p-3">{formatDate(d.date, "dd/MM/yyyy")}</td>

                  <td>{d.cash.toFixed(2)} €</td>

                  <td>{d.card.toFixed(2)} €</td>

                  <td>{d.iva.toFixed(2)} €</td>

                  <td className="fw-bold">{d.total.toFixed(2)} €</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay registros en este rango
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showPag && (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              className="btn m-2 btn-primary btn-sm"
              disabled={!totalPages || page <= 1}
              onClick={() =>
                startProductClientByRange(fromDate, toDate, page - 1)
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
                startProductClientByRange(fromDate, toDate, page + 1)
              }
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PageMonthSummary;
