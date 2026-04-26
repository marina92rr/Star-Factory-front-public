/**
 * @description Boton para crear un nuevo producto en la tienda.
 * Limpia el producto activo y abre el modal de creacion.
 * @returns {JSX.Element} Boton "Anadir Producto"
 */
import { useProductStore } from "../../../hooks/useProductStore";
import { useUiStore } from "../../../hooks/useUiStore"


export const ProductAddNew = () => {

  const {openProductModal} = useUiStore();
  const {setActiveProduct} = useProductStore();


  const handleClickNew = () =>{
        setActiveProduct({
            name: '',
            description: '',
            price: 0
        })
        openProductModal();
    }

  return (
    <button
      className="btn btn-ms"
       style={{ background: '#38b647', color: 'white' }}
      onClick={handleClickNew}>
      Añadir Producto
    </button>
  )
}
