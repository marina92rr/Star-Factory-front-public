/**
 * @description Componente de busqueda de etiquetas.
 * Permite filtrar etiquetas por nombre con un input de texto.
 * @returns {JSX.Element} Input de busqueda de etiquetas
 */
import  { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLabelsStore } from '../../../hooks/useLabelsStore';


// Componente para buscar y filtrar Labels por nombre
export const FindLabel = () => {

  const dispatch = useDispatch();

  const { startFindLabels, filter, filteredList } = useLabelsStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');


  //Filtrar clientes
  const handleFilterChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    dispatch(startFindLabels(value));
    setShowDropdown(value.trim().length > 0 && filteredList.length > 0);
  };


  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  const handleFocus = () => {
    setShowDropdown(filter.trim().length > 0 && filteredList.length > 0);
  };

 

  return (

    <div className="mb-1 col-10 position-relative">

      <input
        type="text"
        placeholder="Buscar..."
        className='form-control rounded-3 bg-light-subtle p-1'
        style={{ outline: 'none', borderColor: 'gray' }}
        value={inputValue}
        onChange={handleFilterChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />

      
    </div>

  )
}
