/**
 * @description Boton para eliminar una cuota de una tarifa.
 * Solicita confirmacion y recarga las cuotas de la tarifa activa tras eliminar.
 *
 * @param {Object} props
 * @param {Object} props.quota - Datos de la cuota a eliminar
 * @returns {JSX.Element} Boton de eliminacion de cuota
 */
import { useQuotaStore } from '../../../hooks/useQuotaStore';
import { useRateStore } from '../../../hooks/useRateStore';

export const QuotaDelete = ({quota}) => {

  const { startDeleteQuota, startLoadingQuotasByRate } = useQuotaStore();
  const {activeRate} = useRateStore();
  
  const handleDelete = () => {
    const confirmDelete =  window.confirm(`¿Estás seguro de querer eliminar la cuota ${quota.name}?`);
    if(!confirmDelete) return;
    
    startDeleteQuota(quota);    
    startLoadingQuotasByRate(activeRate._id);

  }
  
  return (
   
        <button 
          className='btn btn-danger'
          onClick={handleDelete}>
            <i className="bi bi-trash-fill"></i>
        </button>
  
  )
}
