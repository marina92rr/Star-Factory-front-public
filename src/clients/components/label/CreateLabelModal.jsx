/**
 * @description Modal para crear o editar etiquetas globales.
 * Permite definir nombre y color de la etiqueta.
 * Funciona en modo creacion o edicion segun si hay una etiqueta activa.
 * @returns {JSX.Element} Modal de creacion/edicion de etiqueta
 */
import Modal from 'react-modal'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLabelsStore } from '../../../hooks/useLabelsStore';
import { useUiStore } from '../../../hooks/useUiStore';
import { useClientsStore } from '../../../hooks/useClientsStore';


const customStylesModal = {

  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '500px',
    height: 'auto',
    padding: '20px',
    overflow: 'visible', //Para que sobresalga
    zIndex: 1001
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // oscuridad del fondo
    zIndex: 1000
  },
};

//Colores por defecto:
const colors = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF',
  '#FF3333', '#FF9933', '#FFFF66', '#99FF33', '#33FF33', '#33FF99', '#66FFFF', '#3399FF', '#3333FF', '#9933FF', '#FF33FF',
  '#FF6666', '#FFB366', '#FFFF99', '#B3FF66', '#66FF66', '#66FFB3', '#99FFFF', '#66B3FF', '#6666FF', '#B366FF', '#FF66FF',
  '#FF9999', '#FFD199', '#FFFFCC', '#CCFF99', '#99FF99', '#99FFD1', '#CCFFFF', '#99CCFF', '#9999FF', '#D199FF', '#FF99FF'

];

export const CreateLabelModal = () => {

  const { isModalCreateLabelOpen, closeCreateLabelModal } = useUiStore();
  const { activeLabel, createLabelAndAssign, startUpdateLabel, createLabelGlobal } = useLabelsStore();
  const { activeClient } = useClientsStore();

  const clientId = activeClient?.idClient ?? null;   // ✅ seguro
  const isEdit = !!activeLabel?.idLabel;          // ✅ modo editar si existe idLabel

  //Estado valor inicial del formulario
  const [formValues, setFormValues] = useState({
    name: '',
    color: '#087990',
    idClient: null
    //Color por defecto
  });

  //Subir estado formulario
  const [formSubmitted, setFormSubmitted] = useState(false);    //Subir formulario
  const [selectedColor, setSelectedColor] = useState('#087990');  //Guardar color(aleatorio, personalizado y color)
  const [showPalette, setShowPalette] = useState(false);  //Abrir paleta de colores
  const [errors, setErrors] = useState({}); // para guardar errores por campo



  useEffect(() => {
    if (isEdit) {
      setFormValues({
        name: activeLabel?.name ?? '',
        color: activeLabel?.color ?? '#087990',
        idClient: null, // en edición NO se usa
      });
      setSelectedColor(activeLabel?.color ?? '#087990');
    } else {
      setFormValues({
        name: '',
        color: '#087990',
        idClient: clientId, // puede ser null si vienes de LabelsPage
      });
      setSelectedColor('#087990');
    }
    setErrors({});
    setFormSubmitted(false);
  }, [isEdit, activeLabel, clientId]);


  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';
    return formValues.name.trim().length > 0 ? 'is-valid' : 'is-invalid';
  }, [formValues.name, formSubmitted]);

  //Valor de inpus
  const onInputChange = ({ target }) => {
    const { name, value } = target;
    // sincroniza también el color seleccionado
    if (name === 'color') {
      setSelectedColor(value);
    }
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar el error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  //Seleccionar color
  const handleColorClick = (color) => {
    setSelectedColor(color);
    setFormValues(prev => ({
      ...prev,
      color: color
    }));
    setShowPalette(false);
  };

  //Color aleatorio
  const handleRandom = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSelectedColor(randomColor);
    setFormValues(prev => ({
      ...prev,
      color: randomColor
    }));
    setShowPalette(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormSubmitted(true);
    if (!formValues.name.trim()) return;

    let err = null;

    if (isEdit) {
      // EDITAR (no usa cliente)
      err = await startUpdateLabel({
        idLabel: activeLabel.idLabel,
        name: formValues.name,
        color: formValues.color,
      });
    } else if (clientId) {
      // CREAR + ASIGNAR (desde ficha de cliente)
      err = await createLabelAndAssign({
        name: formValues.name,
        color: formValues.color,
        idClient: clientId,
      });
    } else {
      // CREAR GLOBAL (desde LabelsPage)
      err = await createLabelGlobal({
        name: formValues.name,
        color: formValues.color,
      });
    }

    if (err) { setErrors(err); setFormSubmitted(false); return; }
    closeCreateLabelModal(); // no recargues toda la página
  };

  return (
    <Modal
      isOpen={isModalCreateLabelOpen}
      closeTimeoutMS={200}
      onRequestClose={closeCreateLabelModal}
      style={customStylesModal}
      shouldCloseOnOverlayClick={true} // ✅ esto permite cerrar al pulsar fuera
      contentLabel="Nueva Etiqueta"
    >
      <h2 className='modal-title'>{isEdit ? 'Editar etiqueta' : 'Nueva Etiqueta'}</h2>
      <hr />
      <form onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${titleClass}`}
            value={formValues.name}
            onChange={onInputChange}
          />
          {errors.name && <span className="text-danger">{errors.name.msg}</span>}

        </div>

        <div className="form-group">
          <div>
            <label htmlFor='color' className="form-label">Color</label>
            <div style={{ position: 'relative' }} className="d-flex mb-2">
              <div
                onClick={() => setShowPalette(!showPalette)}
                style={{
                  backgroundColor: selectedColor,
                  width: '40px',
                  height: '40px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  cursor: 'pointer'
                }}
              ></div>
              <input
                type="text"
                name='color'
                className="form-control mb-3 ms-2"
                style={{ width: '150px' }}
                value={formValues.color}
                onChange={onInputChange}
              />

              {showPalette && (
                <div
                  style={{
                    position: 'absolute',
                    background: '#fff',
                    border: '1px solid #ccc',
                    padding: '10px',
                    zIndex: 100,
                    width: 'fit-content',
                    top: '50px'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(11, 30px)',
                      gap: '1px',
                      marginBottom: '10px'
                    }}
                  >
                    {colors.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleColorClick(color)}
                        style={{
                          backgroundColor: color,
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          margin: '0',
                          border: 'none'

                        }}
                      />
                    ))}
                  </div>

                  <div className="d-flex justify-content-between px-2">
                    <button className="btn btn-link p-0" onClick={handleRandom}>Aleatorio</button>
                    <div className='d-flex align-items-center'>
                      <input
                        type="color"
                        id="color"
                        name="color"
                        className="form-control form-control-color"
                        value={formValues.color}
                        onChange={onInputChange}
                      />
                      <label className="cursor" htmlFor="color">Personalizado</label>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>
          <div className='mb-2'>

          </div>

        </div>
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Editar' : 'Crear'}
        </button>

      </form>
    </Modal>

  )
}
