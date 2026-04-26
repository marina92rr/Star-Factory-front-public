/**
 * @description Boton para eliminar una suscripcion de un cliente.
 * Solicita confirmacion y recarga la pagina tras la eliminacion.
 *
 * @param {Object} props
 * @param {Object} props.suscription - Datos de la suscripcion a eliminar
 * @returns {JSX.Element} Boton de eliminacion de suscripcion
 */
import { useSuscriptionClientStore } from '../../../../hooks/useSuscriptionClientStore';

export const DeleteSuscriptionClient = ({suscription}) => {

    const { startDeleteSuscriptionClient } = useSuscriptionClientStore();


  const handleDelete = async () => {
    const ok = window.confirm(`¿Seguro que deseas eliminar la suscripción #${suscription.name}?`);
    if (!ok) return;

    try {
      await startDeleteSuscriptionClient(suscription);
      window.location.reload();
    } catch {
      // El Swal ya se muestra desde el hook startDeleteSuscriptionClient
      window.location.reload();
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
