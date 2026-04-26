/**
 * @description Modal para crear o editar un cliente.
 * Muestra un formulario con campos de nombre, apellidos, email, telefonos.
 * Si hay un cliente activo, opera en modo edicion; si no, en modo creacion.
 * Al guardar, envia los datos al backend y recarga la pagina.
 * @returns {JSX.Element} Modal de react-modal con formulario de cliente
 */
import { useEffect, useMemo, useState } from 'react';
import { useUiStore } from '../../hooks/useUiStore';
import { useClientsStore } from '../../hooks/useClientsStore';
import Modal from 'react-modal';
import { customStyleModal } from '../../helpers/customStyleModal';

Modal.setAppElement('#root');

export const ClientModal = () => {
  const { isModalClientOpen, closeClientModal } = useUiStore();
  const { activeClient, startSavingClient } = useClientsStore();

  const isEditMode = !!activeClient?.idClient;


  const [formValues, setFormValues] = useState({
    name: '',
    lastName: '',
    email: '',
    email2: '',
    mainPhone: '',
    optionalPhone: '',
    whatsappPhone: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);


  useEffect(() => {
    if (isModalClientOpen) {
      if (isEditMode) {
        setFormValues({ ...activeClient });
      } else {
        setFormValues({
          name: '',
          lastName: '',
          email: '',
          email2: '',
          mainPhone: '',
          optionalPhone: '',
          whatsappPhone: ''
        });
      }
      setFormSubmitted(false);
    }
  }, [isModalClientOpen, activeClient, isEditMode]);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';
    return formValues.name.trim().length > 0 ? 'is-valid' : 'is-invalid';
  }, [formValues.name, formSubmitted]);

  const onInputChange = ({ target }) => {
    const { name, type, checked, value } = target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (formValues.name.trim().length === 0) return;

    await startSavingClient(formValues, isEditMode); // <-- pasa el modo
    closeClientModal();
    //await starLoadingClients();
    setFormSubmitted(false);
    window.location.reload(true);
  };

  return (
    <Modal
      isOpen={isModalClientOpen}
      closeTimeoutMS={200}
      onRequestClose={closeClientModal}
      style={customStyleModal}
      contentLabel={isEditMode ? 'Editar Cliente' : 'Añadir Cliente'}
    >
      <h1>{isEditMode ? 'Editar Cliente' : 'Añadir nuevo Cliente'}</h1>
      <hr />
      <form className='container' onSubmit={onSubmit}>
        <div className='mb-3'>
          <label className="form-label">Nombre</label>
          <input
            className={`form-control ${titleClass}`}
            name='name'
            type="text"
            value={formValues.name || ''}
            onChange={onInputChange}
          />
        </div>

        <div className='mb-3'>
          <label className="form-label">Apellidos</label>
          <input
            className='form-control'
            name='lastName'
            type="text"
            value={formValues.lastName || ''}
            onChange={onInputChange}
          />
        </div>

        <div className='d-flex gap-2 mb-3'>

          <div className='mb-3'>
            <label className="form-label">Email</label>
            <input
              className='form-control'
              name='email'
              type="text"
              value={formValues.email || ''}
              onChange={onInputChange}
            />
          </div>

          <div className='mb-3'>
            <label className="form-label">Email 2</label>
            <input
              className='form-control'
              name='email2'
              type="text"
              value={formValues.email2 || ''}
              onChange={onInputChange}
            />
          </div>
        </div>



        <div className='d-flex gap-2 mb-3'>
          <div>
            <label className="form-label">Teléfono</label>
            <input
              className='form-control'
              name='mainPhone'
              type="text"
              value={formValues.mainPhone || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="form-label">2º Teléfono</label>
            <input
              className='form-control'
              name='optionalPhone'
              type="text"
              value={formValues.optionalPhone || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="form-label">Teléfono whatsapp</label>
            <input
              className='form-control'
              name='whatsappPhone'
              type="text"
              value={formValues.whatsappPhone || ''}
              onChange={onInputChange}
            />
          </div>
        </div>

        <button type='submit' className='btn btn-primary btn-block'>
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </Modal>
  );
};