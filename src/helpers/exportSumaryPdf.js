/**
 * @description Genera y descarga un PDF de resumen mensual de ventas usando jsPDF.
 * Incluye logo, periodo de fechas, tabla de totales (efectivo, TPV, IVA, total)
 * y tabla detallada por dia con desglose de efectivo, tarjeta, IVA y total.
 *
 * @param {Object} params - Datos del resumen
 * @param {string} params.fromDate - Fecha de inicio del periodo
 * @param {string} params.toDate - Fecha de fin del periodo
 * @param {Array} params.products - Resumen por dia [{date, cash, card, iva, total}]
 * @param {number} params.totalCash - Total acumulado en efectivo
 * @param {number} params.totalTPV - Total acumulado en TPV/tarjeta
 * @param {number} params.totalAll - Total general acumulado
 * @returns {Promise<void>}
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IVAProduct } from "./IVAProduct";
import logo from "../assets/logo.png";
import { loadingImagePdf } from "./loadingImagePdf";
import { formatDate } from "../helpers/formatDate";

export const exportSummaryPdf = async ({
  fromDate,
  toDate,
  products, // 👈 resumen por día
  totalCash,
  totalTPV,
  totalAll,
}) => {
  const doc = new jsPDF();

  // 👉 LOGO
  const img = await loadingImagePdf(logo);
  doc.addImage(img, "PNG", 150, 10, 40, 20);

  /* =========================
     CABECERA
  ========================== */
  doc.setFontSize(16);
  doc.text("RESUMEN MENSUAL", 14, 15);

  doc.setFontSize(11);
  doc.text(`Desde: ${fromDate}`, 14, 25);
  doc.text(`Hasta: ${toDate}`, 14, 32);

  /* =========================
     TOTALES
  ========================== */
  autoTable(doc, {
    startY: 45,
    head: [["Total efectivo", "Total TPV", "IVA", "TOTAL"]],
    body: [
      [
        `${totalCash.toFixed(2)} €`,
        `${totalTPV.toFixed(2)} €`,
        `${IVAProduct(totalAll).iva} €`,
        `${totalAll.toFixed(2)} €`,
      ],
    ],
    styles: {
      fontSize: 11,
      halign: "center",
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 0,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontStyle: "bold",
    },
  });

  /* =========================
     TABLA POR DÍA
  ========================== */
  const tableData = products.map((d) => [
    formatDate(d.date),
    `${Number(d.cash || 0).toFixed(2)} €`,
    `${Number(d.card || 0).toFixed(2)} €`,
    `${Number(d.iva || 0).toFixed(2)} €`,
    `${Number(d.total || 0).toFixed(2)} €`,
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["Fecha", "Efectivo", "TPV", "IVA", "TOTAL"]],
    body: tableData,
    styles: {
      fontSize: 10,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: 0,
      fontStyle: "bold",
    },
  });

  doc.save(`resumen_${fromDate}_a_${toDate}.pdf`);
};
