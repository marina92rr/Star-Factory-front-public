/**
 * @description Boton para liquidar (pagar) un producto impagado individual.
 * Establece el producto activo y abre el modal de liquidacion.
 * @returns {JSX.Element} Boton de liquidacion individual
 */
import { useUiStore } from '../../../../hooks/useUiStore'
import { useSuscriptionClientStore } from '../../../../hooks/useSuscriptionClientStore';
import{ useProductClientStore } from '../../../../hooks/useProductClientStore';

export const LiquidateProductClient= ({unpaid}) => {

  const {openProductClientUnpaidModal} = useUiStore();
  const {setActiveProductClient} = useProductClientStore(); 

  const handleClickNew = () => {

    setActiveProductClient(unpaid); // Reset active quota
    openProductClientUnpaidModal(); 

  }

  return (
    <div>
        <button 
          className='btn btn-outline-secondary btn-sm me-2'
          onClick={handleClickNew}>
             <i className="bi bi-credit-card"></i>
        </button>
    </div>
  )
}
