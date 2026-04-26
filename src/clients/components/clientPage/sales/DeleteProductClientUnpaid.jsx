/**
 * @description Boton para eliminar un producto impagado de un cliente.
 * Solicita confirmacion con SweetAlert2 antes de eliminar.
 * @returns {JSX.Element} Boton de eliminacion de producto impagado
 */
import { useProductClientStore } from '../../../../hooks/useProductClientStore';

export const DeleteProductClientUnpaid = ({unpaid}) => {
   const { startDeleteProductClient} = useProductClientStore();


    const handleDelete =  async() => {
      const ok = window.confirm(`¿Seguro que deseas eliminar la venta #${unpaid.name}?`);
      if (!ok) return;

      try {
       await startDeleteProductClient(unpaid);
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
