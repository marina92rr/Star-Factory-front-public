/**
 * @description Boton para eliminar permanentemente un cliente dado de baja.
 * Solo se muestra cuando el cliente tiene baja inmediata.
 * Solicita confirmacion antes de eliminar y redirige al listado.
 * @returns {JSX.Element} Boton de eliminacion de cliente
 */
import { useClientsStore } from '../../../hooks/useClientsStore';
import { useNavigate } from 'react-router-dom';

export const DeleteClient = () => {
    const { activeClient, startDeleteClient } = useClientsStore();
    const navigate = useNavigate();

    const handleDelete = async() => {
        const confirmDelete = window.confirm(`¿Estás seguro de querer eliminar La tarifa ${activeClient.name}?`);
        if (!confirmDelete) return;
        await startDeleteClient(activeClient);
        navigate('/');

    }

    return (

        <button
            className='btn btn-outline-danger'
            onClick={handleDelete}>
            Eliminar cliente
        </button>

    )
}
