import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { ClientName } from "../sales/ClientName";
import { capitalizeFirstWord } from "../../../../helpers/capitalizeFirstWord";
import { DateNavigator } from "../../../../helpers/DateNavigator";

import { IVAProduct } from "../../../../helpers/IVAProduct";
import { DateLabel } from "../../../../hooks/DateLabel";
import { useProductClientStore } from "../../../../hooks/useProductClientStore";
import { ClientBill } from "../../ClientBill";
import { ClientModalBill } from "../../ClientModalBill";
import { useClientsStore } from "../../../../hooks/useClientsStore";
import { DeleteBillClient } from "./DeleteBillClient";
import points from "../../../../assets/3point.png";

//fecha iso local.   (EJ: Local: 2025-09-21 00:00 → UTC es 2025-09-20 22:00.)
const toISO = (d) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10); //
const readISO = () =>
  new URLSearchParams(location.search).get("date") ||
  localStorage.getItem("accounting.selectedDate") ||
  toISO(new Date());

export const PageDailyBill = () => {
  const { startLoadBillByDate, billDate, starGetBillById, isLoadingBill } =
    useProductClientStore();
  const [date, setDate] = useState(readISO()); // Fecha seleccionada
  const { secActiveClient } = useClientsStore();

  // carga inicial y cada vez que cambie la fecha
  useEffect(() => {
    localStorage.setItem("accounting.selectedDate", date); // Guardar en localStorage(recarga la ultima fecha elegida)
    startLoadBillByDate(date);
  }, [date]);

  const billRows = useMemo(() => {
    return (billDate ?? []).map((bill) => {
      const total = (bill.items ?? []).reduce(
        (acc, i) => acc + (Number(i.price) || 0) * (Number(i.quantity) || 1),
        0,
      );
      return {
        billId: bill._id,
        numBill: bill.numBill,
        total,
        paymentDate: bill.paymentDate,
        paymentMethod: bill.paymentMethod,
        clientName: `${bill.name} ${bill.lastName}`,
        idClient: bill.idClient,
        items: bill.items,
        fullBill: bill,
      };
    });
  }, [billDate]);

  //Enviar a back
  const handleBillAction = async (billId, action, email) => {
    // Abrir ventana ANTES del await para evitar popup blocker
    const needsPdf = action === "print" || action === "print_send";
    const pdfWindow = needsPdf ? window.open("", "_blank") : null;

    try {
      const response = await starGetBillById(billId, action);

      if (pdfWindow) {
        const url = window.URL.createObjectURL(response.data);
        pdfWindow.document.write(
          `<html><head><title>Factura</title></head>` +
          `<body style="margin:0"><embed width="100%" height="100%" src="${url}" type="application/pdf"></body></html>`
        );
        pdfWindow.document.close();
      }

      // Notificacion de email
      const sendsEmail = action === "send" || action === "print_send";
      if (sendsEmail && email) {
        const emailError = response.headers?.["x-email-error"] || response.data?.emailError;
        if (emailError) {
          Swal.fire("Aviso", `La factura se ha procesado pero el correo no se pudo enviar a ${email}`, "warning");
        } else {
          Swal.fire("Correo enviado", `Factura enviada correctamente a ${email}`, "success");
        }
      }
    } catch (error) {
      if (pdfWindow) pdfWindow.close();
      console.error("Error en acción factura", error);
      Swal.fire("Error", "Error procesando la factura", "error");
    }
  };

  return (
    <div className="m-5 fade-in">
      <div className="d-flex justify-content-between">
        <div>
          <div>
            <h2 className="mb-4">Facturas</h2>

            <div className="d-flex justify-content-between">
              <ClientBill />
              <ClientModalBill />
              <DateNavigator value={date} onChange={setDate} />
            </div>
          </div>
        </div>
        <div className="col-4 "></div>
      </div>
      <div className="d-flex flex-column mt-3">
        <table className="table border align-middle rounded-3 ">
          <thead className="table-light">
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Cliente</th>
              <th scope="col">Concepto</th>
              <th scope="col">Total (€)</th>
              <th scope="col">IVA (€)</th>
              <th scope="col">Fecha Pago</th>
              <th scope="col">Método</th>
              <th scope="col">Borrar</th>
              <th scope="col">Factura</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingBill ? (
              <tr>
                <td colSpan="9" className="text-center text-muted py-4">
                  Cargando facturas...
                </td>
              </tr>
            ) : billRows.length ? (
              billRows.map((row) => (
                <tr key={row.billId}>
                  <td>{row.numBill}</td>
                  <td>
                    {row.idClient ? (
                      <span className="text-primary">
                        {row.clientName.toUpperCase()}
                      </span>
                    ) : (
                      <span className="badge text-bg-secondary">
                        No cliente - {row.clientName}
                      </span>
                    )}
                  </td>
                  <td>
                    {row.items.map((item, idx) => (
                      <div key={idx}>
                        {capitalizeFirstWord(item.description)}
                        {item.quantity ? ` (x${item.quantity})` : ""} —{" "}
                        {Number(item.price).toFixed(2)} €
                      </div>
                    ))}
                  </td>
                  <td>{Number(row.total).toFixed(2)} €</td>
                  <td>{IVAProduct(row.total).iva} €</td>
                  <td>
                    <DateLabel isoDate={row.paymentDate} />
                  </td>
                  <td>
                    {row.paymentMethod
                      ? capitalizeFirstWord(row.paymentMethod)
                      : "Pendiente"}
                  </td>
                  <td className="text-nowrap">
                    <DeleteBillClient bill={row} date={date} />
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline rounded"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src={points}
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                          }}
                        />
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleBillAction(row.billId, "print", row.fullBill?.email)
                            }
                          >
                            Imprimir
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleBillAction(row.billId, "send", row.fullBill?.email)
                            }
                          >
                            Enviar Correo
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleBillAction(row.billId, "print_send", row.fullBill?.email)
                            }
                          >
                            Imprimir y Enviar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No hay ventas para la fecha seleccionada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PageDailyBill;
