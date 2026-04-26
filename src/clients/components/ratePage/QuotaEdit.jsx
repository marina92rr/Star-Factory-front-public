/**
 * @description Boton para editar una cuota existente.
 * Establece la cuota activa y abre el modal de edicion.
 *
 * @param {Object} props
 * @param {Object} props.quota - Datos de la cuota a editar
 * @returns {JSX.Element} Boton de edicion de cuota
 */
import { useUiStore } from '../../../hooks/useUiStore'
import { useQuotaStore } from '../../../hooks/useQuotaStore';

export const QuotaEdit= ({quota}) => {

  const {openQuotaModal} = useUiStore();
  const {setActiveQuota} = useQuotaStore();

  const handleClickNew = () => {
  setActiveQuota(quota);
  openQuotaModal();

  }

  return (
    <div>
        <button 
          className='btn btn-secondary mx-2'
          onClick={handleClickNew}>
            <i className="bi bi-pencil-square"></i>
        </button>
    </div>
  )
}
