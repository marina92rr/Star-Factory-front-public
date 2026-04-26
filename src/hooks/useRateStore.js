/**
 * @description Hook personalizado para la gestion de tarifas.
 * Interactua con el store de Redux (rateSlice) y la API del backend para
 * manejar CRUD de tarifas y reseteo de pagina de tarifas.
 *
 * Propiedades: rates, activeRate
 * Metodos: setActiveRate, startResetRatesPage, startSavingRate,
 * starLoadingRates, startDeleteRate
 *
 * @returns {Object} Propiedades y metodos del hook de tarifas
 */
import { useDispatch, useSelector } from "react-redux"
import { clientsApi } from "../api";
import { onAddNewRate, onDeleteRate, onLoadRate, onResetRate, onSetActiveRate, onUpdateRate } from "../store/rates/rateSlice";

import { normalizeAllTextFields } from "../helpers/normalizeText";
import { onResetQuota } from "../store/rates/quotaSlice";
import Swal from 'sweetalert2';

export const useRateStore = () => {

    const dispatch = useDispatch();
    const { rates, activeRate } = useSelector(state => state.rate);



    const setActiveRate = (rateData) => {
        dispatch(onSetActiveRate(rateData))
    }

    const startResetRatesPage = () => {
        dispatch(onResetRate());
        dispatch(onResetQuota());
    
    }


    // Nuevo cliente 
    const startSavingRate = async (rateSave, isEditMode) => {
        try {
            const normalizedRate = normalizeAllTextFields(rateSave); //  normalizar todos los campos string

            if (isEditMode) {
                await clientsApi.put(`/rates/${normalizedRate.idRate}`, normalizedRate);
                dispatch(onUpdateRate(rateSave));
                return;
            }
            await clientsApi.post('rates', normalizedRate);
            dispatch(onAddNewRate(rateSave));

        } catch (error) {
            const msg = error?.response?.data?.msg || 'Error al guardar la tarifa';
            Swal.fire('Error', msg, 'error');
        }
    }

    //Lectura de categorias
    const starLoadingRates = async () => {
        try {
            const { data } = await clientsApi.get('rates');
            const rate = data.rates;

            dispatch(onLoadRate(rate));

        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las tarifas', 'error');
        }
    };

    const startDeleteRate = async (rate) => {
        const target = rate || activeRate;
        await clientsApi.delete(`/rates/${target.idRate}`);
        dispatch(onDeleteRate(target));
    }

    return {
        //*Propiedades
        rates,
        activeRate,

        //*Metodos
        setActiveRate,
        startResetRatesPage,
        startSavingRate,
        starLoadingRates,
        startDeleteRate
    }

}