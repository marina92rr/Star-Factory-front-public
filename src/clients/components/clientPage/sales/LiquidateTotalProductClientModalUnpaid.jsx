/**
 * @description Modal de liquidacion total de productos impagados de un cliente.
 * Permite seleccionar metodo de pago y confirmar el pago de todos los impagados.
 * @returns {JSX.Element} Modal de liquidacion total
 */
import Modal from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useUiStore } from '../../../../hooks/useUiStore'
import { useProductClientStore } from '../../../../hooks/useProductClientStore'
import { customStyleModal } from '../../../../helpers/customStyleModal'

Modal.setAppElement('#root')



export const LiquidateTotalProductClientModalUnpaid = ({total, idClient}) => {
  const { isModalTotalProductClientUnpaidOpen, closeTotalProductClientUnpaidModal } = useUiStore()
  const { activeProductClient, startPaidTotalProductClient, startLoadingProductsClientUnpaid, startLoadingProductsClientPaid } = useProductClientStore();


  const [formValues, setFormValues] = useState({ paymentMethod: 'efectivo',})
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setFormValues({ paymentMethod: 'efectivo' }) // Reset form values when not editing 

  }, [isModalTotalProductClientUnpaidOpen, idClient]);

  const onInputChange = (e) => {
    const { name, value } = e.target
    setFormValues(v => ({ ...v, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formValues.paymentMethod) {
      setSubmitted(false);
      return;
    }

    const payload = formValues.paymentMethod
  
    await startPaidTotalProductClient(idClient, payload);
    closeTotalProductClientUnpaidModal();
    await startLoadingProductsClientUnpaid(idClient);
    await startLoadingProductsClientPaid(idClient);

    setFormValues({ paymentMethod: 'efectivo'});
    setSubmitted(false);
  };


  return (
    <Modal
      isOpen={isModalTotalProductClientUnpaidOpen}
      closeTimeoutMS={200}
      onRequestClose={closeTotalProductClientUnpaidModal}
      style={customStyleModal}
      contentLabel="Editar Compra automática"
    >
      <h4 className='ps-4'>Liquidar total</h4>
      <hr />

      <form className="container mb-3 " onSubmit={onSubmit}>
        <div>
          <label className='border p-3 w-100'>
            <h2>{total} €</h2>
          </label>

        </div>

        {/*metodo de pago  */}
        <div className="mb-3 py-3">
          <label className="form-label">Método de pago</label>
          <select
            className="form-select py-2"
            name='paymentMethod'
            value={formValues.paymentMethod}
            onChange={onInputChange}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        <div className='ms-auto'>

          {/* Botón LIQUIDAR: paid = true */}
          <button
            type="submit"
            className="btn btn-success"
            disabled={submitted}
          >
            Liquidar deuda
          </button>
        </div>



      </form>
    </Modal>
  )
}