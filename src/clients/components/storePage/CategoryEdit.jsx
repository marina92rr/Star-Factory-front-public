/**
 * @description Boton para editar la categoria activa.
 * Establece la categoria activa y abre el modal de edicion.
 * @returns {JSX.Element} Boton de edicion de categoria
 */
import { useUiStore } from '../../../hooks/useUiStore'
import { useProductStore } from '../../../hooks/useProductStore';
import { useCategoryStore } from '../../../hooks/useCategoryStore';

export const CategoryEdit= () => {

  const {openCategoryModal} = useUiStore();
  const {setActiveCategory, activeCategory} = useCategoryStore();

  const handleClickNew = () => {
    setActiveCategory(activeCategory);
    openCategoryModal();
  }
  return (
    <div>
        <button   
          className='btn btn-secondary mx-2'
          onClick={handleClickNew}>
            Editar
        </button>
    </div>
  )
}
