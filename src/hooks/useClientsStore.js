/**
 * @description Hook personalizado para la gestion de clientes.
 * Interactua con el store de Redux (clientSlice) y la API del backend para
 * manejar CRUD de clientes, busqueda/filtrado, paginacion, etiquetas de clientes,
 * filtrado por etiquetas y gestion de bajas (inmediatas y programadas).
 *
 * Propiedades expuestas:
 * - clients, clientsLimit, activeClient, filter, filteredList, totalPages
 * - isLoadingClients, allClientsLoaded, activeClientLabels
 * - filteredLabelsByClient, filteredClientsByLabel, scheduledCancellationClients, clientsName
 *
 * Metodos expuestos:
 * - setActiveClient, startClearingActiveClient, startResetClientsPage
 * - startSavingClient, starLoadingClients, starLoadingLimitPageClients
 * - getClientbyClientID, starLoadingClientByID, startDeleteClient
 * - startFilteringClients, startLoadingLabelsOfClient, startLoadingFilteredLabels
 * - filterClientsByLabels, clearFilter
 * - toggleClientStatusCancel, programClientCancellation, cancelClientScheduledCancellation
 * - loadClientsWithScheduledCancellation
 *
 * @returns {Object} Propiedades y metodos del hook de clientes
 */
import { useDispatch, useSelector } from "react-redux"
import {
  onAddNewClient,
  onLoadClientByID,
  onLoadClients,
  onLoadFilteredLabels,
  onLoadLabelsOfActiveClient,
  setFilteredClientsByLabel,
  clearFilteredClientsByLabel,
  onLoadLimitPageClients,
  onLoadScheduledCancellations,
  onSetActiveClient,
  onSetFilter,
  onToggleClientStatusCancel,
  onUpdateClient,
  onResetClientsPage,
  clearActiveClient,
  onDeleteClient,
  onLoadClientsName
} from "../store/clients/clientSlice";


import { clientsApi } from "../api";
import { useParams } from "react-router-dom";
import { normalizeAllTextFields } from "../helpers/normalizeText";
import Swal from 'sweetalert2';

