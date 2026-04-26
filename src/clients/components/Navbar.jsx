/**
 * @description Barra de navegacion superior fija (navbar).
 * Muestra el nombre del usuario logueado (enlace al perfil), el buscador de clientes
 * y el boton de cerrar sesion. Solo se muestra cuando el usuario esta autenticado.
 * @returns {JSX.Element} Navbar superior con buscador y boton de logout
 */
import { use } from "react"
import { FindClient } from "./FindClient"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

  const {user, startLogout, setActiveUser} = useAuthStore();
  const navigate = useNavigate();


  const navigateUserProfile = () =>{
    setActiveUser(user);
    navigate('/profileUser');
  }

  const name = (user?.name || '').toUpperCase();

  
  return (
    <>
      <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">

        <button 
          className="btn text-light ms-3 me-5" 
          role="button" 
          data-bs-toggle="button"
          onClick={navigateUserProfile}>
            {name}
        </button>

       <FindClient/>

        <button 
          className="btn btn-outline-danger ms-auto me-5"
          onClick={startLogout}>
          <i className="fas fa-sign-out-alt"></i>
          &nbsp;
          <span>Salir</span>
        </button>
      </div>
    </>



  )
}
