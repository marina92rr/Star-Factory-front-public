/**
 * @description Boton para crear una nueva categoria de productos.
 * Limpia la categoria activa y abre el modal de creacion.
 * @returns {JSX.Element} Boton "Anadir Categoria"
 */
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useUiStore } from "../../../hooks/useUiStore"


export const CategoryAddNew = () => {

  const {openCategoryModal} = useUiStore();
  const {setActiveCategory} = useCategoryStore();


  const handleClickNew = () =>{
        setActiveCategory({
            name: '',
        })
        openCategoryModal();
    }

  return (
    <button
      className="btn mx-auto"
       style={{ background: '#38b647', color: 'white' }}
      onClick={handleClickNew}>
      Añadir Categoría
    </button>
  )
}
