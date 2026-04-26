/**
 * @description Componente que muestra los badges de etiquetas asociadas a un cliente.
 * Carga las etiquetas filtradas del cliente y las renderiza como pills de colores.
 *
 * @param {Object} props
 * @param {string|number} props.idClient - ID del cliente cuyas etiquetas se muestran
 * @returns {JSX.Element} Lista de badges de etiquetas
 */
import { useEffect } from 'react';
//import { useFilterLabels } from '../../../hooks/useFilterLabels';
import { useClientsStore } from '../../../hooks/useClientsStore';
import { isColorDark } from '../../../helpers/isColorDark';


export const LabelClient = ({ idClient }) => {

  const { filteredLabelsByClient, startLoadingFilteredLabels } = useClientsStore();

  useEffect(() => {
    startLoadingFilteredLabels(idClient);
  }, []); // Mejor añadir dependencias

  // ← Aquí usas el selector, SÓLO las etiquetas de este cliente
  const labels = filteredLabelsByClient[idClient] || [];

  return (
    <div className="d-flex flex-wrap  ms-2">
      <ul className="d-flex gap-2 list-unstyled m-0 p-0">
        {labels.map(label => {
          const isDark = isColorDark(label.color);
          const textColor = isDark ? '#fff' : '#222';

          return (
            <li key={label.idLabel}>
              <span
                className="badge rounded-pill fw-semibold"
                style={{
                  backgroundColor: label.color,
                  color: textColor,
                  fontSize: '0.75rem',
                  padding: '5px 10px',
                  minWidth: 'fit-content',
                  letterSpacing: '0.01em',
                  borderRadius: '12px',
                  lineHeight: '1.2',
                  marginRight: '4px'
                }}
              >
                {label.name}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  );

}