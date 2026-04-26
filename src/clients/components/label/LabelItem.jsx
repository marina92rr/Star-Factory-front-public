/**
 * @description Componente de fila de etiqueta en el listado de etiquetas.
 * Muestra el badge con el color de la etiqueta, el nombre, el numero de clientes
 * asociados y botones de editar/eliminar. Optimizado con React.memo.
 *
 * @param {Object} props
 * @param {Object} props.label - Datos de la etiqueta (idLabel, name, color, memberCount)
 * @returns {JSX.Element} Fila de etiqueta con acciones
 */
import { memo } from 'react';
import { isColorDark } from '../../../helpers/isColorDark';
import { LabelEdit } from './LabelEdit';
import { LabelDelete } from './LabelDelete';

export const LabelItem = memo(({ label }) => {
  const isDark = isColorDark(label.color);
  const textColor = isDark ? '#fff' : '#222';

  return (
    <div className="border p-4">
      <div className="d-flex align-items-center gap-3">
        <li className="list-unstyled col-4">
          <span
            className="badge rounded-pill fw-semibold"
            style={{
              backgroundColor: label.color,
              color: textColor,
              fontSize: '0.75rem',
              padding: '5px 10px',
              letterSpacing: '0.01em',
              borderRadius: '12px',
              lineHeight: '1.2',
              marginRight: '4px'
            }}
          >
            {label.name}
          </span>
        </li>

        <span className="text-secondary">
          {label.memberCount ?? 0} cliente{(label.memberCount ?? 0) === 1 ? '' : 's'}
        </span>

        <div className='ms-auto d-flex gap-1'>
          <LabelEdit label={label} />
          <LabelDelete label={label} />
        </div>
      </div>
    </div>
  );
});
