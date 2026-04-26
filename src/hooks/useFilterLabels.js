/**
 * @description Hook personalizado para cargar las etiquetas asociadas a un cliente.
 * Realiza una peticion a la API al montar el componente y devuelve el array de etiquetas.
 *
 * @param {Object} params - Parametros del hook
 * @param {string|number} params.idClient - ID del cliente cuyas etiquetas se quieren cargar
 * @returns {Array} Array de etiquetas del cliente
 */

import React, { useState, useEffect } from 'react'
import { clientsApi } from '../api'

  export const useFilterLabels = ({idClient}) => {
 // src/components/clientPage/LabelClient.jsx

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    clientsApi.get(`/clients/${idClient}/arraylabels`)
      .then(({ data }) => {
        setLabels(data.labels || [])
      })
      .catch(err => {
        console.error('Error al cargar labels:', err)
        setLabels([])
      })
  }, [])

  return labels;

}
  

