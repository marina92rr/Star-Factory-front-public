/**
 * @description Modal que muestra la lista de clientes con baja programada.
 * Permite navegar al detalle de cada cliente al seleccionarlo.
 * @returns {JSX.Element} Modal con listado de clientes y sus fechas de baja
 */
import  Modal  from 'react-modal';
import { useUiStore } from '../../../../hooks/useUiStore';
import { useClientsStore } from '../../../../hooks/useClientsStore';
import { formatDate } from '../../../../helpers/formatDate';
import { useNavigate } from 'react-router-dom';
import { customStyleModal } from '../../../../helpers/customStyleModal';




export const GetClientCancellationModal = () => {

    const navigate = useNavigate();

    const { isModalCancellationOpen, closeCancellationModal } = useUiStore();
    const{ scheduledCancellationClients } = useClientsStore();


    // Cuando seleccionas un cliente, navegamos a /clients/:ID
  const handleSelect = idClient => {
    navigate(`${idClient}`);
    setShowDropdown(false);
    setInputValue('');
  };


    return (
        <Modal
            isOpen={isModalCancellationOpen}
            closeTimeoutMS={200}
            onRequestClose={closeCancellationModal}
            style={customStyleModal}
            contentLabel='Clientes con Baja Programada' >

            <div className="position-sticky top-0 bg-white pt-2 pb-2" style={{ zIndex: 12 }}>
                <h2 className="m-0 p-2">Clientes con Baja programada</h2>
                <hr className="mt-2 mb-3" />
                <div className=' mb-3'>
                    {scheduledCancellationClients.map(client => (
                        <div 
                            key={client.idClient} 
                            className=" border-bottom p-1"
                            style={{cursor: 'pointer'}}
                            onClick={() => handleSelect(client.idClient)}
                        >
                            <span className="me-2">{client.name} {client.lastName}</span>
                            <p className="text-secondary">{formatDate(client.dateCancellation)}</p>
                        </div>
                    ))}
                </div>
            </div>

        </Modal>
    );
};
