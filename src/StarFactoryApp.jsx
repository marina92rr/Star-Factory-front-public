/**
 * @description Componente raiz de la aplicacion Star Factory.
 * Configura el Provider de Redux, el BrowserRouter y gestiona la autenticacion
 * para mostrar la barra de navegacion y el sidebar cuando el usuario esta autenticado.
 * @module StarFactoryApp
 */
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router/AppRoutes'
import { Provider } from 'react-redux'
import { store } from "./store"
import { Sidebar } from './clients/components/Sidebar'
import { Navbar } from './clients/components/Navbar'
import { useAuthStore } from './hooks/useAuthStore'
import { useEffect } from 'react'



/**
 * @description Componente principal que envuelve la app con el Provider de Redux y BrowserRouter.
 * @returns {JSX.Element} Arbol de la aplicacion con Redux y enrutamiento configurados.
 */
export const StarFactoryApp = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWithAuth />
      </BrowserRouter>
    </Provider>
  );
};

/**
 * @description Componente interno que verifica la autenticacion del usuario al montar.
 * Si el usuario esta autenticado, muestra la Navbar y el Sidebar junto con las rutas.
 * Si esta en estado 'checking', muestra un indicador de carga.
 * @returns {JSX.Element} Layout con o sin navegacion segun el estado de autenticacion.
 */
const AppWithAuth = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === 'checking') {
    return <div className="p-4">Cargando…</div>;
  }

  const isAuth = status === 'authenticated';

  return (
    <>
      {isAuth && <Navbar />}
      <div className={isAuth ? 'app-shell' : ''}>
        {isAuth && <Sidebar />}
        <div className={isAuth ? 'app-content' : ''}>
          <AppRoutes />
        </div>
      </div>
    </>
  );
};