export const useClientsStore = () => {

  const dispatch = useDispatch();
  const { clients, clientsLimit, activeClient, filter, filteredList, totalPages, isLoadingLabelsClient, filteredClientsByLabel, isLoadingClients, allClientsLoaded, activeClientLabels, scheduledCancellationClients, filteredLabels, clientsName } = useSelector(state => state.client);
  const { idClient } = useParams();
  const filteredLabelsByClient = useSelector(state => state.client.filteredLabelsByClient);



  //Activar cliente
  const setActiveClient = (clientsData) => {
    dispatch(onSetActiveClient(clientsData))
  }

  const startClearingActiveClient = () => {
    dispatch(clearActiveClient());
  };

  const startResetClientsPage = () => {
    dispatch(onResetClientsPage());
  };


  // Nuevo cliente 
  const startSavingClient = async (clientSave, isEditMode) => {
    try {
      const normalizedClient = normalizeAllTextFields(clientSave); //  normalizar todos los campos string
      if (isEditMode) {
        const { data } = await clientsApi.put(`/clients/${clientSave.idClient}`, normalizedClient);
        dispatch(onUpdateClient(data));
      } else {
        const { data } = await clientsApi.post('/clients', normalizedClient);
        dispatch(onAddNewClient(data));
      }
    } catch (error) {
      const msg = error?.response?.data?.msg || 'Error al guardar el cliente';
      Swal.fire('Error', msg, 'error');
    }
  }


  //Lectura de clientes
  const starLoadingClients = async () => {

    try {
      const { data } = await clientsApi.get('clients');
      const client = data.clients;

      dispatch(onLoadClients(client));

    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
    }
  }

  //Lectura de 30 clientes
  const starLoadingLimitPageClients = async (page = 1) => {
    try {
      const { data } = await clientsApi.get(`clients/limit?page=${page}`);
      const clients = data.clients;
      const totalPages = data.totalPages;

      dispatch(onLoadLimitPageClients({ clients, totalPages }));

    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
    }
  };

  //Lectura de cliente
  const getClientbyClientID = async (idClient) => {
    try {
      const { data } = await clientsApi.get(`clients/${idClient}`);
      const client = data.client;
      dispatch(onLoadClientsName(client));

    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar el cliente', 'error');
    }
  }

  //Lectura de cliente
  const starLoadingClientByID = async () => {
    try {
      const { data } = await clientsApi.get(`clients/${idClient}`);
      const client = data.client;
      dispatch(onLoadClientByID(client));

      await startLoadingLabelsOfClient(client.idClient);

    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar el cliente', 'error');
    }
  }


  // Filtrar clientes Buscar...
  const startFilteringClients = (searchTerm) => async (dispatch, getState) => {
    const { client } = getState();

    if (!client.allClientsLoaded) {
      try {
        const { data } = await clientsApi.get('clients');
        dispatch(onLoadClients(data.clients));
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
      }
    }

    dispatch(onSetFilter(searchTerm));
  };

  //-------Etiquetas------------
  // Cargar etiquetas de cliente
  const startLoadingLabelsOfClient = async (idClient) => {
    try {
      const { data } = await clientsApi.get(`clients/${idClient}/labels`);

      dispatch(onLoadLabelsOfActiveClient(data));
    } catch (error) {
      // Silencioso: las etiquetas del cliente se cargan en background
    }
  }

  const startLoadingFilteredLabels = async (idClient) => {
    try {
      const { data } = await clientsApi.get(`/clients/${idClient}/arraylabels`);
      dispatch(onLoadFilteredLabels({ idClient, labels: data.labels || [] }));
    } catch (err) {
      dispatch(onLoadFilteredLabels({ idClient, labels: [] }));
    }
  };

  const startDeleteClient = async (client) => {
    const target = client || activeClient;
    await clientsApi.delete(`/clients/${target.idClient}`);
    dispatch(onDeleteClient(target));
  }

  // Filtrar clientes por etiquetas
  const filterClientsByLabels = async (labelIds) => {
    try {
      // labelIds es un array de Number
      const { data } = await clientsApi.post('/clients/filterlabels', { labelIds });
      dispatch(setFilteredClientsByLabel(data));
    } catch (error) {
      Swal.fire('Error', 'No se pudieron filtrar los clientes', 'error');
      dispatch(setFilteredClientsByLabel([]));
    }
  };
  const clearFilter = () => {
    dispatch(clearFilteredClientsByLabel());
  };




  //-------Baja------------
  //Obtener clientes con baja programada
  const loadClientsWithScheduledCancellation = async () => {
    try {
      const { data } = await clientsApi.get(`clients/cancelScheduled`);
      dispatch(onLoadScheduledCancellations(data.clients));
    } catch (error) {
      Swal.fire('Error', 'No se pudieron obtener las bajas programadas', 'error');
    }
  };

  //Dar baja cliente
  const toggleClientStatusCancel = async (idClient, removeSales = false) => {
    try {
      const { data } = await clientsApi.patch(`clients/cancel/${idClient}`, { removeSales });
      dispatch(onToggleClientStatusCancel(data.client)); // recuerda: el backend devuelve `{ msg, client }`
    } catch (error) {
      const msg = error?.response?.data?.msg || 'Error al cambiar estado del cliente';
      Swal.fire('Error', msg, 'error');
    }
  };
  //Programar baja
  const programClientCancellation = async (idClient, cancelDate, removeSales = false) => {
    try {
      const { data } = await clientsApi.patch(`/clients/programcancel/${idClient}`, { cancelDate }, { removeSales });
      dispatch(onToggleClientStatusCancel(data.client)); // O solo data si no devuelves { client: ... }
    } catch (error) {
      const msg = error?.response?.data?.msg || 'Error al programar la baja';
      Swal.fire('Error', msg, 'error');
    }
  };

  const cancelClientScheduledCancellation = async (idClient) => {
    try {
      const { data } = await clientsApi.patch(`clients/cancelScheduled/${idClient}`);
      dispatch(onToggleClientStatusCancel(data.client));
    } catch (error) {
      const msg = error?.response?.data?.msg || 'Error al cancelar la baja programada';
      Swal.fire('Error', msg, 'error');
    }
  };


  return {
    //*propiedades
    clients,
    activeClient,
    startClearingActiveClient,
    filter,
    filteredList,
    isLoadingLabelsClient,
    isLoadingClients,
    allClientsLoaded,
    clientsLimit,
    scheduledCancellationClients,
    activeClientLabels,
    filteredLabels,
    filteredLabelsByClient,
    filteredClientsByLabel,
    totalPages,
    clientsName,

    //*Metodos
    //Client
    setActiveClient,
    startResetClientsPage,
    starLoadingClients,
    starLoadingLimitPageClients,
    getClientbyClientID,
    starLoadingClientByID,
    startSavingClient,
    startDeleteClient,
    startFilteringClients,
    toggleClientStatusCancel,
    programClientCancellation,
    cancelClientScheduledCancellation,
    loadClientsWithScheduledCancellation,
    startLoadingLabelsOfClient,
    startLoadingFilteredLabels,


    //Label
    filterClientsByLabels,
    clearFilter
  }

}
