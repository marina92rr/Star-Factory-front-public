/**
 * @description Slice de Redux para la gestion de categorias de la tienda.
 * Maneja la lista de categorias, categoria activa y operaciones CRUD.
 *
 * Estado inicial:
 * - isLoadingCategory: boolean - indicador de carga
 * - categories: Array - todas las categorias de productos
 * - activeCategory: Object|null - categoria seleccionada
 * @module categorySlice
 */
import { createSlice } from '@reduxjs/toolkit';
import { normalizeAllTextFields } from '../../helpers/normalizeText';

export const categorySlice = createSlice({
  name: 'category',
  initialState:{
    isLoadingCategory: false,
    categories: [],
    activeCategory: null,
  },
  reducers: {
   
    //Seleccion categoria
    onSetActiveCategory: (state, {payload}) =>{
        state.activeCategory = payload;
    },
    onResetCategory: (state) => {
        state.activeCategory = null;
    },


    //Añadir categoria
    onAddNewCategory: (state, {payload}) =>{

        state.category.push(payload);
        state.activeCategory = null;
    },

      // Modificar cliente por 
    onUpdateCategory:(state, {payload})=>{
      state.categories = state.categories.map( category =>{      //Nuevo array del evento
        if( category.idCategory === payload.idCategory){
          return payload;
        }
        return category;
      })   
    },
    onLoadCategory : (state, {payload}) =>{
        state.isLoadingCategory = false;
        state.categories = payload;

         payload.forEach( category =>{
        const exists = state.categories.some( dbCategory => dbCategory.id === category.id);
        if( !exists){
          state.categories.push(category)
        }
      })
    },
    onDeleteCategory:(state, { payload }) =>{
      const idToDelete = payload?.idCategory ?? state.activeCategory?.idCategory;
      if (idToDelete != null) {
        state.categories = state.categories.filter(category => category.idCategory !== idToDelete);
      }
      state.activeCategory = null;
    },

}
})
export const { 
    //*Metodos
    onSetActiveCategory, 
    onResetCategory,
    onAddNewCategory, 
    onUpdateCategory,
    onLoadCategory,
    onDeleteCategory 
} = categorySlice.actions; //accion