/**
 * @description Input de busqueda de etiquetas en el modal de asignacion.
 * Permite filtrar las etiquetas disponibles por nombre.
 * @returns {JSX.Element} Input de busqueda con funcionalidad de filtrado
 */
import { useState } from "react";


export const LabelSearchInput = ({ onSearch, placeholder = 'Buscar...' }) => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = e => {
    setInputValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      className='form-control w-100'
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      autoComplete="off"
    />
  );
};