/**
 * @description Modal para crear o editar una cuota dentro de una tarifa.
 * Incluye formulario con nombre, numero de dias, periodo (puntual/mensual) y PVP.
 * Detecta automaticamente si es modo creacion o edicion segun activeQuota.
 * @returns {JSX.Element} Modal con formulario de cuota
 */
import Modal from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useUiStore } from '../../../hooks/useUiStore';
import { useQuotaStore } from '../../../hooks/useQuotaStore';
import { useRateStore } from '../../../hooks/useRateStore';
import { customStyleModal } from '../../../helpers/customStyleModal';


Modal.setAppElement('#root');


export const QuotaModal = () => {

  const { isModalQuotaOpen, closeQuotaModal } = useUiStore(); //Abrir y cerrar modal
  const { activeQuota, startSavingQuota, startLoadingQuotasByRate } = useQuotaStore();
  const { rates, activeRate } = useRateStore();


  //Estado valor
  const [formValues, setFormValues] = useState({
    name: '',
    numSession: 0,
    numPeriods: 0,
    period: '',
    price: 0
  });

  //Subir estado formulario
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isEditMode = !!activeQuota?.idQuota;

  useEffect(() => {
    
    if (activeQuota && isEditMode) {
      setFormValues({ 
        name: activeQuota.name || '',
        idQuota: activeQuota.idQuota || '',
        numSession: activeQuota.numSession || 0,
        numPeriods: activeQuota.numPeriods || 0,
        period: activeQuota.period || '',
        price: activeQuota.price || 0
      })
    } else {
      setFormValues({
        name: '',
        numSession: 0,
        numPeriods: 0,
        period: '',
        price: 0,
        idRate: activeRate?._id?.toString() || '',
      })
    }
  }, [activeQuota, activeRate]);

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

    await startSavingQuota(formValues, isEditMode);  // Guarda en la BBDD
    closeQuotaModal();  // Debería cerrar el modal
    startLoadingQuotasByRate(activeRate._id);

    setFormSubmitted(false);
    
    if (isEditMode) {
      setFormValues({
        name: '',
        numSession: 0,
        numPeriods: 0,
        period: '',
        price: 0
      });
    }
  };


  return (
    <Modal
      isOpen={isModalQuotaOpen}
      closeTimeoutMS={200}
      onRequestClose={closeQuotaModal}
      style={customStyleModal}
      contentLabel={isEditMode ? 'Actualizar Cuota' : 'Añadir Cuota'}>

      <h1>{isEditMode ? 'Actualizar Cuota' : 'Nueva Cuota'}</h1>
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

          <div className='d-flex justify-content-between mb-3'>

            <div className='mx-1'>
              <label className="form-label">Nº de días</label>
              <input
                className={`form-control ${titleClass}`}
                name='numSession'
                type="number"
                value={formValues.numSession}
                onChange={onInputChange}
              />
            </div>
            <div className='mx-1'>
              <label className="form-label" htmlFor="period">Periodo</label>
              <select
                className={`form-select ${titleClass}`}
                name='period'
                type="text"
                value={formValues.period}
                onChange={onInputChange}
              >
                {!isEditMode 
              ? ( <option value="">-- Periodo --</option>)
              :(<option value={activeQuota.period}>{activeQuota.period}</option>)}
                <option value="puntual">Puntual</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
          </div>
         
          <div className='mb-3'>
            <label className="form-label">PVP</label>
            <input
              className={`form-control ${titleClass}`}
              name='price'
              type="number"
              value={formValues.price}
              onChange={onInputChange}
            />
          </div>

        </div>
        <button type='submit' className='btn btn-success btn-block'>{isEditMode ? 'Actualizar' : 'guardar'}</button>
      </form>
    </Modal>
  )
}
