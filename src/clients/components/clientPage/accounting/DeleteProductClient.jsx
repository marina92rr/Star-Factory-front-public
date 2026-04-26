/**
 * @description Boton para eliminar un producto-cliente de la caja diaria.
 * Solicita confirmacion antes de ejecutar la eliminacion.
 *
 * @param {Object} props
 * @param {Object} props.product - Datos del producto-cliente a eliminar
 * @returns {JSX.Element} Boton de eliminacion con icono de papelera
 */
import { useProductClientStore } from '../../../../hooks/useProductClientStore';

export const DeleteProductClient = ({productClient}) => {
   const { startDeleteProductClient} = useProductClientStore();


    const handleDelete =  async() => {
      const ok = window.confirm(`¿Seguro que deseas eliminar la venta #${productClient.name}?`);
      if (!ok) return;

      try {
       await startDeleteProductClient(productClient);
      } catch {
        // El Swal ya se muestra desde el hook startDeleteProductClient
      }
    };
    return (
       <button
        className='btn btn-outline-danger btn-sm'
        onClick={handleDelete}>
         <i className="bi bi-trash-fill"></i>
      </button>
    )
}
