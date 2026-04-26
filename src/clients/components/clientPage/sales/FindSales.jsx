/**
 * @description Componente de busqueda de ventas/productos en la vista de ventas de un cliente.
 * Permite filtrar productos y cuotas disponibles para agregar a una venta.
 * @returns {JSX.Element} Input de busqueda con dropdown de productos/cuotas
 */
import  { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useProductStore } from '../../../../hooks/useProductStore';
import { useQuotaStore } from '../../../../hooks/useQuotaStore';

// Componente para buscar y filtrar Labels por nombre
export const FindSales = ({ onInputChange }) => {

   const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const { startFindProducts } = useProductStore();
  const { startFindQuotas } = useQuotaStore();

   const handleFilterChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    onInputChange(value); // ✅ notifica a AddNewSales
    dispatch(startFindProducts(value));
    dispatch(startFindQuotas(value));
  };

  return (
    <input
      type="text"
      placeholder="Buscar producto o cuota..."
      className="form-control rounded-1 ms-2 bg-light-subtle my-2 p-2 "
      style={{ width: 300}}
      value={inputValue}
      onChange={handleFilterChange}
      autoComplete="off"
    />
  );
}
