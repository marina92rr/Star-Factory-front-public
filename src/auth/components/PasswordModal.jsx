/**
 * @description Modal para cambiar la contrasena de un usuario.
 * Muestra un formulario con campo de nueva contrasena y confirmacion.
 * @returns {JSX.Element} Modal de cambio de contrasena
 */
import Modal from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useUiStore } from '../../hooks/useUiStore';
import { customStyleModal } from '../../helpers/customStyleModal';
import { useAuthStore } from '../../hooks/useAuthStore';



export const PasswordModal = () => {

  const { isModalPasswordUser, closePasswordUserModal } = useUiStore(); //Abrir y cerrar modal
 const { starEmailSend} = useAuthStore();


  //Estado valor
  const [formValues, setFormValues] = useState({
    email: ''
  });

  //Subir estado formulario
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {

    setFormValues({
      email: '',
    });
  }, []);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';
    return formValues.name.trim().length > 0 ? 'is-valid' : 'is-invalid';
  }, [formValues.name, formSubmitted]);

  const onInputChange = ({ target }) => {
    const { name, value, type } = target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'number'
        ? (value === '' ? '' : parseInt(value, 10)) // para campos vacíos
        : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!formValues.email) return;
    starEmailSend(formValues.email);
    closePasswordUserModal();
  };

  return (
    <Modal
      isOpen={isModalPasswordUser}
      closeTimeoutMS={200}
      onRequestClose={closePasswordUserModal}
      style={customStyleModal}
      contentLabel={'Actualizar Usuario'}>

      <h3>Reenviar contraseña</h3>
      <hr />
      <form className='container ' onSubmit={onSubmit}>

       

          <div className='mb-3'>
            <label className="form-label">Email</label>
            <input
              className={`form-control ${titleClass}`}
              name='email'
              type="text"
              value={formValues.email}
              onChange={onInputChange}
            />
          </div>

       
        <div className="mb-3 d-flex justify-content-end">
          <button className="btn btn-primary custom-btn">Reenviar contraseña</button>
        </div>
      </form>
    </Modal>
  )
}
