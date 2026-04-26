/**
 * @description Hook personalizado para la gestion de cuotas (vinculadas a tarifas).
 * Interactua con el store de Redux (quotaSlice) y la API del backend para
 * manejar CRUD de cuotas, carga por tarifa, busqueda y filtrado.
 *
 * Propiedades: quotas, activeQuota, filterQuotas, filteredListQuotas
 * Metodos: setActiveQuota, startSavingQuota, startLoadingQuotasByRate,
 * starLoadingQuotas, startDeleteQuota, startFindQuotas
 *
 * @returns {Object} Propiedades y metodos del hook de cuotas
 */
import { useDispatch, useSelector } from "react-redux"
import { clientsApi } from "../api";
import { onAddNewQuota, onDeleteQuota, onLoadQuota, onSetActiveQuota, onSetFilterQuota, onUpdateQuota } from "../store/rates/quotaSlice";
import { normalizeAllTextFields } from "../helpers/normalizeText";
import Swal from 'sweetalert2';

export const useQuotaStore = () => {

    const dispatch = useDispatch();
    const { quotas, activeQuota,filterQuotas, filteredListQuotas } = useSelector(state => state.quota);

    //cuota
    const setActiveQuota = (quotaData) => {
        dispatch(onSetActiveQuota(quotaData))
    }
     

    // Crear cuota 
    const startSavingQuota = async (quotaSave, isEditMode) => {
        try {
            const normalizedQuota = normalizeAllTextFields(quotaSave); //  normalizar todos los campos string
            if (isEditMode) {
                const { data } = await clientsApi.put(`/quotas/${quotaSave.idQuota}`, normalizedQuota);
                dispatch(onUpdateQuota(data));
                return;
            } else {
                const { data } = await clientsApi.post('/quotas', normalizedQuota);
                dispatch(onAddNewQuota(data));
            }
        } catch (error) {
            const msg = error?.response?.data?.msg || 'Error al guardar la cuota';
            Swal.fire('Error', msg, 'error');
        }
    }

    //Leer cuotas de una tarifa
    const startLoadingQuotasByRate = async (idRate) => {
        try {
            const { data } = await clientsApi.get(`/quotas/${idRate}`);
            dispatch(onLoadQuota(data.quotas));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las cuotas', 'error');
        }
    };
    //Lectura de cuotas
    const starLoadingQuotas = async () => {
        try {
            //const {data} = await axios.get('http://localhost:4001/api/store');
            const { data } = await clientsApi.get('/quotas');
            const quota = data.quotas;

            dispatch(onLoadQuota(quota));

        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las cuotas', 'error');
        }
    };
    const startDeleteQuota = async (quota) => {
        try {
                   await clientsApi.delete(`/quotas/${quota.idQuota}`);
                   dispatch(onDeleteQuota(quota));

               } catch (error) {
                   Swal.fire('Error', 'No se pudo eliminar la cuota', 'error');
               }
    }

     //Buscador producto
          // Filtrar labels Buscar...
          const startFindQuotas = (searchTerm) => async (dispatch) => {
            try {
              const { data } = await clientsApi.get('quotas');
              dispatch(onLoadQuota(data.quotas));
            } catch (error) {
              Swal.fire('Error', 'No se pudieron cargar las cuotas', 'error');
            }
            dispatch(onSetFilterQuota(searchTerm));
          };

    return {
        //*Propiedades
        quotas,
        activeQuota,
        filterQuotas,
        filteredListQuotas,


        //*Metodos
        setActiveQuota,
        startSavingQuota,
        startLoadingQuotasByRate,
        starLoadingQuotas,
        startDeleteQuota,
        startFindQuotas
    }

}