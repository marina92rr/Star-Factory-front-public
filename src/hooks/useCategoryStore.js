/**
 * @description Hook personalizado para la gestion de categorias de la tienda.
 * Interactua con el store de Redux (categorySlice) y la API del backend para
 * manejar CRUD de categorias y reseteo de la pagina de tienda.
 *
 * Propiedades: categories, activeCategory
 * Metodos: setActiveCategory, startResetStorePage, starLoadingCategories,
 * startSavingCategory, startDeleteCategory
 *
 * @returns {Object} Propiedades y metodos del hook de categorias
 */
import { useDispatch, useSelector } from "react-redux"
import { onAddNewCategory, onDeleteCategory, onLoadCategory, onResetCategory, onSetActiveCategory, onUpdateCategory } from "../store/storeFactory/categorySlice";
import { clientsApi } from "../api";
import { normalizeAllTextFields } from "../helpers/normalizeText";
import { onResetProduct } from "../store/storeFactory/productSlice";
import Swal from 'sweetalert2';

export const useCategoryStore = () => {
 
    const dispatch = useDispatch();
    const { categories, activeCategory} = useSelector( state => state.category);


const setActiveCategory = (categoryData) =>{
    dispatch(onSetActiveCategory(categoryData))
}

const startResetStorePage = () => {
    dispatch(onResetCategory());
    dispatch(onResetProduct());
}

// Actualizar o crear una categoria 
    const startSavingCategory = async(categorytSave, isEditMode) =>{
        try {
            const normalizedCategory = normalizeAllTextFields(categorytSave); //  normalizar todos los campos string
            
            if (isEditMode) {
                const { data } = await clientsApi.put(`/category/${normalizedCategory.idCategory}`, normalizedCategory);
                dispatch(onUpdateCategory(data));
            return;
            }
            const {data} = await clientsApi.post('category', normalizedCategory);
            dispatch( onAddNewCategory(data));

        } catch (error) {
            const msg = error?.response?.data?.msg || 'Error al guardar la categoría';
            Swal.fire('Error', msg, 'error');
        }
    }

     //Lectura de categorias
        const starLoadingCategories = async() =>{
    
            try {
                //const {data} = await axios.get('http://localhost:4001/api/store');
                const {data} = await clientsApi.get('category');
                const category = data.categories;
    
                dispatch(onLoadCategory(category));
                
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
            }
        };
        const  startDeleteCategory = async(category)=>{
            const target = category || activeCategory;
            await clientsApi.delete(`/category/${target.idCategory}`);
            dispatch(onDeleteCategory(target));
        }
        
             return{
            //*Propiedades
            categories,
            activeCategory,

            //*Metodos
            setActiveCategory,
            startResetStorePage,
            starLoadingCategories,
            startSavingCategory,
            startDeleteCategory
        
        }

    }