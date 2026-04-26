import { getClientStatus } from '../../helpers/getClientStatus';

describe('getClientStatus', () => {
  test('debe retornar isActive=true si no hay fecha de cancelacion', () => {
    const result = getClientStatus(null);

    expect(result.isActive).toBe(true);
    // cancelDate es null, por tanto las comparaciones con > y <= devuelven null (falsy)
    expect(result.isScheduledCancellation).toBeFalsy();
    expect(result.isImmediateCancellation).toBeFalsy();
    expect(result.cancelDate).toBeNull();
  });

  test('debe retornar isImmediateCancellation=true si la fecha es pasada', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    const result = getClientStatus(pastDate.toISOString());

    expect(result.isActive).toBe(false);
    expect(result.isImmediateCancellation).toBe(true);
    expect(result.isScheduledCancellation).toBe(false);
  });

  test('debe retornar isScheduledCancellation=true si la fecha es futura', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const result = getClientStatus(futureDate.toISOString());

    expect(result.isActive).toBe(false);
    expect(result.isScheduledCancellation).toBe(true);
    expect(result.isImmediateCancellation).toBe(false);
  });

  test('debe retornar isImmediateCancellation=true si la fecha es hoy', () => {
    const today = new Date();

    const result = getClientStatus(today.toISOString());

    expect(result.isActive).toBe(false);
    expect(result.isImmediateCancellation).toBe(true);
    expect(result.isScheduledCancellation).toBe(false);
  });

  test('debe retornar isActive=true si dateCancellation es undefined', () => {
    const result = getClientStatus(undefined);

    expect(result.isActive).toBe(true);
  });

  test('cancelDate debe ser un objeto Date cuando se pasa una fecha', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const result = getClientStatus(futureDate.toISOString());

    expect(result.cancelDate).toBeInstanceOf(Date);
  });
});
