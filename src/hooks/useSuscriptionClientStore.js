/**
 * @description Hook personalizado para la gestion de suscripciones (autocompras) de clientes.
 * Interactua con el store de Redux (suscriptionClientSlice) y la API del backend para
 * manejar carga, edicion y eliminacion de suscripciones.
 *
 * Propiedades: suscriptionClients, activeSuscriptionClient, isLoadingSuscription
 * Metodos: setActiveSuscriptionClient, startLoadingSuscriptionsByClient,
 * startDeleteSuscriptionClient, startUpdateSuscription
 *
 * @returns {Object} Propiedades y metodos del hook de suscripciones
 */
import { useDispatch, useSelector } from "react-redux"
import { clientsApi } from "../api";
import { onDeleteSuscriptionClient, onLoadSuscriptionClient, onStartLoadingSuscriptions, onSetActiveSuscriptionClient, onUpdateSuscriptionClient } from '../store/sales/suscriptionClientSlice';
import { normalizeAllTextFields } from '../helpers/normalizeText';
import Swal from 'sweetalert2';

export const useSuscriptionClientStore = () => {

  const dispatch = useDispatch();
  const { suscriptionClients, activeSuscriptionClient, isLoadingSuscription } = useSelector(state => state.suscriptionClient);


  const setActiveSuscriptionClient = (suscriptionClientData) => {
    dispatch(onSetActiveSuscriptionClient(suscriptionClientData))
  }

  const startLoadingSuscriptionsByClient = async (idClient) => {
    dispatch(onStartLoadingSuscriptions());

    try {
      const { data } = await clientsApi.get(`/suscriptions/${idClient}`);
      dispatch(onLoadSuscriptionClient(data.suscriptions));
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las suscripciones', 'error');
      dispatch(onLoadSuscriptionClient([]));
    }
  };

  //Actualizar suscripción
const startUpdateSuscription = async (suscription) => {
  try {
    const p = normalizeAllTextFields(suscription);
    const { data } = await clientsApi.put(`/suscriptions/${p.idSuscriptionClient}`, p);
    const updated = data?.suscription ?? data ?? p;
    dispatch(onUpdateSuscriptionClient(updated));
    return updated;
  } catch (e) {
    Swal.fire('Error', 'No se pudo actualizar la suscripción', 'error');
    throw e;
  }
};


  const startDeleteSuscriptionClient = async (suscription) => {
    try {
      await clientsApi.delete(`/suscriptions/${suscription.idSuscriptionClient}`);
      dispatch(onDeleteSuscriptionClient(suscription))
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar la suscripción', 'error');
    }
  }


  return {
    //* Propiedades
    suscriptionClients,
    activeSuscriptionClient,
    isLoadingSuscription,

    //* Métodos
    setActiveSuscriptionClient,
    startLoadingSuscriptionsByClient,
    startDeleteSuscriptionClient,
    startUpdateSuscription
  };


}
