/**
 * @description Boton para abrir el modal de transaccion de nueva venta.
 * Se muestra en la pagina de agregar ventas para confirmar la compra.
 * @returns {JSX.Element} Boton que abre el modal de venta
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
      Tramitar Venta
    </button>
  )
}
