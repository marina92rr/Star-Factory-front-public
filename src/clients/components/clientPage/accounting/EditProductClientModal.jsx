/**
 * @description Modal para editar un producto-cliente desde la contabilidad.
 * Permite modificar el metodo de pago y otros datos del registro.
 * @returns {JSX.Element} Modal de edicion de producto-cliente
 */
import Modal from 'react-modal'
import { useEffect, useState } from 'react'
import { useUiStore } from '../../../../hooks/useUiStore'
import { useProductClientStore } from '../../../../hooks/useProductClientStore'
import { format } from 'date-fns' // <= OJO: format, no formatDate
import { toLocalISO } from '../../../../helpers/toLocalISO'
import { customStyleModal } from '../../../../helpers/customStyleModal'

const lightOverlayStyle = {
  ...customStyleModal,
  overlay: { backgroundColor: 'rgba(0,0,0,0.20)', zIndex: 1000 },
};

export const EditProductClientModal = () => {
  const { isModalProductClientOpen, closeProductClientModal } = useUiStore()
  const {
    activeProductClient,
    startUpdateProductClient,
    startLoadProductsByDate,
    startLoadingProductsClientPaid
  } = useProductClientStore();

  const isEditMode = !!activeProductClient?.idProductClient;

  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    discount: '',
    paymentDate: '',
    paymentMethod: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isEditMode && activeProductClient) {
      setFormValues({
        name: activeProductClient.name ?? '',
        price: String(activeProductClient.price ?? ''),
        discount: String(activeProductClient.discount ?? ''),
        paymentMethod: activeProductClient.paymentMethod ?? 'efectivo',
        paymentDate: toLocalISO(
          activeProductClient.paymentDate
            ? new Date(activeProductClient.paymentDate)
            : new Date()
        ),
      });
    } else {
      setFormValues({ name: '', price: '', discount: '', paymentDate: '', paymentMethod: 'efectivo' });
    }
  }, [isModalProductClientOpen, isEditMode]); 

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(v => ({ ...v, [name]: value }));
  };

  const onClose = () => {
    setSubmitted(false);
    setFormValues({ name: '', price: '', discount: '', paymentDate: '', paymentMethod: 'efectivo' });
    closeProductClientModal();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

      const paymentDateISO = new Date(formValues.paymentDate).toISOString()
       

      const payload = {
        ...formValues,                  
        idProductClient: activeProductClient?.idProductClient, // <= FIX
      };

      await startUpdateProductClient(payload, true);
      startLoadProductsByDate(paymentDateISO);
      startLoadingProductsClientPaid(activeProductClient?.idClient);

      onClose();

   
  };

  return (
    <Modal
      isOpen={isModalProductClientOpen}
      closeTimeoutMS={200}
      onRequestClose={closeProductClientModal}
      style={lightOverlayStyle}
      contentLabel="Editar venta"
    >
      <h4 className='ps-4'>Editar venta</h4>
      <hr />

      <form className="container mb-3" onSubmit={onSubmit}>
        {/* Nombre */}
        <div className='mb-3'>
          <label className='form-label'>Nombre</label>
          <input
            type="text"
            className="form-control w-100"
            name='name'
            value={formValues.name}
            onChange={onInputChange}
          />
        </div>

        <div className='d-flex gap-2'>
          {/* Precio */}
          <div className='mb-3'>
            <label className='form-label'>Precio</label>
            <div className='input-group'>
              <input
                className="form-control"
                name="price"
                type="number"
                step="0.01"
                value={formValues.price}
                onChange={onInputChange}
                required
              />
              <span className='input-group-text'>€</span>
            </div>
          </div>

          {/* Descuento */}
          <div className='mb-3'>
            <label className='form-label'>Descuento</label>
            <div className='input-group'>
              <input
                className="form-control"
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

        {/* Fecha pago */}
        <div className='mb-3'>
          <label className='form-label'>Fecha de pago</label>
          <input
            type="date"
            className="form-control w-100"
            name='paymentDate'
            value={formValues.paymentDate}
            onChange={onInputChange}
            required
          />
        </div>

        {/* Método pago */}
        <div className="mb-3 py-3">
          <label className="form-label">Método de pago</label>
          <select
            className="form-select py-3"
            name='paymentMethod'
            value={formValues.paymentMethod }
            onChange={onInputChange}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        <div className="d-flex gap-2 mb-3 justify-content-between align-items-center">
          <button type="submit" className="btn btn-primary">
            Actualizar
          </button>
        </div>
      </form>
    </Modal>
  );
};