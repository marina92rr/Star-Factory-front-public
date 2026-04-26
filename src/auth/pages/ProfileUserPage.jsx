
import React, { useEffect } from 'react'
import { useAuthStore } from '../../hooks/useAuthStore'


export const ProfileUserPage = () => {

    const { user } = useAuthStore();


    useEffect(() => {
        
    }, []);

    return (
        <div className='m-5 slide-in-up'>
            {/* Perfil usuario */}
            <div className='pt-5 align-items-center'>
                <h1>Perfil Usuario</h1>
            </div>
            <h5 className='text-muted text-start'>Información básica</h5>

            <div className='col-3 p-4 mt-3'>
                <table className='table'>
 
                    <tbody>
                        <tr >
                            <th scope="row" className='p-3'>Nombre</th>
                            <td className='p-3'>{user.name}</td>
                           
                        </tr>
                        <tr>
                            <th scope="row" className='p-3'>Correo Electrónico</th>
                            <td className='p-3'>{user.email}</td>
                           
                        </tr>
                        <tr>
                            <th scope="row" className='p-3'>administrador</th>
                            <td className='p-3'>{user.isAdmin === true ? 'Sí' : 'No'}</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>
    )
}
export default ProfileUserPage;
