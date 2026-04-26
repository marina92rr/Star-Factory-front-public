/**
 * @description Pagina de inicio de sesion (login).
 * Muestra un formulario con campos de email y contrasena.
 * Valida las credenciales contra el backend y redirige al usuario autenticado.
 * Muestra alertas de error con SweetAlert2 si las credenciales son incorrectas.
 * @returns {JSX.Element} Formulario de login centrado en pantalla
 */
import React, { useEffect } from 'react'
import { useAuthStore } from '../../hooks/useAuthStore'
import { useForm } from '../../hooks/useForm'
import Swal from 'sweetalert2'

const logingFormFields = {
    loginEmail: '',
    loginPassword: ''
}

export const LoginPage = () => {

    const { startLogin, errorMessage, startClearError } = useAuthStore();
    const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(logingFormFields);

    const loginSubmit = () => {
        event.preventDefault();
        startLogin({  
            email: loginEmail.trim().toLowerCase(), // Sin espacios y en minúsculas
            password: loginPassword
     });
    }

    useEffect(() => {
        if (errorMessage !== undefined) {
            Swal.fire('Error en la Autentificación', errorMessage, 'error');
            startClearError();
        };
    }, [errorMessage])

    return (
        <div className='container d-flex flex-column align-items-center justify-content-center' style={{ height: '100vh' }}>
            <div className='mb-4 text-center align-items-center'>
                <h1 >Login</h1>
            </div>
            
                <div className="col-4 border rounded p-3 bg-light">
                    
                    <form onSubmit={loginSubmit}>
                        <div className="form-group mb-3">
                            <label 
                                className="form-label"
                                htmlFor="loginEmail">Correo</label>
                            <input
                                type="text"
                                className="form-control"
                                name="loginEmail"
                                value={loginEmail}
                                onChange={onLoginInputChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label 
                                htmlFor="loginPassword"
                                className="form-label"
                            >Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                name="loginPassword"
                                value={loginPassword}
                                onChange={onLoginInputChange}
                            />
                        </div>
                        <div className="form-group mb-3 text-end">
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Login"
                            />
                        </div>
                    </form>

                </div>

            
        </div>
    )
}
