/**
 * @description Slice de Redux para la gestion de tarifas.
 * Maneja la lista de tarifas, tarifa activa y operaciones CRUD.
 *
 * Estado inicial:
 * - isLoadingRate: boolean - indicador de carga
 * - rates: Array - todas las tarifas
 * - activeRate: Object|null - tarifa seleccionada
 * @module rateSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const rateSlice = createSlice({
  name: 'rate',
  initialState:{
    isLoadingRate: false,
    rates: [],
    activeRate: null,
  },
  reducers: {
   
    //Seleccion tarifa
    onSetActiveRate: (state, {payload}) =>{
        state.activeRate = payload;
    },
    //Resetea tarifa
    onResetRate: (state) =>{
        state.activeRate = null;
        state.rates = [];
    },

    //Añadir tarifa
    onAddNewRate: (state, {payload}) =>{
        state.rates.push(payload);
        state.activeRate = payload;
    },

      // Modificar cliente por 
    onUpdateRate:(state, {payload})=>{
      state.rates = state.rates.map( rate =>{      //Nuevo array del evento
        if( rate.idRate === payload.idRate){
          return payload;
        }
        return rate;
      })   
    },
    //Leer categoria
    onLoadRate : (state, {payload}) =>{
        state.isLoadingRate = false;
        state.rates = payload;

         payload.forEach( rate =>{
        const exists = state.rates.some( dbRate => dbRate.id === rate.id);
        if(!exists){
          state.rates.push(rate)
        }
      })
    },
    onDeleteRate:(state, { payload }) =>{
      const idToDelete = payload?.idRate ?? state.activeRate?.idRate;
      if (idToDelete != null) {
        state.rates = state.rates.filter(rate => rate.idRate !== idToDelete);
      }
      state.activeRate = null;
    },

}
})
export const { 
    //*Metodos
    onSetActiveRate,
    onResetRate,
    onAddNewRate,
    onUpdateRate,
    onLoadRate,
    onDeleteRate
} = rateSlice.actions; //accion