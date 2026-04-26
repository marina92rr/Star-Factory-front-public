/**
 * @description Boton para agregar un nuevo producto de administracion.
 * Abre el modal de producto-cliente en modo administracion.
 * @returns {JSX.Element} Boton para agregar producto administrativo
 */
import { useProductClientStore } from '../../../../hooks/useProductClientStore';
import { useUiStore } from '../../../../hooks/useUiStore';



export const AddNewProductClient = () => {

    const {openProductClientAdminModal} = useUiStore();
    const { setActiveProductClient} = useProductClientStore();

    
    const handleClickNew = () => {
        
        setActiveProductClient({
          idClient: 0,
          idProduct: 0,
          price: 0,
          paymentMethod: '',
          paid: true,
          buyDate: new Date().toISOString().slice(0, 10),
          paymentDate:  new Date().toISOString().slice(0, 10)

        })
      //  closeLabelModal();
        openProductClientAdminModal();
    }

  return (
    <button 
        className='btn me-3'
        style={{ background: '#38b647', color: 'white' }}
        onClick={handleClickNew}>
        Añadir registro
    </button>
    
  )
}
