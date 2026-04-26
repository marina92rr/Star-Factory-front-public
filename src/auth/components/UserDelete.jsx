/**
 * @description Boton para eliminar un usuario del sistema.
 * Muestra confirmacion antes de ejecutar la eliminacion.
 *
 * @param {Object} props
 * @param {Object} props.user - Datos del usuario a eliminar
 * @returns {JSX.Element} Boton de eliminacion de usuario
 */
import { useAuthStore } from '../../hooks/useAuthStore';

export const UserDelete = ({user}) => {


  const { startDeleteUser, startLoadingtUsers} = useAuthStore();
  
  const handleDelete = () => {
    const confirmDelete =  window.confirm(`¿Estás seguro de querer eliminar el usuario ${user.name}?`);
    if(!confirmDelete) return;
    
    startDeleteUser(user);    
  }
  
  return (
   
        <button 
          className='btn btn-danger'
          onClick={handleDelete}>
            <i className="bi bi-trash-fill"></i>
        </button>
  
  )
}
