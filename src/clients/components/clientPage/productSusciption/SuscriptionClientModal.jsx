/**
 * @description Modal para editar una suscripcion (compra automatica) de un cliente.
 * Permite modificar precio, descuento, metodo de pago y fecha de la proxima compra.
 *
 * @param {Object} props
 * @param {Object} props.suscription - Datos de la suscripcion a editar
 * @returns {JSX.Element} Modal con formulario de edicion de suscripcion
 */
import Modal from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useSuscriptionClientStore } from '../../../../hooks/useSuscriptionClientStore'
import { useUiStore } from '../../../../hooks/useUiStore'
import { capitalizeFirstWord } from '../../../../helpers/capitalizeFirstWord'
import { customStyleModal } from '../../../../helpers/customStyleModal'

Modal.setAppElement('#root')


export const SuscriptionClientModal = ({ suscription }) => {
  const { isModalSuscriptionClientOpen, closeSuscriptionClientModal } = useUiStore()
  const { activeSuscriptionClient, startUpdateSuscription, startLoadingSuscriptionsByClient } = useSuscriptionClientStore()



  const isEdit = !!activeSuscriptionClient?.idSuscriptionClient

  const [formValues, setFormValues] = useState({
    price: '',
    discount: '',
    paymentMethod: '',
    startDate: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setFormValues({
        price: activeSuscriptionClient.price ?? '',
        discount: activeSuscriptionClient.discount ?? '',
        paymentMethod: activeSuscriptionClient.paymentMethod ?? '',
        startDate: activeSuscriptionClient.startDate?.slice(0, 10) ?? '',
      })
    } else {
      setFormValues({ price: '', discount:'', paymentMethod: '', startDate: '' })
    }
  }, [isEdit, activeSuscriptionClient])

  const priceClass = useMemo(() => {
    if (!submitted) return ''
    return String(formValues.price).trim().length ? 'is-valid' : 'is-invalid'
  }, [formValues.price, submitted])

  const onInputChange = (e) => {
    const { name, value } = e.target
    setFormValues(v => ({ ...v, [name]: value }))
  }

  const onSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);
  if (!String(formValues.price).trim().length) return;

  const payload = {
    ...formValues,
    idSuscriptionClient: activeSuscriptionClient?.idSuscriptionClient, // <-- AQUI
  };

  await startUpdateSuscription(payload, true);
  closeSuscriptionClientModal();
  await startLoadingSuscriptionsByClient(activeSuscriptionClient?.idClient);
  setFormValues({ price: '', discount: '', paymentMethod: '', startDate: '' });
  setSubmitted(false);
};

  return (
    <Modal
      isOpen={isModalSuscriptionClientOpen}
      closeTimeoutMS={200}
      onRequestClose={closeSuscriptionClientModal}
      style={customStyleModal}
      contentLabel="Editar Compra automática"
    >
      <h4>Editar compra automática</h4>
      <hr />

      <form className="container mb-3 " onSubmit={onSubmit}>
        <div className='mb-3'>
          <label className='border p-3 w-100'>{suscription.name}</label>
        </div>
        <div className='d-flex'>
          <div className="mb-3 pe-3">
          <label className="form-label">Próximo precio</label>
          <div className='input-group'>
            <input
              className={`form-control ${priceClass}`}
              name="price"
              type="number"
              step="0.01"
              value={formValues.price}
              onChange={onInputChange}
            />
            <span className='input-group-text'>€</span>
          </div>
         
        </div>
        <div className="mb-3">
          <label className="form-label">Próximo descuento</label>
          <div className='input-group'>
            <input
            className={`form-control `}
            name="discount"
            type="number"
            step="0.01"
            value={formValues.discount}
            onChange={onInputChange}
          />
          <span className='input-group-text'>€</span>
          </div>
        
        </div>
        </div>

        <div className="mb-3 py-3">
          <label className="form-label">Método de pago</label>
          <select
            className="form-select py-3"
            name='paymentMethod'
            value={formValues.paymentMethod}
            onChange={onInputChange}
          >
            <option value={formValues.paymentMethod}>{capitalizeFirstWord(formValues.paymentMethod)}</option>
            {formValues.paymentMethod === 'EFECTIVO' ? <option value="tarjeta">Tarjeta</option> : <option value="efectivo">Efectivo</option>}
          </select>
        </div>
        {/*Fechas  */}
        <div className='d-flex'>
          <div className="mb-3 mx-1">
            <label className="form-label">Próxima fecha</label>
            <input
              className="form-control"
              name="startDate"
              type="date"
              value={formValues.startDate}
              onChange={onInputChange}
            />
          </div>
        </div>


        <div className="d-flex gap-2 mb-3 justify-content-end">
          <button type="submit" className="btn btn-success">Guardar</button>

        </div>
      </form>
    </Modal>
  )
}