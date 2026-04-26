/**
 * @description Slice de Redux para la gestion de cuotas (dentro de tarifas).
 * Maneja la lista de cuotas, cuota activa, filtro de busqueda y operaciones CRUD.
 *
 * Estado inicial:
 * - isLoadingQuota: boolean - indicador de carga
 * - quotas: Array - todas las cuotas
 * - filterQuotas: string - termino de busqueda
 * - filteredListQuotas: Array - cuotas filtradas
 * - activeQuota: Object|null - cuota seleccionada
 * @module quotaSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const quotaSlice = createSlice({
  name: 'quota',
  initialState:{
    isLoadingQuota: false,
    quotas: [],
    filterQuotas: '',
    filteredListQuotas :[],
    activeQuota: null,
  },
  reducers: {
   
    //Seleccion Cuota
    onSetActiveQuota: (state, {payload}) =>{
        state.activeQuota = payload;
    },
    //Resetea cuota
    onResetQuota: (state) =>{
        state.activeQuota = null;
        state.quotas = [];
    },


    //Añadir cuota
    onAddNewQuota: (state, {payload}) =>{
        state.quotas.push(payload);
        state.activeQuota = null;
    },
      // Modificar cliente por 
    onUpdateQuota:(state, {payload})=>{
      state.quotas = state.quotas.map( quota =>{      //Nuevo array del evento
        if( quota.idQuota === payload.idQuota){
          return payload;
        }
        return quota;
      })   
    },

    //Leer cuota
    onLoadQuota: (state, { payload }) => {
      state.isLoadingQuota = false;
      state.quotas = payload; // ahora sí es un array directamente
    },

    onDeleteQuota:(state, { payload }) =>{
      const idToDelete = payload?.idQuota ?? state.activeQuota?.idQuota;
      if (idToDelete != null) {
        state.quotas = state.quotas.filter(quota => quota.idQuota !== idToDelete);
      }
      state.activeQuota = null;
    },

    //Filtrar productos Busqueda
    onSetFilterQuota: (state, action) => {
      state.filterQuotas = action.payload;

      const normalize = str => (str || '')
        .normalize('NFD')                         // Quita tildes
        .replace(/[\u0300-\u036f]/g, '')          // Elimina marcas de acento
        .toUpperCase()

      const filter = normalize(state.filterQuotas);
      // Filtrar labels
      state.filteredListQuotas = state.quotas.filter(quota => {
        const fullName = normalize(`${quota.name}`);
        return fullName.includes(filter);
      });
    },

}
})
export const { 
    //*Metodos
  onSetActiveQuota,
  onResetQuota,
  onAddNewQuota,
  onUpdateQuota,
  onLoadQuota,
  onDeleteQuota,
  onSetFilterQuota

   
} = quotaSlice.actions; //accion