/**
 * @description Hook personalizado para la gestion de autenticacion y usuarios.
 * Interactua con el store de Redux (authSlice) y la API del backend para
 * manejar login, logout, registro, renovacion de token, CRUD de usuarios
 * y envio de email de recuperacion de contrasena.
 *
 * Propiedades expuestas:
 * - status: estado de autenticacion ('checking' | 'authenticated' | 'not-authenticated')
 * - user: datos del usuario logueado
 * - errorMessage: mensaje de error actual
 * - isAdmin: booleano que indica si el usuario es administrador
 * - users: lista de todos los usuarios
 * - activeUser: usuario seleccionado para editar/eliminar
 *
 * Metodos expuestos:
 * - startLogin({email, password}) - inicia sesion
 * - startRegister({name, email, password}) - registra un nuevo usuario
 * - checkAuthToken() - renueva el token JWT
 * - startLogout() - cierra sesion y limpia localStorage
 * - startClearError() - limpia el mensaje de error
 * - startLoadingtUsers() - carga la lista de usuarios
 * - starUpdateUser(userSave) - actualiza un usuario
 * - startDeleteUser(activeUser) - elimina un usuario
 * - setActiveUser(usersData) - establece el usuario activo
 * - starEmailSend(email) - envia email de recuperacion de contrasena
 *
 * @returns {Object} Propiedades y metodos del hook de autenticacion
 */

import { useDispatch, useSelector } from "react-redux"
import { onChecking, onLogin, onLogout, clearErrorMessage, onLoadUsers, onSetActiveUser, onUpdateUser, onRegisterUser, onEmailSend } from "../store/auth/authSlice";
import { clientsApi } from "../api";
import { onLogoutClients, onSetActiveClient } from "../store/clients/clientSlice";
import Swal from 'sweetalert2';

export const useAuthStore = () => {

    const { status, user, users, activeUser, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    //Proceso de login que llega al backend/ no es sincrono porque no se activa automaticamente

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());
        try {
            const { data } = await clientsApi.post('auth/login', { email, password });

            localStorage.setItem('token', data.token);      //Almacenar token. Token: Codigo para saber si el registro existe
            localStorage.setItem('token-init-date', new Date().getTime()); //Almacenar la fecha de creacion de token

            dispatch(onLogin({ name: data.name, uid: data.uid, isAdmin: data.isAdmin, email: data.email }));  //rescatamos name y uid
           //dejar activo usuario con activeUser

        } catch (error) {
            const msg =
                error?.response?.status === 401
                    ? 'Credenciales incorrectas'
                    : error?.response?.data?.msg || 'Error al conectar con el servidor';

            dispatch(onLogout(msg));
        }
    }

    const startRegister = async ({ name, email, password }) => {
       
        try {
            const { data } = await clientsApi.post('auth/register', { name, email, password });
            // No tocar localStorage ni onLogin
            dispatch(onRegisterUser({
                uid: data.uid,
                name: data.name,
                email: data.email,
                isAdmin: !!data.isAdmin,
            }));
            // Si quieres refrescar la lista de usuarios:
            await startLoadingtUsers();
        } catch (error) {
            const msg = error?.response?.data?.msg || 'Error al registrar usuario';
            Swal.fire('Error en registro', msg, 'error');
        }
    }

    //Eutentifica los datos del token
    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');    //Geto.token

        if (!token) return dispatch(onLogout());     //Si no hay token se deslogea

        try {
            const { data } = await clientsApi.get('auth/renew');
            localStorage.setItem('token', data.token);

            localStorage.setItem('token', data.token);      //Almacenar token. Token: Codigo para saber si el registro existe
            localStorage.setItem('token-init-date', new Date().getTime()); //Almacenar la fecha de creacion de token
            dispatch(onLogin({ name: data.name, uid: data.uid, isAdmin: data.isAdmin, email: data.email }));  //rescatamos name y uid

        } catch (error) {
            localStorage.clear(); //Limpiamos los token de localstore
            dispatch(onLogout());     //Si no hay token se deslogea

        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutClients());
        dispatch(onLogout());
    }

    const setActiveUser = (usersData) => {
        dispatch(onSetActiveUser(usersData));
    }


    const startLoadingtUsers = async () => {
        try {
            const { data } = await clientsApi.get('auth/users');
            const users = data.users;
            dispatch(onLoadUsers(users));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
    };

    const starUpdateUser = async (userSave) => {

        try {
            const { data } = await clientsApi.put(`auth/${activeUser.idUser}`, userSave);
            dispatch(onUpdateUser(data));
            dispatch(startLoadingtUsers());

        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
    };

    const startDeleteUser = async (activeUser) => {
        await clientsApi.delete(`auth/${activeUser.idUser}`);
        dispatch(onLoadUsers());
        dispatch(startLoadingtUsers());

    };

    const startClearError = () => {
        dispatch(clearErrorMessage());
    }

    const starEmailSend = async(email) => {

        try {
            await clientsApi.post('auth/resetPassword', {email: email.trim().toLowerCase()});
            dispatch(onEmailSend());
        } catch (error) {
            Swal.fire('Error', 'No se pudo enviar el email', 'error');
        }

    }

    return {
        //*Propiedades
        status,
        user,
        errorMessage,
        isAdmin: !!user?.isAdmin,   // <- aquí lo expones listo para usar
        users,
        activeUser,

        //*Métodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
        startClearError,
        startLoadingtUsers,
        starUpdateUser,
        startDeleteUser,
        setActiveUser,
        starEmailSend

    }
}