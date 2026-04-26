/**
 * @description Componente para reenviar email de recuperacion de contrasena.
 * Permite al usuario solicitar un enlace de restablecimiento de contrasena.
 * @returns {JSX.Element} Boton/formulario de reenvio de contrasena
 */
import React, { useState } from 'react'
import { useAuthStore } from '../../hooks/useAuthStore';
import { useUiStore } from '../../hooks/useUiStore';

export const ResendPassword= () => {

  const {openPasswordUserModal} = useUiStore();
 


  const handleClickNew = () => {
  openPasswordUserModal();
  }

  

  return (
    <div>
        <button 
          className='btn btn-link custom-btn'
          onClick={handleClickNew}>
            Olvidé mi contraseña
        </button>
    </div>
  )
}
