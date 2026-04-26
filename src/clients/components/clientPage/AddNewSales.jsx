/**
 * @description Pagina para agregar nuevas ventas a un cliente.
 * Permite buscar y seleccionar productos y cuotas, agregarlos a un carrito
 * y completar la transaccion. Incluye buscador de productos/cuotas y
 * componente de transaccion de venta.
 * @returns {JSX.Element} Vista de nueva venta con buscador y carrito
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useProductStore } from '../../../hooks/useProductStore';
import { useQuotaStore } from '../../../hooks/useQuotaStore';
import { useClientsStore } from '../../../hooks/useClientsStore';
import { TransactNewSales } from './sales/TransactNewSales';
import { TransactModalSales } from './sales/TransactModalSales';
import { FindSales } from './sales/FindSales';
import { capitalizeFirstWord } from '../../../helpers/capitalizeFirstWord';


export const AddNewSales = () => {

  const { products, starLoadingProducts, filteredList } = useProductStore();
  const { quotas, starLoadingQuotas, filteredListQuotas } = useQuotaStore();
  const [searchInput, setSearchInput] = useState('');


  //Seleccionar productos al carrito
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    starLoadingProducts();
    starLoadingQuotas();
  }, []);


  //Añadir productos/cuotas al carrito
  const handleAddProduct = (product, type) => {
    setSelectedProducts(prev => [
      ...prev,
      {
        ...product,
        type,
        idProduct: type === 'product' ? product.idProduct : null,
        idQuota: type === 'quota' ? product.idQuota : null,
        discount: null, // Descuento inicial
        selfSale: false
      }
    ]);
  };

  //Descuento
  const handleDiscountChange = (index, value) => {
    setSelectedProducts(prev =>
      prev.map((product, i) =>
        i === index
          ? { ...product, discount: parseFloat(value) || 0 }
          : product
      )
    );
  };

  //Total suma
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((total, product) => {
      const discountAmount = parseFloat(product.discount) || 0;
      const finalPrice = product.price - discountAmount;
      return total + finalPrice;
    }, 0).toFixed(2);
  }, [selectedProducts]);

  const handleRemoveProduct = (indexToRemove) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  //Autoventa

  const [valor, setValor] = useState("");

  const handleChange = (opcion) => {
    if (valor === opcion) {
      setValor(""); // Si se selecciona el mismo, desmarcar
    } else {
      setValor(opcion);
    }
  }

  return (
    <div >
      <div className='mx-2 d-flex justify-content-between'>
        <h1>Añadir producto</h1>
      </div>

      <div className='d-flex'>
        <div>
          <FindSales onInputChange={setSearchInput} />

          {/* Scroll solo para el listado */}
          <div style={{ maxHeight: '50vh', overflowY: 'auto', marginRight: '2rem' }}>
            
            {/* CUOTAS */}
            {(searchInput.trim() ? filteredListQuotas : quotas).map((quota, i) => {
              return (
                <div
                  key={`q-${i}`}
                  className="border p-4 my-2 text-start"
                  onClick={() => handleAddProduct(quota, 'quota')}
                  style={{ cursor: 'pointer', width: 300 }}
                >
                  <div className='d-flex justify-content-between'>
                    <div className='text fw-medium'>{quota.name}</div>
                    <div className='text-end fw-medium'>{quota.price}€</div>
                  </div>
                  <div className='text-secondary'>{quota.description}</div>
                </div>
              );
            })}

            {/* PRODUCTOS */}
            {(searchInput.trim() ? filteredList : products).map((product, i) => (
              <div
                key={`p-${i}`}
                className="border my-2 p-3 text-start"
                onClick={() => handleAddProduct(product, 'product')}
                style={{ cursor: 'pointer', width: 300 }}
              >
                <div className='d-flex justify-content-between'>
                  <div className='text fw-medium'>{product.name}</div>
                  <div className='text-end fw-medium'>{product.price}€</div>
                </div>
                <div className='text-secondary fw-light'>{capitalizeFirstWord(product.description)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='col-9' >
          <div className=' px-2'>
            <h2 className='text-muted'>Resumen de Venta</h2>
          </div>
          <table className="table border">
            <thead >
              <tr >
                <th scope='col' className="p-3 text-start col-4">Concepto</th>
                <th scope='col' className="p-3 text-start col-2">Precio</th>
                <th scope='col' className="p-3 text-start col-3">Descuento</th>
                <th scope='col' className="p-3 text-center col-2">Autoventas</th>
                <th scope='col' className="p-3 text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted text-center">No hay productos en esta Venta</td>
                </tr>
              ) : (
                selectedProducts.map((product, i) => {
                  return (
                    <tr key={i}>
                      <td className='p-3 text-primary text-start'>{product.name}</td>
                      <td className='p-3 text-start'>{product.price} €</td>
                      <td className='p-3'>
                        <div className='input-group w-50'>
                          <input
                            type="number"
                            className='form-control'
                            value={product.discount ?? ''}
                            onChange={(e) => handleDiscountChange(i, e.target.value)} />
                          <span className='input-group-text'>€</span>
                        </div>
                      </td>
                      <td className='p-3 text-center'>
                        {product.type === 'quota' ? (
                          <input
                            type="checkbox"
                            style={{
                              width: '20px',
                              height: '20px',
                              border: '1px solid #00000097', // color primario de Bootstrap
                              cursor: 'pointer'
                            }}
                            className="form-check-input"
                            checked={product.selfSale}
                            onChange={(e) => {
                              const updatedProducts = [...selectedProducts];
                              updatedProducts[i].selfSale = e.target.checked;
                              setSelectedProducts(updatedProducts);
                            }}
                          />
                        ) : (
                          <span className="text-secondary" title="Solo disponible en cuotas">
                            <i className="bi bi-lock-fill"></i>
                          </span>
                        )}
                      </td>
                      <td className='p-3 text-center'>
                        <button
                          className='btn btn-outline-danger'
                          onClick={() => handleRemoveProduct(i)}>
                          <i className="bi bi-trash heading"></i>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}

              <tr>
                <td className='border p-4 m-2 text-start' colSpan={5}>
                  <div className="d-flex text-end justify-content-end align-items-center  p-3">
                    <h4 className="fw-medium px-2">Total a pagar: </h4>
                    <h4 className="fw-medium">
                      {totalAmount} €
                    </h4>
                  </div>
                  <div className='d-flex justify-content-end'>
                    <TransactNewSales />
                    <TransactModalSales
                      selectedProducts={selectedProducts}
                      totalAmount={totalAmount}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}
