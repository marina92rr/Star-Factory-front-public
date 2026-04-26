/**
 * @description Slice de Redux para la gestion de suscripciones (autocompras) de clientes.
 * Maneja la lista de suscripciones, suscripcion activa y operaciones CRUD.
 *
 * Estado inicial:
 * - activeSuscriptionClient: Object|null - suscripcion seleccionada
 * - suscriptionClients: Array - suscripciones del cliente
 * - isLoadingSuscription: boolean - indicador de carga
 * @module suscriptionClientSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const suscriptionClientSlice = createSlice({
  name: 'suscriptionClient',
  initialState: {
    activeSuscriptionClient: null,
    suscriptionClients: [], // registros guardados
    isLoadingSuscription: false,
  },
  reducers: {
    //Seleccion categoria
    onSetActiveSuscriptionClient: (state, { payload }) => {
      state.activeSuscriptionClient = payload;
    },

    onStartLoadingSuscriptions: (state) => {
      state.isLoadingSuscription = true;
    },

     // Modificar suscripcion por idSuscripcion
    onUpdateSuscriptionClient:(state, {payload})=>{
      state.suscriptionClients = state.suscriptionClients.map( suscription =>{      //Nuevo array del evento
        if( suscription.idSuscriptionClient === payload.idSuscriptionClient){
          return payload;
        }
        return suscription;
      })   
    },

    onDeleteSuscriptionClient: (state, { payload }) => {
      const idToDelete = payload?.idSuscriptionClient ?? state.activeSuscriptionClient?.idSuscriptionClient;
      if (idToDelete != null) {
        state.suscriptionClients = state.suscriptionClients.filter(
          (suscriptionClient) => suscriptionClient.idSuscriptionClient !== idToDelete
        );
      }
      state.activeSuscriptionClient = null;
    },

    onLoadSuscriptionClient: (state, { payload }) => {
      state.isLoadingSuscription = false;
      state.suscriptionClients = payload; // ahora sí es un array directamente
    }

  },
})

export const { 
  onSetActiveSuscriptionClient, 
  onUpdateSuscriptionClient,
  onDeleteSuscriptionClient, 
  onLoadSuscriptionClient, 
  onStartLoadingSuscriptions 
} = suscriptionClientSlice.actions; //accion