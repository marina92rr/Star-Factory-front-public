/**
 * @description Boton para abrir el modal de nueva factura desde la vista de ventas.
 * @returns {JSX.Element} Boton de nueva factura
 */
import { useUiStore } from '../../../../hooks/useUiStore'


export const TransactNewSales = () => {

    const {openSaleModal} = useUiStore();


    const handleClickNew = () =>{
        
        openSaleModal();
    }

  return (
     <button
      className="btn mx-auto"
      style={{ background: '#38b647', color: 'white' }}
      onClick={handleClickNew}>
      Nueva Factura
    </button>
  )
}
