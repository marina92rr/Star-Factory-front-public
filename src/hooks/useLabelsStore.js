/**
 * @description Hook personalizado para la gestion de etiquetas.
 * Interactua con el store de Redux (labelSlice) y la API del backend para
 * manejar CRUD de etiquetas, busqueda, asignacion a clientes y filtrado.
 *
 * Propiedades: labels, filter, filteredList, activeLabel, activeFilterLabels
 * Metodos: createLabelAndAssign, createLabelGlobal, starLoadingLabels,
 * setActiveLabel, startFilterLabels, startDeleteLabel, startFindLabels,
 * startActiveFilterLabels, setClearActiveFilterLabels, starLoadingClientsWithLabels,
 * startUpdateLabel
 *
 * @returns {Object} Propiedades y metodos del hook de etiquetas
 */

import { useDispatch, useSelector } from "react-redux";
import { addLabel, onDeleteLabel, onLoadLabels, onSetActiveLabel, onSetFilterLabel, onSetLabels, setActiveFilterLabels, clearActiveFilterLabels, onUpdateLabel } from "../store/label/labelSlice";
import { clientsApi } from "../api";
import { useParams } from "react-router-dom";
import { normalizeAllTextFields } from "../helpers/normalizeText";
import Swal from 'sweetalert2';

export const useLabelsStore = () => {
  const dispatch = useDispatch();
  const { labels, filter, filteredList, activeLabel, activeFilterLabels } = useSelector(state => state.labels);
  const { idClient } = useParams();

  //Activar cliente
  const setActiveLabel = (labelData) => {
    dispatch(onSetActiveLabel(labelData))
  }


  const starLoadingLabels = async () => {
    try {
      const { data } = await clientsApi.get('labels/countClients');
      dispatch(onLoadLabels(data.labels)); // ya traen memberCount
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las etiquetas', 'error');
    }
  }

  const createLabelGlobal = async ({ name, color }) => {
  try {
    const normalized = normalizeAllTextFields({ name, color });
    const { data } = await clientsApi.post('labels', normalized); // <-- endpoint global
    // Para mantener memberCount correcto, recarga la lista:
    await starLoadingLabels();
    return null;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.errors?.name) {
      return error.response.data.errors; // { name: { msg: '...' } }
    }
    return { general: { msg: 'No se pudo crear la etiqueta' } };
  }
};

  const starLoadingClientsWithLabels = async () => {
    try {
      const { data } = await clientsApi.get('labels/countClients');
      dispatch(onLoadLabels(data.labels)); // ya traen memberCount
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las etiquetas', 'error');
    }
  }


  const createLabelAndAssign = async (labelData, idClient) => {
    try {
      const normalizedLabelAssign = normalizeAllTextFields(labelData); //  normalizar todos los campos string

      const { data } = await clientsApi.post('/labels/assign', normalizedLabelAssign, idClient);
      dispatch(addLabel(data.label));
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.errors?.name) {
        return error.response.data.errors; // devolvemos el objeto de errores
      }
      return { general: { msg: 'Error inesperado' } };

    }
  };

  const startFilterLabels = async () => {
    if (!idClient) return;
    try {
      const { data } = await clientsApi.get(`/clients/${idClient}/labels`);
      dispatch(onSetLabels(data.labels || []));
    } catch (error) {
      // Silencioso: filtrado de labels en background
    }
  };

  //Guardar etiquetas activas
  const startActiveFilterLabels = (labels) => {
    dispatch(setActiveFilterLabels(labels));
  }

  //Limpiar etiquetas activas
  const setClearActiveFilterLabels = (labels) => {
    dispatch(clearActiveFilterLabels(labels));
  };

  // Filtrar labels Buscar...
  const startFindLabels = (searchTerm) => async (dispatch, getState) => {
    //const { label } = getState();
    try {
      const { data } = await clientsApi.get('labels');
      dispatch(onLoadLabels(data.labels));
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las etiquetas', 'error');
    }
    dispatch(onSetFilterLabel(searchTerm));
  };
    // ELIMINAR etiqueta (y desasignarla en todos los clientes en el backend)
  const startDeleteLabel = async (label) => {
    try {
      await clientsApi.delete(`/labels/${label.idLabel}`);
      dispatch(onDeleteLabel({ idLabel: label.idLabel }));
      // No es necesario recargar para counts de otras etiquetas.
      // Si quieres, puedes llamar a await starLoadingLabels();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la etiqueta', 'error');
    }
  };

   // EDITAR etiqueta (NO usa idClient)
  const startUpdateLabel = async ({ idLabel, name, color, ...rest }) => {
    try {
      // No permitimos cambiar idLabel desde aquí
      const payload = { name, color, ...rest };
      if (payload.idLabel !== undefined) delete payload.idLabel;

      const { data } = await clientsApi.put(`/labels/all/${idLabel}`, payload);
      // fusiona en el reducer para no perder memberCount
      dispatch(onUpdateLabel(data.label));
      return null;
    } catch (error) {
      return { general: { msg: 'No se pudo actualizar la etiqueta' } };
    }
  };


  return {
    //*Propiedades
    labels,
    filter,
    filteredList,
    activeLabel,
    activeFilterLabels,
    //*Metodos

    createLabelAndAssign,
    createLabelGlobal,
    starLoadingLabels,
    setActiveLabel,
    startFilterLabels,
    startDeleteLabel,
    startFindLabels,
    startActiveFilterLabels,
    setClearActiveFilterLabels,
    starLoadingClientsWithLabels,
    startUpdateLabel

  };
};