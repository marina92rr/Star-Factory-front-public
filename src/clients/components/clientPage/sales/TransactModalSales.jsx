/**
 * @description Modal de confirmacion de transaccion de venta.
 * Permite seleccionar el metodo de pago (tarjeta/efectivo), ver el resumen
 * de productos, descuentos y total, y confirmar la venta.
 * @returns {JSX.Element} Modal de transaccion con resumen y confirmacion
 */
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useUiStore } from '../../../../hooks/useUiStore';
import { useClientsStore } from '../../../../hooks/useClientsStore';
import { useProductClientStore } from '../../../../hooks/useProductClientStore';
import { useNavigate } from 'react-router-dom';
import { customStyleModal } from '../../../../helpers/customStyleModal';


export const TransactModalSales = ({ selectedProducts, totalAmount }) => {

  const navigate = useNavigate();
  const { isModalSaleOpen, closeSaleModal } = useUiStore();
  const { startSavingProductClient } = useProductClientStore();
  const [paymentMethod, setPaymentMethod] = useState('Efectivo')
  const { activeClient } = useClientsStore();


  const productsMapped = selectedProducts.map(item => ({
    name: item.name,
    idProduct: item.idProduct ?? item.idQuota,
    isProduct: item.idProduct ? true : false,
    price: item.price,
    discount: item.discount,
    selfSale: item.selfSale ?? false
  }));

  const handleSubmit = async (e) => {
    e.preventDefault()
    const venta = {
      fecha: new Date(),
      cliente: `${activeClient.name} ${activeClient.lastName}`,
      items: selectedProducts,
      total: parseFloat(totalAmount)
    };

    const dataToSend = {
      idClient: activeClient.idClient,
      products: productsMapped,
      paymentMethod: paymentMethod,
      paid: true,
    };

    try {

      // Guardar en la base de datos
      await startSavingProductClient(dataToSend, false);

      // Cerrar modal y redirigir
      closeSaleModal();
      navigate(`/${activeClient.idClient}/sales`);
    } catch (error) {
      console.error('Error al tramitar la venta o generar el ticket', error);
    }
  }

  return (
    <Modal
      isOpen={isModalSaleOpen}
      closeTimeoutMS={200}
      onRequestClose={closeSaleModal}
      style={customStyleModal}
      contentLabel='Tramitar Venta' >

      <h3 className='py-1'>Liquidar deuda</h3>
      <hr />
      <form  onSubmit={handleSubmit}>
        <div className="mb-3 ">
          <h2
            className='align-items-center justify-content-center d-flex w-100'
            style={{  height: 120, background: '#e9e9e963' }}>{totalAmount} €</h2>
        </div>

        <div className="mb-3 py-3">
          <label className="form-label">Método de pago</label>
          <select
            className="form-select py-3"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>
        <hr />
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            style={{ background: '#38b647', color: 'white' }}
            className="btn btn-success p-2 w-100 ">
            Liquidar deuda
          </button>
        </div>
      </form>
    </Modal>
  )
}
