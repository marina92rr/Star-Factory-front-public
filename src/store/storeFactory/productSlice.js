/**
 * @description Slice de Redux para la gestion de productos de la tienda.
 * Maneja la lista de productos, producto activo, filtro de busqueda y operaciones CRUD.
 *
 * Estado inicial:
 * - isLoadingProduct: boolean - indicador de carga
 * - products: Array - todos los productos
 * - filter: string - termino de busqueda
 * - filteredList: Array - productos filtrados
 * - activeProduct: Object|null - producto seleccionado
 * @module productSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    isLoadingProduct: false,
    products: [],
    filter: '',
    filteredList :[],
    activeProduct: null,
  },
  reducers: {

    //Seleccion categoria
    onSetActiveProduct: (state, { payload }) => {
      state.activeProduct = payload;
    },

    //resetear categoria
    onResetProduct: (state) => {  
      state.activeProduct = null;
    },


    //Añadir categoria
    onAddNewProduct: (state, { payload }) => {
      state.products.push(payload);
      state.activeProduct = null;
    },

    // Modificar cliente por 
    onUpdateProduct: (state, { payload }) => {
      state.products = state.products.map(product => {      //Nuevo array del evento
        if (product.idProduct === payload.idProduct) {
          return payload;
        }
        return product;
      })
    },
    onDeleteProduct: (state, { payload }) => {
      const idToDelete = payload?.idProduct ?? state.activeProduct?.idProduct;
      if (idToDelete != null) {
        state.products = state.products.filter(product => product.idProduct !== idToDelete);
      }
      state.activeProduct = null;
    },

    onLoadProduct: (state, { payload }) => {
      state.isLoadingProduct = false;
      state.products = payload; // ahora sí es un array directamente
    },

    //Filtrar productos Busqueda
    onSetFilterProduct: (state, action) => {
      state.filter = action.payload;

      const normalize = str => (str || '')
        .normalize('NFD')                         // Quita tildes
        .replace(/[\u0300-\u036f]/g, '')          // Elimina marcas de acento
        .toUpperCase()

      const filter = normalize(state.filter);
      // Filtrar labels
      state.filteredList = state.products.filter(product => {
        const fullName = normalize(`${product.name}`);
        return fullName.includes(filter);
      });
    },


  }
})
export const {
  //*Metodos
  onSetActiveProduct,
  onResetProduct,
  onAddNewProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLoadProduct,
  onSetFilterProduct

} = productSlice.actions; //accion