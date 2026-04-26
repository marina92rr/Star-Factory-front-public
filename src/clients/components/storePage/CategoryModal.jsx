/**
 * @description Modal para crear o editar una categoria de productos.
 * Incluye formulario con validacion del nombre.
 * Detecta automaticamente si es modo creacion o edicion segun activeCategory.
 * @returns {JSX.Element} Modal con formulario de categoria
 */
import Modal from 'react-modal'
import { useEffect, useMemo, useState } from 'react'
import { useUiStore } from '../../../hooks/useUiStore';
import { useCategoryStore } from '../../../hooks/useCategoryStore';
import {customStyleModal} from '../../../helpers/customStyleModal';


Modal.setAppElement('#root');


export const CategoryModal = () => {

  const { isModalCategoryOpen, closeCategoryModal } = useUiStore(); //Abrir y cerrar modal
  const { activeCategory, startSavingCategory, starLoadingCategories } = useCategoryStore();

  const isEditCategory = !!activeCategory?.idCategory;


  //Estado valor
  const [formValues, setFormValues] = useState({
    name: ''
  });

  //Subir estado formulario
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (isEditCategory) {
      setFormValues({ ...activeCategory });
    } else {
      setFormValues({
        name: ''
      });
    }
  }, [activeCategory]);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';
    return formValues.name.trim().length > 0 ? 'is-valid' : 'is-invalid';
  }, [formValues.name, formSubmitted]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (formValues.name.trim().length === 0) return;

    await startSavingCategory(formValues, isEditCategory);  // Guarda en la BBDD
    closeCategoryModal();  // Debería cerrar el modal
    await starLoadingCategories();  // Recarga desde backend

    isEditCategory
      ? setFormValues({ ...formValues })
      : setFormValues({ name: '' }); // Limpia el formulario si no es edición

    setFormSubmitted(false);
  };


  return (
    <Modal
      isOpen={isModalCategoryOpen}
      closeTimeoutMS={200}
      onRequestClose={closeCategoryModal}
      style={customStyleModal}
      contentLabel={isEditCategory ? 'Actualizar Categoría' : 'Nueva Categoría'} >

      <h1>{isEditCategory ? 'Actualizar Categoría' : 'Nueva Categoría'}</h1>
      <hr />
      <form className='container' onSubmit={onSubmit}>
        <div className='mb-3'>
          <label className="form-label">Nombre</label>
          <input
            className={`form-control ${titleClass}`}
            name='name'
            type="text"
            value={formValues.name}
            onChange={onInputChange}
          />
        </div>
        <button type='submit' className='btn btn-success btn-block'>
          {isEditCategory ? 'Actualizar' : 'Crear'}
        </button>
      </form>
    </Modal>
  )
}
