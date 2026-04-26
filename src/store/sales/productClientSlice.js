/**
 * @description Slice de Redux para la gestion de productos asignados a clientes (ventas).
 * Maneja los registros de ventas, productos pagados/impagados, filtros por fecha,
 * rango de fechas, paginacion, productos pendientes mensuales y facturas.
 *
 * Estado inicial:
 * - productClients: Array - registros de productos-cliente guardados
 * - productsClientUnpaid: Array - productos no pagados
 * - productsClientPaid: Array - productos pagados
 * - activeProductClient: Object|null - registro seleccionado
 * - selectedDate: string|null - fecha seleccionada (YYYY-MM-DD)
 * - productsClientDate: Array - productos filtrados por fecha
 * - productsClientRange: Array - productos filtrados por rango (paginados)
 * - productsByRangeAll: Array - productos filtrados por rango (todos)
 * - page: number - pagina actual de paginacion
 * - totalPages: number - total de paginas
 * - productsPendingMonth: Array - productos pendientes del mes (paginados)
 * - productsPendingMonthAll: Array - productos pendientes del mes (todos)
 * - billClients: Array - registros de facturas
 * - billDate: Array - facturas filtradas por fecha
 * @module productClientSlice
 */
import { createSlice } from "@reduxjs/toolkit";

export const productClientSlice = createSlice({
  name: "productClient",
  initialState: {
    productClients: [], // registros guardados
    isLoadingProduct: false,
    isLoadingProductsClientUnpaid: false,
    productsClientUnpaid: [],
    isLoadingProductsClientPaid: false,
    productsClientPaid: [],
    activeProductClient: null,
    selectedDate: null, // string 'YYYY-MM-DD'
    productsClientDate: [], // productos filtrados por fecha
    productsClientRange: [], // productos filtrados por rango de fechas
    productsByRangeAll: [], // 👈 NUEVO
    page: 1, //Paginacion resume
    totalPages: 1,
    productsPendingMonth: [], // productos filtrados por rango de fechas
    productsPendingMonthAll: [],
    billClients: [], //Para crear registro de factura
    isLoadingBill: false,
    billDate: [],
  },
  reducers: {
    //Seleccion categoria
    onSetActiveProductClient: (state, { payload }) => {
      state.activeProductClient = payload;
    },

    clearActiveProductClient: (state) => {
      state.activeProductClient = null; // 🔹 Aquí limpia
    },

    //Añadir Producto a cliente
    onAddNewProductClient: (state, { payload }) => {
      state.productClients.push(payload);
      state.activeProductClient = null;
    },

    onLoadAllProductsClient: (state, { payload }) => {
      state.isLoadingProduct = false;
      state.productClients = payload; // ahora sí es un array directamente
    },

    onLoadProductsClient: (state, { payload }) => {
      state.isLoadingProduct = false;
      state.productClients = payload; // ahora sí es un array directamente
    },

    onLoadProductsClientPaid: (state, { payload }) => {
      state.isLoadingProductsClientPaid = false;
      state.productsClientPaid = payload; // ahora sí es un array directamente
    },

    onLoadProductsClientUnpaid: (state, { payload }) => {
      state.isLoadingProductsClientUnpaid = false;
      state.productsClientUnpaid = payload; // ahora sí es un array directamente
    },

    //Productos no pagados
    onUpdateProductClient: (state, { payload }) => {
      state.productsClientUnpaid = state.productsClientUnpaid.map(
        (productClient) => {
          //Nuevo array del evento
          if (productClient.idProductClient === payload.idProductClient) {
            return payload;
          }
          return productClient;
        },
      );
    },

    // productClientSlice.js
    onUpdateUnpaidProductsByClient: (state, { payload }) => {
      const { idClient, updates } = payload; // p.ej. { paymentMethod: 'efectivo' }
      state.productsClientUnpaid = state.productsClientUnpaid.map((p) =>
        p.idClient === idClient ? { ...p, ...updates } : p,
      );
    },

    onDeleteProductClient: (state, { payload }) => {
      const idToDelete = payload?.idProductClient ?? state.activeProductClient?.idProductClient;
      if (idToDelete != null) {
        state.productsClientUnpaid = state.productsClientUnpaid.filter(
          (productClient) => productClient.idProductClient !== idToDelete,
        );
      }
      state.activeProductClient = null;
    },

    //Filtrar productos por Fecha
    onSetSelectedDate: (state, { payload }) => {
      state.selectedDate = payload; // string 'YYYY-MM-DD'
    },
    onLoadProductsByDate: (state, { payload }) => {
      state.isLoadingProduct = false;
      state.productsClientDate = payload; // array de productClient
    },

    //Filtrar productos por Rango de Fecha
    onLoadProductsByRange: (state, { payload }) => {
      state.productsClientRange = payload.data || []; // 👈 ARRAY SIEMPRE
      state.page = payload.page;
      state.totalPages = payload.totalPages;
    },

    onLoadProductsByRangeAll: (state, { payload }) => {
      state.productsByRangeAll = payload.data;
    },

    //Filtrar productos por Rango de Fecha
    onLoadProductsPendingMonth: (state, { payload }) => {
      state.productsPendingMonth = payload.data || []; // 👈 ARRAY SIEMPRE
      state.page = payload.page;
      state.totalPages = payload.totalPages;
    },

    onLoadProductsPendingMonthAll: (state, { payload }) => {
      state.productsPendingMonthAll = payload.data;
    },

    //Reseteo de paginas
    resetPagination: (state) => {
      state.page = 1;
      state.totalPages = 1;
    },

    //Añadir Factura a cliente
    onAddNewBillClient: (state, { payload }) => {
      state.billClients.push(payload);
    },
    onStartLoadingBill: (state) => {
      state.isLoadingBill = true;
    },
    //Devuelve las facturas por fecha
    onLoadBillByDate: (state, { payload }) => {
      state.isLoadingBill = false;
      state.billDate = payload;
    },
  },
});
export const {
  onSetActiveProductClient,
  clearActiveProductClient,
  onLoadProductsClient,
  onLoadAllProductsClient,
  onLoadProductsClientPaid,
  onLoadProductsClientUnpaid,
  onAddNewProductClient,
  onUpdateProductClient,
  onUpdateUnpaidProductsByClient,
  onDeleteProductClient,

  onSetSelectedDate,
  onLoadProductsByDate,
  onLoadProductsByRange,
  onLoadProductsByRangeAll,
  onLoadProductsPendingMonth,
  onLoadProductsPendingMonthAll,
  resetPagination,
  onAddNewBillClient,
  onStartLoadingBill,
  onLoadBillByDate,
} = productClientSlice.actions; //accion
