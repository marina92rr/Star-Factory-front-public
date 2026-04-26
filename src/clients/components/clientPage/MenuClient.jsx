/**
 * @description Menu de navegacion por pestanas dentro de la pagina de un cliente.
 * Muestra enlaces a las subpaginas: Vista general, Reservas, Ventas y Perfil.
 * @returns {JSX.Element} Menu horizontal con pestanas de navegacion
 */
import { NavLink, useParams } from 'react-router-dom';

  const links = [
    { name: 'Vista general', path: 'overview' },       // ruta índice: /clients/:id
    { name: 'Reservas', path: 'reservations' },
    { name: 'Ventas', path: 'sales' },
    { name: 'Perfil', path: 'profile' } // /clients/:ID/profile
  ];


export const MenuClient = () => {
  // Opcional: si quieres mostrar el ID en cada enlace



  return (
    <nav className="nav nav-tabs mb-4">
      {links.map(({ name, path, badge }) => (
        <NavLink
          key={path}
          to={path}
          end={path === ''}
          className={({ isActive }) =>
            `nav-link text-secondary ${isActive ? 'active' : ''}`
          }
          style={isActive => isActive ? { color: '#6c757d' } : {}}
        >
          {name}
          {badge ? (
            <span className="badge bg-danger ms-1">{badge}</span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}
