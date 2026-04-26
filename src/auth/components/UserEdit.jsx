/**
 * @description Boton para editar un usuario.
 * Establece el usuario activo y abre el modal de edicion.
 *
 * @param {Object} props
 * @param {Object} props.user - Datos del usuario a editar
 * @returns {JSX.Element} Boton de edicion de usuario
 */
import { useAuthStore } from '../../hooks/useAuthStore';
import { useUiStore } from '../../hooks/useUiStore';

export const UserEdit= ({user}) => {

  const {openUserModal} = useUiStore();
  const {setActiveUser} = useAuthStore();


  const handleClickNew = () => {
  setActiveUser(user);
  openUserModal();

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
