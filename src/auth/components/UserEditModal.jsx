/**
 * @description Modal para editar los datos de un usuario (nombre, email, rol de admin).
 * Se abre cuando se selecciona editar un usuario desde la tabla de usuarios.
 * @returns {JSX.Element} Modal de edicion de usuario con formulario
 */
import Modal from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useUiStore } from '../../hooks/useUiStore';
import { useAuthStore } from '../../hooks/useAuthStore';
import { customStyleModal} from '../../helpers/customStyleModal';

Modal.setAppElement('#root');

const lightOverlayStyle = {
  ...customStyleModal,
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.20)', // fuerza opacidad más baja
    zIndex: 1000,
  },
};
  


export const UserEditModal = () => {

  const { isModalUserOpen, closeUserModal } = useUiStore(); //Abrir y cerrar modal
  const { activeUser, starUpdateUser, startLoadingtUsers} = useAuthStore();


  //Estado valor
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '', 
    isAdmin: false
  });

  //Subir estado formulario
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (activeUser) {
      setFormValues({ 
        name: activeUser.name || '',
        email: activeUser.email || '',
        password:'',
        isAdmin: activeUser.isAdmin || false
      })
    } else {
      setFormValues({
        name: '',
        email: '',
        password: '',
        isAdmin: false
      })
    }
  }, [activeUser]);

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
  if (formValues.name.trim().length === 0) return;

  const { password, ...rest } = formValues;
  const payload = { ...rest };

  if (password && password.trim().length > 0) {
    payload.password = password; // solo si se escribió algo
  }

  await starUpdateUser(payload);
  closeUserModal();
  startLoadingtUsers();
  setFormSubmitted(false);
    
  };


  return (
    <Modal
      isOpen={isModalUserOpen}
      closeTimeoutMS={200}
      onRequestClose={closeUserModal}
      style={lightOverlayStyle}
      contentLabel={'Actualizar Usuario'}>

      <h1>Actualizar usuario</h1>
      <hr />
      <form className='container' onSubmit={onSubmit}>

        <div className='mb-3'>

          <div className='mb-3'>
            <label className="form-label">Nombre</label>
            <input
              className={`form-control ${titleClass}`}
              name='name'
              type="text"
              value={formValues.name}
              onChange={onInputChange}
            />
          </div>

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

          <div className='mb-3'>
            <label className="form-label">Contraseña</label>
            <input
              className={`form-control ${titleClass}`}
              name='password'
              type="password"
              value={formValues.password}
              onChange={onInputChange}
            />
          </div>

          <div className="form-check">
            <input 
              className="form-check-input"
              type="checkbox"
              name='isAdmin'
              checked={formValues.isAdmin}
              onChange={(e) => setFormValues(prev => ({
                ...prev,
                isAdmin: e.target.checked
              }))}
            />
            <label className="form-check-label">Administrador</label>
          </div>

          

        </div>
        <button type='submit' className='btn btn-success btn-block'>Actualizar</button>
      </form>
    </Modal>
  )
}
