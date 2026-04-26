/**
 * @description Slice de Redux para la gestion de autenticacion y usuarios.
 * Maneja el estado de login/logout, registro de usuarios, lista de usuarios,
 * usuario activo, mensajes de error y confirmacion de email.
 *
 * Estado inicial:
 * - status: 'checking' | 'authenticated' | 'not-authenticated'
 * - user: {name, uid, isAdmin, email} - usuario logueado
 * - users: Array - lista de todos los usuarios del sistema
 * - activeUser: Object|null - usuario seleccionado para editar/eliminar
 * - registerUser: Object - datos del ultimo usuario registrado
 * - registerStatus: 'not-success' | 'success'
 * - errorMessage: string|undefined - mensaje de error de autenticacion
 * - emailConfirmation: 'not-sent' | 'sent' | 'verified'
 * @module authSlice
 */

import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking',     //'authenticated' or 'not-authenticated'
    user: { name: null, uid: null, isAdmin: false, email: null },
    isLoadingUser: false,
    activeUser: null,
    users: [],
    registerUser: { name: null, uid: null, isAdmin: false },
    registerStatus: 'not-success',
    errorMessage: undefined,

    // confirmacion email
    isEmailConfirmed: false,
    emailConfirmation: 'not-sent', // 'not-sent' | 'sent' | 'verified'
  },
  reducers: {

    onSetActiveUser:(state,{payload}) => { 
      state.activeUser = payload 
    },

    //Estado de confirmacion de authenti
    onChecking: (state) => {
      state.status = 'checking';
      state.errorMessage = undefined;
    },

    onLogin: (state, { payload }) => {
      state.status = 'authenticated';
      state.user = {
        name: payload.name,
        uid: payload.uid,
        email: payload.email,
        isAdmin: !!payload.isAdmin, // <- fuerza booleano
      };
      state.errorMessage = undefined;
    },

    onLogout: (state, { payload }) => {
      state.status = 'not-authenticated';
      state.user = { name: null, uid: null, isAdmin: false };
      state.errorMessage = payload;
    },

    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },


    onRegisterUser: (state, { payload }) => {
      state.registerUser = {
        name: payload.name,
        uid: payload.uid,
        isAdmin: !!payload.isAdmin,
      };
      state.registerStatus = 'success';
    },


    //Lectura clientes
    onLoadUsers: (state, { payload = [] }) => {
      state.isLoadingUser = false,

        state.users = payload;
      payload.forEach(user => {
        const exists = state.users.some(dbUser => dbUser.idUser === user.idUser);
        if (!exists) {
          state.users.push(user)
        }
      })
    },

  

    // Modificar usuario por ID
    onUpdateUser: (state, { payload }) => {
      state.users = state.users.map(user => {      //Nuevo array del usuario
        if (user.idUser === payload.idUser) {
          return payload;
        }
        return user;
      })
    },

    onDeleteUser: (state) => {
      if (state.activeUser) {
        state.users = state.users.filter(user => user.idUser !== state.activeUser.idUser);
        state.activeUser = null;
      }
    },

    onEmailSend:(state, {payload}) =>{
      state.emailConfirmation = payload;
    }

  },
})
export const {
  onChecking,
  onLogin,
  onLogout,
  clearErrorMessage,
  onSetActiveUser,
  onLoadUsers,
  onUpdateUser,
  onDeleteUser,
  onRegisterUser,
  onEmailSend,

  
} = authSlice.actions; //accion