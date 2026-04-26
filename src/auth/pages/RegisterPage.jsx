import { useEffect, useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { useAuthStore } from '../../hooks/useAuthStore'
import Swal from 'sweetalert2';
import { UserDelete } from '../components/UserDelete';
import { UserEdit } from '../components/UserEdit';
import { UserEditModal } from '../components/UserEditModal';
import { useDispatch } from 'react-redux';



const registerFormFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPassword2: ''
}



export const RegisterPage = () => {

    const { startRegister, errorMessage, startLoadingtUsers, users } = useAuthStore();
    const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange: onRegisterInputChange, onResetForm } = useForm(registerFormFields);

    const registerSubmit = () => {
        event.preventDefault();

        if (registerPassword !== registerPassword2) {
            Swal.fire(' Error en registro', 'Las contraseñas no son iguales', 'error');
            return;
        }

        startRegister({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
        });

       onResetForm();
    }

    // Opcional: mostrar error del backend
    useEffect(() => {
        
        if (errorMessage) {
            Swal.fire('Error', errorMessage, 'error');
        }
        startLoadingtUsers();
    }, [errorMessage]);

    return (
        <div className='m-5 align-items-center  d-flex flex-column justify-content-center'>
            <div className='pt-5 pb-3'>
                <h1 className='mb-4'>Registrar Usuario</h1>
            </div>

            <div className="col-3 border rounded p-4 bg-light">

                <form onSubmit={registerSubmit}>
                    <div className="form-group mb-2">
                        <label
                            
                            htmlFor="registerName"
                            className="form-label">Nombre:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name='registerName'
                            value={registerName}
                            onChange={onRegisterInputChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label
                            htmlFor="registerEmail"
                            className="form-label">Correo:
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            name='registerEmail'
                            value={registerEmail}
                            onChange={onRegisterInputChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label
                            htmlFor="registerPassword"
                            className="form-label">Contraseña:
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name='registerPassword'
                            value={registerPassword}
                            onChange={onRegisterInputChange}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label
                            htmlFor="registerPassword2"
                            className="form-label">Repita la contraseña:
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name='registerPassword2'
                            value={registerPassword2}
                            onChange={onRegisterInputChange}
                        />
                    </div>

                    <div className="text-end mb-3">
                        <input
                            type="submit"
                            className="btn btn-primary"
                            value="Crear cuenta" />
                    </div>
                </form>
            </div>
            <hr />
            <div className='col-12 mt-5' >
                <div className='border bg-light rounded-top  d-flex justify-content-between align-items-center p-2'>
                    <h3 className='text-muted text-start'>Usuarios</h3>
                </div>

                <table className="table border">
                    <thead >
                        <tr >
                            <th scope='col' className="p-3 text-start">Nombre</th>
                            <th scope='col' className="p-3 text-start">Correo</th>
                            <th scope='col' className="p-3 text-start">Administrador</th>
                            <th scope='col' className="p-3 text-start">Editar/ borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (

                            <tr>
                                <td colSpan={5} className="text-muted">No hay usuarios registrados</td>
                            </tr>
                        ) : (
                            users.map((user, i) => {
                                return (

                                    <tr key={i}>
                                        <td className=' p-3 text-start'>{user.name}</td>
                                        <td className='p-3 text-start'>{user.email}</td>
                                        <td className='p-3 text-start'>
                                            {user.isAdmin === true ? 'Sí' : 'No'}
                                        </td>
                                        <td >
                                            <div className='d-flex justify-content-center align-items-center gap-2'>
                                                <UserEdit user={user} />
                                                <UserEditModal />
                                                <UserDelete user={user} />
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>

            </div>
        </div>

    )
}
export default RegisterPage;
