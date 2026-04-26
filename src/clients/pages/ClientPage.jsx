/**
 * @description Pagina de detalle de un cliente individual.
 * Muestra la informacion completa del cliente (foto, nombre, contacto, estado),
 * sus etiquetas asociadas, y un menu de navegacion con subrutas (overview, reservations,
 * sales, addSales, profile). Permite crear nueva venta, gestionar suscripciones,
 * dar de baja al cliente y generar facturas.
 * @returns {JSX.Element} Vista de detalle del cliente con subrutas anidadas
 */
import { act, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useClientsStore } from '../../hooks/useClientsStore';
import { MenuClient } from '../components/clientPage/MenuClient';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { LabelsModal } from '../components/label/LabelsModal'
import { Labels } from '../components/label/Labels';
import { SubscribeClient } from '../components/clientPage/SubscribeClient';
import { getClientStatus } from '../../helpers/getClientStatus';
import { isColorDark } from '../../helpers/isColorDark';
import userPhoto from '../../assets/user.png';
import { DeleteClient } from '../components/clientPage/DeleteClient';
import { CancelSuscribeClientModal } from '../components/clientPage/CancelSuscribeClientModal';
import { ClientBill } from '../components/ClientBill';
import { ClientModalBill } from '../components/ClientModalBill';



export const ClientPage = () => {
  // ... dentro de ClientPage:
  const { idClient } = useParams();


  const { starLoadingClientByID, activeClient, activeClientLabels } = useClientsStore();
  const { isImmediateCancellation, isScheduledCancellation, cancelDate } = getClientStatus(activeClient?.dateCancellation);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idClient) {
      setLoading(true);
      starLoadingClientByID().finally(() => setLoading(false));
    }
  }, [idClient]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!activeClient) {
    return <p>Cliente no encontrado</p>;
  }

  const handleSelect = idClient => {
    navigate('addSales');
  };

  return (
    <div style={{ marginTop: '100px' }}>

      <div className='m-5 slide-in-up'> {/* O podrías usar 'zoom-in', 'flip-in-x', etc. */}
        <div className='d-flex align-items-center gap-3 my-4 ' >

          {/* Imagen */}
          <img
            src={userPhoto}
            className="rounded-circle mt-1"
            alt="Usuario"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />

          {/* Info general */}
          <div className="d-flex flex-column">

            {/* Nombre + ID */}
            <div className="d-flex align-items-center flex-wrap">
              <h1 className='mb-1 me-2'>
                {activeClient.name} {activeClient.lastName}
              </h1>
              <span className="text-secondary" style={{ fontSize: '2rem' }}>
                #{activeClient.idClient}
              </span>
            </div>

            {/* Email + Teléfono */}
            <div className="d-flex align-items-center flex-wrap gap-3 mt-1">
              {activeClient.email && (
                <div className="d-flex align-items-center">
                  <i className="bi bi-envelope-fill me-1 text-secondary"></i>
                  <button type="button" className="btn btn-link p-0 m-0 text-decoration-none">
                    {activeClient.email.toLowerCase()}
                  </button>
                </div>
              )}

              {activeClient.mainPhone && (
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill me-1 text-secondary"></i>
                  <button type="button" className="btn btn-link p-0 m-0 text-decoration-none">
                    
                    {activeClient.whatsappPhone ? (
                      <a
                          href={`whatsapp://send?phone=${activeClient.whatsappPhone}&text=${encodeURIComponent(`Hola soy StarFactory`)}`}
                      >
                        {activeClient.whatsappPhone}
                      </a>
                    ) : (
                       activeClient.mainPhone
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estado de cancelación */}
        <div className='w-100 d-flex'>
          {isImmediateCancellation &&
            <span className="badge ms-auto bg-danger" style={{ fontSize: '0.75rem', padding: '5px 10px', borderRadius: '12px', lineHeight: '1.2', fontWeight: 600 }}>
              DE BAJA
            </span>}
          {isScheduledCancellation &&
            <p className="text-secondary rounded ms-auto" style={{ fontSize: '0.75rem', padding: '5px 10px', borderRadius: '12px', lineHeight: '1.2', fontWeight: 600 }}>
              Baja programada: {cancelDate.toLocaleDateString()}
            </p>}
        </div>

        {/* Etiquetas y acciones */}
        <div className="d-flex justify-content-between align-items-start flex-wrap mt-2">

          {/* IZQUIERDA: Etiquetas */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <LabelsModal idClient={activeClient.idClient} />
            <Labels idClient={activeClient.idClient} />
            <ul className="d-flex gap-2 list-unstyled m-0 p-0">
              {activeClientLabels.map(label => {
                const isDark = isColorDark(label.color);
                const textColor = isDark ? '#fff' : '#222';
                return (
                  <li key={label.idLabel}>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: label.color,
                        color: textColor,
                        fontSize: '0.75rem',
                        padding: '5px 10px',
                        minWidth: 'fit-content',
                        letterSpacing: '0.01em',
                        borderRadius: '12px',
                        lineHeight: '1.2',
                        marginRight: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {label.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* DERECHA: Botones de acción */}
          <div className="d-flex gap-2 mt-2 mt-lg-0 align-items-center">
            <ClientBill idClient={activeClient.idClient} />
            <ClientModalBill/>

            {!isImmediateCancellation ? (
              <button
                className="btn btn-success"
                style={{ background: '#38b647', color: 'white' }}
                onClick={() => handleSelect(activeClient.idClient)}>
                Nueva venta
              </button>
              
            ) : (
              <button className="btn btn-success" disabled>
                Nueva venta
              </button>
              
            )}
            <CancelSuscribeClientModal idClient={activeClient.idClient} />
            <SubscribeClient idClient={activeClient.idClient} />
            {!isImmediateCancellation ? (
              <></>
            ) : (
              <DeleteClient />
            )}

          </div>

        </div>

        <MenuClient />
        <Outlet />


      </div>


    </div>
  );
}
