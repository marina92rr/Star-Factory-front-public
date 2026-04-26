/**
 * @description Componente de fila de cliente en el listado principal.
 * Muestra la foto, nombre completo, etiquetas, ID, email y telefono del cliente.
 * Al hacer clic navega al detalle del cliente. Optimizado con React.memo.
 *
 * @param {Object} props
 * @param {Object} props.client - Datos del cliente (idClient, name, lastName, email, mainPhone)
 * @param {Function} props.onSelect - Callback que recibe el idClient al seleccionar
 * @returns {JSX.Element} Fila de cliente con informacion resumida
 */
import { memo } from 'react';
import { LabelClient } from './clientPage/LabelClient';
import userPhoto from '../../assets/user.png';

export const ClientItem = memo(({ client, onSelect }) => {
  const fullName = `${client.name} ${client.lastName}`;

  return (
    <div className="border p-4 rounded ">
      <div className="d-flex align-items-center gap-3">

        {/* Imagen */}
        <img
          src={userPhoto}
          className="rounded-circle"
          alt="Usuario"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />

        {/* Info del cliente */}
        <div className="d-flex flex-column ">

          {/* Nombre y etiquetas */}
          <div
            onMouseDown={() => onSelect(client.idClient)}
            className="fw-bold d-flex align-items-center gap-2"
            style={{ cursor: "pointer" }}
          >
            {fullName}
            <LabelClient idClient={client.idClient} />
          </div>

          {/* ID + email + teléfono */}
          <div className="d-flex flex-wrap text-secondary mt-1 gap-3 ps-1" style={{ fontSize: '0.9em' }}>
            <span>#{client.idClient}</span>
            {client.email && (
              <span className='d-flex align-items-center'>
                <i className="bi bi-envelope-fill me-1"></i>
                {client.email.toLowerCase()}
              </span>
            )}
            {client.mainPhone && (
              <span className='d-flex align-items-center'>
                <i className="bi bi-telephone-fill me-1"></i>
                {client.mainPhone}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
});
