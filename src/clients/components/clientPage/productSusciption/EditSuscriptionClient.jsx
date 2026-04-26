/**
 * @description Boton para editar una suscripcion de un cliente.
 * Establece la suscripcion activa y abre el modal de edicion.
 *
 * @param {Object} props
 * @param {Object} props.suscription - Datos de la suscripcion a editar
 * @returns {JSX.Element} Boton de edicion de suscripcion
 */
import { useUiStore } from '../../../../hooks/useUiStore'
import { useSuscriptionClientStore } from '../../../../hooks/useSuscriptionClientStore';

export const EditSuscriptionClient= ({suscription}) => {

  const {openSuscriptionClientModal} = useUiStore();
  const {setActiveSuscriptionClient} = useSuscriptionClientStore();

  const handleClickNew = () => {

    setActiveSuscriptionClient(suscription); // Reset active quota
    openSuscriptionClientModal(); 

  }

  return (
    <div>
        <button 
          className='btn btn-outline-secondary btn-sm'
          onClick={handleClickNew}>
             <i className="bi bi-pencil-square"></i>
        </button>
    </div>
  )
}
