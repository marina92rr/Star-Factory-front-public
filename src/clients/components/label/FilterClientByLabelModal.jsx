/**
 * @description Modal para filtrar clientes por etiquetas.
 * Muestra la lista de etiquetas disponibles con checkboxes para seleccionar
 * las etiquetas por las que se quieren filtrar los clientes.
 * @returns {JSX.Element} Modal de filtrado por etiquetas
 */
import Modal from 'react-modal';
import { useUiStore } from "../../../hooks/useUiStore";
import { useLabelsStore } from '../../../hooks/useLabelsStore';
import { useClientsStore } from "../../../hooks/useClientsStore";
import { useEffect, useState } from "react";
import { LabelSearchInput } from './LabelSearchInput';



const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '80vh',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    color: '#000000',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // oscuridad del fondo
    zIndex: 9999,                          // asegura que está por encima
  }
};


export const FilterClientByLabelModal = () => {

  //Abrir modal addNewLabel
  const { isModalFilterClientsByLabelOpen, closeFilterClientByLabelModal } = useUiStore();             //Abrir/ cerrar modal
  const { labels, starLoadingLabels, startActiveFilterLabels } = useLabelsStore();      //Lectura todos los Labels
  const { activeClient, filterClientsByLabels } = useClientsStore();                   //Cliente activo en clientPage

  //Create modal
  const [selectedLabels, setSelectedLabels] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  // Dentro del render
  const filteredLabels = labels.filter(label =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  //Nada mas cargar la pag 
  useEffect(() => {
    starLoadingLabels();    //Lectura allabel
  }, []);
  useEffect(() => {
    if (isModalFilterClientsByLabelOpen) {
      setSelectedLabels([]); // Limpia al abrir
    }
  }, [isModalFilterClientsByLabelOpen]);



  const handleToggle = (idLabel) => {
    setSelectedLabels(prev =>
      prev.includes(idLabel)
        ? prev.filter(id => id !== idLabel)
        : [...prev, idLabel]
    );
  };

  //Guardar etiqueta
  const handleSaveLabels = async () => {
    // selectedLabels es array de idLabel
    const labelIds = selectedLabels.map(Number);
    await filterClientsByLabels(labelIds);
    startActiveFilterLabels(labelIds); //Guardamos
    closeFilterClientByLabelModal();
  };


  if (!labels || labels.length === 0) return null;

  return (
    <>
      <Modal
        isOpen={isModalFilterClientsByLabelOpen}
        closeTimeoutMS={200}
        onRequestClose={closeFilterClientByLabelModal}
        style={customStyles}
        shouldCloseOnOverlayClick={true} // ✅ esto permite cerrar al pulsar fuera
        contentLabel='Filtrar por etiqueta'
      >
        <div className="position-sticky top-0 bg-white pt-2 pb-2" style={{ zIndex: 12 }}>
          <h5 className="m-0 px-2">Filtrar por etiqueta</h5>
          <hr className="mt-2 mb-2" />
          <div className='d-flex mb-3'>
            <div className='d-flex mb-3 w-100'>
              <LabelSearchInput onSearch={setSearchTerm} />

            </div>
          </div>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div style={{ maxHeight: '54vh', overflowY: 'auto', marginBottom: '16px' }}>
          {filteredLabels.map((label) => {
            const isChecked = (selectedLabels || []).includes(label.idLabel);

            return (
              <div className="d-flex align-items-center mb-2 px-2" key={label.idLabel}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(label.idLabel)}
                />
                <div
                  className="me-3 ms-3"
                  style={{
                    backgroundColor: label.color,
                    width: '10px',
                    height: '10px',
                    borderRadius: '25px',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                ></div>
                <div style={{ cursor: 'pointer' }}>{label.name}</div>
              </div>
            );
          })}
        </div>

        {/* FOOTER STICKY */}
        <div className="position-sticky bottom-0 bg-white py-3" style={{ zIndex: 13 }}>
          <button className="btn btn-success w-100" onClick={handleSaveLabels}>
            Filtrar
          </button>
        </div>



      </Modal>


    </>
  )
}
