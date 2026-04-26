/**
 * @description Componente de navegacion de fechas con calendario desplegable.
 * Permite avanzar/retroceder un dia con flechas y seleccionar una fecha
 * concreta desde un calendario inline con navegacion mensual.
 * Utiliza la libreria date-fns para el formateo y la manipulacion de fechas.
 *
 * @param {Object} props
 * @param {Date} props.value - Fecha seleccionada actualmente
 * @param {Function} props.onChange - Callback que recibe la nueva fecha seleccionada
 * @param {Object} [props.locale] - Locale de date-fns (por defecto espanol)
 * @param {string} [props.displayFormat] - Formato de visualizacion de la fecha (por defecto 'd MMM yyyy')
 * @returns {JSX.Element} Navegador de fechas con calendario desplegable
 */
import React, { useMemo, useState } from 'react';
import {
  addDays, addMonths, format, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay
} from 'date-fns';
import { es as esLocale } from 'date-fns/locale';

export const DateNavigator = ({
  value,
  onChange,
  locale = esLocale,             // cambia a undefined si prefieres inglés
  displayFormat = 'd MMM yyyy'   // p.ej. "5 feb 2025"
}) => {
  const [open, setOpen] = useState(false);
  const shownDate = useMemo(() => value ?? new Date(), [value]);
  const label = useMemo(() => format(shownDate, displayFormat, { locale }), [shownDate, displayFormat, locale]);

  const go = (delta) => onChange(addDays(shownDate, delta));

  // ---------- Calendario ----------
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(shownDate));
  // Si cambia la fecha mostrada desde fuera, sincroniza el mes del calendario
  React.useEffect(() => {
    setCalendarMonth(startOfMonth(shownDate));
  }, [shownDate]);

  const monthLabel = format(calendarMonth, 'MMMM yyyy', { locale });

  const buildCalendar = () => {
    const start = startOfWeek(startOfMonth(calendarMonth), { locale });
    const end = endOfWeek(endOfMonth(calendarMonth), { locale });

    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    // Trocea en semanas de 7
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const weekdayNames = () => {
    const start = startOfWeek(new Date(), { locale });
    return Array.from({ length: 7 }).map((_, i) =>
      format(addDays(start, i), 'EEEEE', { locale }) // 1 letra (L M X J V S D)
    );
  };

  const weeks = buildCalendar();
  const weekdays = weekdayNames();

  const selectDate = (d) => {
    onChange(d);
    setOpen(false);
  };

  return (
    <div className="d-inline-flex align-items-center gap-2 position-relative">
      <div className='bg-light rounded border d-flex'>
        <button type="button" className="btn" onClick={() => go(-1)} aria-label="Día anterior">‹</button>

        <button
          type="button"
          className="btn"
          onClick={() => setOpen(v => !v)}
          aria-label="Elegir fecha"
          style={{ minWidth: 160 }}
        >
          {label}
        </button>

        <button type="button" className="btn" onClick={() => go(1)} aria-label="Día siguiente">›</button>
      </div>

      {/* Calendario inline */}
      {open && (
        <div
          className="border rounded-3 bg-white shadow position-absolute mt-2 p-2"
          style={{ top: '100%', left: 0, zIndex: 1000, width: 280 }}
        >
          {/* Cabecera mes */}
          <div className="d-flex justify-content-between align-items-center px-2 py-1">
            <button className="btn btn-sm" onClick={() => setCalendarMonth(m => addMonths(m, -1))} aria-label="Mes anterior">‹</button>
            <strong className="text-capitalize">{monthLabel}</strong>
            <button className="btn btn-sm" onClick={() => setCalendarMonth(m => addMonths(m, 1))} aria-label="Mes siguiente">›</button>
          </div>

          {/* Semana: nombres días */}
          <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {weekdays.map((wd, i) => (
              <div key={i} className="text-center small text-muted py-1">{wd}</div>
            ))}
          </div>

          {/* Días */}
          <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {weeks.map((week, wi) => (
              <React.Fragment key={wi}>
                {week.map((d, di) => {
                  const isOutside = !isSameMonth(d, calendarMonth);
                  const isSelected = isSameDay(d, shownDate);

                  return (
                    <button
                      key={di}
                      type="button"
                      onClick={() => selectDate(d)}
                      className={`btn btn-sm py-2 ${isSelected ? 'btn-primary' : 'btn-light'} ${isOutside ? 'opacity-50' : ''}`}
                      style={{ borderRadius: 6, margin: 2 }}
                      aria-current={isSelected ? 'date' : undefined}
                    >
                      {format(d, 'd', { locale })}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};