/**
 * @description Boton para eliminar una etiqueta del sistema.
 * Solicita confirmacion con SweetAlert2 antes de eliminar.
 *
 * @param {Object} props
 * @param {Object} props.label - Datos de la etiqueta a eliminar
 * @returns {JSX.Element} Boton de eliminacion de etiqueta
 */
import { useLabelsStore } from '../../../hooks/useLabelsStore';

export const LabelDelete = ({ label }) => {

  const{ startDeleteLabel} = useLabelsStore();

  const handleDelete = async() => {
    const confirmDelete = window.confirm(`¿Estás seguro de querer eliminar la etiqueta ${label.name}?`);
    if (!confirmDelete) return;
    await startDeleteLabel(label);
  }

  return (

    <button
      className='btn btn-danger'
      onClick={handleDelete}>
      <i className="bi bi-trash-fill"></i>
    </button>

  )
}
