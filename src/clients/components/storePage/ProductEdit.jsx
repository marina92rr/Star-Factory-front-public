/**
 * @description Boton para editar un producto existente.
 * Establece el producto activo y abre el modal de edicion.
 *
 * @param {Object} props
 * @param {Object} props.product - Datos del producto a editar
 * @returns {JSX.Element} Boton de edicion de producto
 */
import { useUiStore } from '../../../hooks/useUiStore'
import { useProductStore } from '../../../hooks/useProductStore';

export const ProductEdit= ({product}) => {

  const {openProductModal} = useUiStore();
  const {setActiveProduct} = useProductStore();

  const handleClickNew = () => {
    setActiveProduct(product);
    openProductModal();
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
