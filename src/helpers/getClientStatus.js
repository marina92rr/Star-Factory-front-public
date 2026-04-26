/**
 * @description Determina el estado de un cliente respecto a su baja.
 * Analiza la fecha de cancelacion para clasificar si la baja es programada,
 * inmediata o si el cliente esta activo.
 *
 * @param {string|null} dateCancellationRaw - Fecha de cancelacion en formato ISO o null
 * @returns {{cancelDate: Date|null, isScheduledCancellation: boolean, isImmediateCancellation: boolean, isActive: boolean}}
 *   Objeto con la fecha de cancelacion parseada y los booleanos de estado
 */
export const getClientStatus = (dateCancellationRaw) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cancelDate = dateCancellationRaw ? new Date(dateCancellationRaw) : null;
  if (cancelDate) cancelDate.setHours(0, 0, 0, 0); // <-- IMPORTANTE

  const isScheduledCancellation = cancelDate && cancelDate > today;
  const isImmediateCancellation = cancelDate && cancelDate <= today;
  const isActive = !cancelDate;

  return {
    cancelDate,
    isScheduledCancellation,
    isImmediateCancellation,
    isActive,
  };
};
