/**
 * @description Componente que muestra el nombre de un cliente a partir de su ID.
 * Carga el nombre del cliente desde la API si no esta en cache y lo renderiza
 * como un enlace clickeable que navega a la pagina del cliente.
 *
 * @param {Object} props
 * @param {string|number} props.idClient - ID del cliente a mostrar
 * @returns {JSX.Element} Nombre del cliente como enlace de navegacion
 */
import React, { useEffect } from 'react'
import { useClientsStore } from '../../../../hooks/useClientsStore'
import { useNavigate } from 'react-router-dom';

export const ClientName = ({idClient}) => {



  const { getClientbyClientID, clientsName } = useClientsStore();
  const navigate = useNavigate();


  useEffect(() => {
    getClientbyClientID(idClient)
  }, [idClient])         // ⬅️ añade la dep. recomendada


  const client = clientsName[idClient];

     // Cuando seleccionas un cliente, navegamos a /clients/:ID
  const handleSelect = () => {
    if (client?.idClient) navigate(`/${client.idClient}`)
   
  };

  return (
    
    <a type='button' onClick={handleSelect} className='btn p-0 border-0 bg-transparent text-primary'> {client?.name} {client?.lastName} </a>
    
  )
}
