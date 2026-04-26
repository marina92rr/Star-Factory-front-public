/**
 * @description Componente que muestra una fecha ISO formateada como DD/MM/YYYY HH:MM.
 * La hora se muestra en color secundario. Si no recibe fecha, no renderiza nada.
 *
 * @param {Object} props
 * @param {string} props.isoDate - Fecha en formato ISO a formatear y mostrar
 * @returns {JSX.Element|null} Span con la fecha formateada o null si no hay fecha
 */

import { formatDate } from '../helpers/formatDate'

export const DateLabel = ({ isoDate }) => {
    if (!isoDate) return null;

    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return (
        <span>
            {day}/{month}/{year}{" "} 
            <span className='text-secondary text-body-tertiary'>{hour}:{minutes}</span>
        </span>
    )
}
