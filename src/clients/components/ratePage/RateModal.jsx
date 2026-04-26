/**
 * @description Modal para crear o editar una tarifa.
 * Incluye formulario con nombre y descripcion (nombre para clientes y facturas).
 * Detecta automaticamente si es modo creacion o edicion segun activeRate.
 * @returns {JSX.Element} Modal con formulario de tarifa
 */
import Modal  from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useUiStore } from '../../../hooks/useUiStore';
import { useRateStore } from '../../../hooks/useRateStore';
import {customStyleModal} from '../../../helpers/customStyleModal';


Modal.setAppElement('#root');


export const RateModal = () => {

    const {isModalRateOpen, closeRateModal} = useUiStore(); //Abrir y cerrar modal
    const { activeRate, startSavingRate, starLoadingRates} = useRateStore();

    const isEditRate = !!activeRate?.idRate;


    //Estado valor
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
    });

    //Subir estado formulario
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        if(isEditRate){
            setFormValues({...activeRate});
        }else{
            setFormValues({
                name: '',
                description: '',
            })
        }
    }, [activeRate]);

      const titleClass = useMemo(() => {
        if (!formSubmitted) return '';
        return formValues.name.trim().length > 0 ? 'is-valid' : 'is-invalid';
      }, [formValues.name, formSubmitted]);
    
      const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormValues((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

    const onSubmit = async (e) => {
  e.preventDefault();
  setFormSubmitted(true);

  if (formValues.name.trim().length === 0) return;
  await startSavingRate(formValues, isEditRate);  // Guarda en la BBDD
  closeRateModal();  // Debería cerrar el modal
  await starLoadingRates();  // Recarga desde backend
  if(isEditRate){
    setFormValues({ 
      name: '', 
      description: '' 
  });  // Limpia el formulario

  }
};

  return (
    <Modal
        isOpen={isModalRateOpen}
        closeTimeoutMS={200}
        onRequestClose={closeRateModal}
        style={customStyleModal}
        contentLabel={isEditRate ? 'Actualizar Tarifa' :'Crear Tarifa'} 
       >

        <h1>Nueva Tarifa</h1>
        <hr />
        <form className='container' onSubmit={onSubmit}>
            <div className='mb-3'>
                <label  className="form-label">Nombre de la tarifa</label>
                <input 
                    className={`form-control ${titleClass}`}
                    name='name'
                    type="text"
                    value={formValues.name}
                    onChange={onInputChange} 
                />
            </div>
             <div className='mb-3'>
                <label  className="form-label">Nombre para los clientes y facturas</label>
                <input 
                    className={`form-control ${titleClass}`}
                    name='description'
                    type="text"
                    value={formValues.description}
                    onChange={onInputChange} 
                />
            </div>
            <button type='submit' className='btn btn-success btn-block'>
              {isEditRate ? 'Actualizar' :'Guardar'}
              </button>
        </form>
    </Modal>
  )
}
