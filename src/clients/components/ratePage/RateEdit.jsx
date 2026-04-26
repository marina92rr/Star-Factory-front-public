/**
 * @description Boton para editar la tarifa activa.
 * Establece la tarifa activa y abre el modal de edicion.
 * @returns {JSX.Element} Boton de edicion de tarifa
 */
import { useUiStore } from '../../../hooks/useUiStore'
import { useRateStore } from '../../../hooks/useRateStore';

export const RateEdit= () => {

  const {openRateModal} = useUiStore();
  const {setActiveRate, activeRate} = useRateStore();

  const handleClickNew = () => {
    setActiveRate(activeRate); // Reset active quota
    openRateModal(); 
  }

  return (
    <div>
        <button 
          className='btn btn-secondary mx-2'
          onClick={handleClickNew}>
            Editar
        </button>
    </div>
  )
}
