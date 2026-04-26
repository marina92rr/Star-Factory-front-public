/**
 * @description Boton para abrir el modal de filtrado de clientes por etiquetas.
 * @returns {JSX.Element} Boton "Filtrar por etiqueta"
 */
import { useUiStore } from "../../../hooks/useUiStore";

export const FilterClientsByLabel = () => {

    const {openFilterClientByLabelModal} = useUiStore();
    const handleClickNew = () => {
      openFilterClientByLabelModal(); 
    }

  return (
     <div className="d-flex align-items-center flex-wrap gap-2">
      <button className='btn btn-outline-secondary' onClick={handleClickNew}>
        <i className="bi bi-pencil-square me-2"></i>
        Filtrar por Etiqueta
      </button>
    </div>
    
  )
}
