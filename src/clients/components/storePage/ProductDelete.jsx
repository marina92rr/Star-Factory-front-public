/**
 * @description Boton para eliminar un producto de la tienda.
 * Solicita confirmacion y recarga los productos de la categoria activa tras eliminar.
 *
 * @param {Object} props
 * @param {Object} props.product - Datos del producto a eliminar
 * @returns {JSX.Element} Boton de eliminacion de producto
 */
import { useProductStore } from '../../../hooks/useProductStore';
import { useCategoryStore } from '../../../hooks/useCategoryStore';

export const ProductDelete = ({ product }) => {

  const { startDeleteProduct, startLoadingProductsByCategory } = useProductStore();
  const { activeCategory } = useCategoryStore();

  const handleDelete = async() => {

    const confirmDelete = window.confirm(`¿Estás seguro de querer eliminar el producto ${product.name}?`);
    if (!confirmDelete) return;

    await startDeleteProduct(product);
    startLoadingProductsByCategory(activeCategory._id);

  }

  return (

    <button
      className='btn btn-danger'
      onClick={handleDelete}>
      <i className="bi bi-trash-fill"></i>
    </button>

  )
}
