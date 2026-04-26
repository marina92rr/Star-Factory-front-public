/**
 * @description Hook personalizado para la gestion de productos de la tienda.
 * Interactua con el store de Redux (productSlice) y la API del backend para
 * manejar CRUD de productos, carga por categoria, busqueda y filtrado.
 *
 * Propiedades: products, activeProduct, filter, filteredList
 * Metodos: setActiveProduct, startSavingProduct, starLoadingProducts,
 * startLoadingProductsByCategory, startDeleteProduct, startFindProducts
 *
 * @returns {Object} Propiedades y metodos del hook de productos
 */
import { useDispatch, useSelector } from "react-redux"
import { clientsApi } from "../api";
import { onAddNewProduct, onLoadProduct, onSetActiveProduct, onDeleteProduct, onUpdateProduct, onSetFilterProduct } from "../store/storeFactory/productSlice";
import { normalizeAllTextFields } from "../helpers/normalizeText";
import Swal from 'sweetalert2';

export const useProductStore = () => {

    const dispatch = useDispatch();
    const { products, activeProduct,filter, filteredList } = useSelector(state => state.product);

    //Producto activo
    const setActiveProduct = (productData) => {
        dispatch(onSetActiveProduct(productData))
    }


    // Nuevo producto 
    const startSavingProduct = async (productSave, isEditMode) => {
        try {
            const normalizedProduct = normalizeAllTextFields(productSave); //  normalizar todos los campos string
            if (isEditMode) {
                const { data } = await clientsApi.put(`/products/${productSave.idProduct}`, normalizedProduct);
                dispatch(onUpdateProduct(data));
                return;
            }

            const { data } = await clientsApi.post('/products', normalizedProduct);
            dispatch(onAddNewProduct(data));
        } catch (error) {
            const msg = error?.response?.data?.msg || 'Error al guardar el producto';
            Swal.fire('Error', msg, 'error');
        }
    }

    const startDeleteProduct = async (product) => {
         try {
            await clientsApi.delete(`/products/${product.idProduct}`);
            dispatch(onDeleteProduct(product));

        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        }
    }


    //Lectura de productos por categorias
    const startLoadingProductsByCategory = async (idCategory) => {
        try {
            const { data } = await clientsApi.get(`/products/${idCategory}`);
            dispatch(onLoadProduct(data.products));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        }
    };
    //Lectura de productos
    const starLoadingProducts = async () => {

        try {
            //const {data} = await axios.get('http://localhost:4001/api/store');
            const { data } = await clientsApi.get('/products');
            const product = data.products;

            dispatch(onLoadProduct(product));

        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        }
    };

    //Buscador producto
      // Filtrar products Buscar...
      const startFindProducts = (searchTerm) => async (dispatch) => {
        //const { label } = getState();
        try {
          const { data } = await clientsApi.get('products');
          dispatch(onLoadProduct(data.products));
        } catch (error) {
          Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        }
        dispatch(onSetFilterProduct(searchTerm));
      };

    return {
        //*Propiedades
        products,
        activeProduct,
        filter,
        filteredList,

        //*Metodos
        setActiveProduct,
        startSavingProduct,
        starLoadingProducts,
        startLoadingProductsByCategory,
        startDeleteProduct,
        startFindProducts
    

    }

}