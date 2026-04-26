import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useClientsStore } from '../../hooks/useClientsStore';
import { useRateStore } from '../../hooks/useRateStore';
import { useCategoryStore } from '../../hooks/useCategoryStore';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../hooks/useAuthStore';
import React, { useEffect } from 'react';

// Actualización de enlaces de navegación.  Se añade una entrada para el
// resumen mensual de ventas.
const links = [
  { name: 'Clientes', path: '/' },
  { name: 'Tienda', path: '/store' },
  { name: 'Tarifas', path: '/rates' },
  { name: 'Etiquetas', path: '/labels' },
  { name: 'Contabilidad', path: '/accounting' },

];

//Si es administrador, verá el dashboard
const Dashboard = [
  { name: 'Dashboard', path: '/monthly-summary' },
];

//Si es administrador, verá el registro de usuarios
const registers = [
  { name: 'Registrar usuario', path: '/register' },
  { name: 'Backup', path: '/admin/backups' }
]

export const Sidebar = React.memo(() => {
  const dispatch = useDispatch();
  const { startResetClientsPage } = useClientsStore();
  const { startResetRatesPage } = useRateStore();
  const { startResetStorePage } = useCategoryStore();

  const { status, user } = useAuthStore();
  const isAdmin = !!user?.isAdmin; // <- fuerza booleano


  useEffect(() => {
  }, [status, user]);


  return (
      <div
        className='bg-light mt-5 d-flex flex-column'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '180px',
          height: '100vh',
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        {/* ----------------------Logo + enlaces de navegación----------------------- */}
        <div className='text-center pt-5 p-3'>
          <img
            src={logo}
            alt='Star Factory Logo'
            style={{ width: '100px', height: 'auto' }}
          />
        </div>

        {/* ----------------------Mensualidad---------------------- */}

        {status !== 'checking' && isAdmin && (
          <div className='mt-5' >
            <nav>
              {Dashboard.map((Dashboard) => (
                <NavLink
                  key={Dashboard.path}
                  to={Dashboard.path}
                  style={{ textDecoration: 'none' }}
                  onClick={() => {

                  }}
                >
                  {({ isActive }) => (
                    <div
                      className='p-3 '
                      style={{ background: isActive ? '#007bff' : 'none', color: isActive ? '#ffffff' : '#000000' }}
                    >
                      <span>{Dashboard.name}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )
        }

        <nav>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={{ textDecoration: 'none' }}
              onClick={() => {
                if (link.name === 'Clientes') {
                  dispatch(startResetClientsPage());
                }
                if (link.name === 'Tienda') {
                  dispatch(startResetStorePage());
                }
                if (link.name === 'Tarifas') {
                  dispatch(startResetRatesPage());
                }
                if (link.name === 'Contabilidad') {
                  localStorage.removeItem('accounting.selectedDate'); // Resetea la fecha al entrar en contabilidad
                }
              }}
            >
              {({ isActive }) => (
                <div
                  className='p-3'
                  style={{ background: isActive ? '#007bff' : 'none', color: isActive ? '#ffffff' : '#000000' }}
                >
                  <span>{link.name}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ----------------------Registro usuario---------------------- */}

        {status !== 'checking' && isAdmin && (
          <div className='mt-auto mb-5' >
            <nav>
              {registers.map((register) => (
                <NavLink
                  key={register.path}
                  to={register.path}
                  style={{ textDecoration: 'none' }}
                  onClick={() => {

                  }}
                >
                  {({ isActive }) => (
                    <div
                      className='p-3 mb-5'
                      style={{ background: isActive ? '#007bff' : 'none', color: isActive ? '#ffffff' : '#000000' }}
                    >
                      <span>{register.name}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )
        }



      </div>
  );
});

