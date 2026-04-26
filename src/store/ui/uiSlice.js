/**
 * @description Slice de Redux para el control del estado de la interfaz de usuario (UI).
 * Gestiona el estado abierto/cerrado de todos los modales de la aplicacion:
 * cliente, etiqueta, categoria, producto, tarifa, cuota, venta, baja,
 * suscripcion, producto-cliente, usuario, contrasena y facturacion.
 *
 * Cada modal tiene un par de reducers: onOpen[X]Modal / onClose[X]Modal
 * que alternan el booleano correspondiente en el estado.
 * @module uiSlice
 */
import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    //Clinte
    isModalClientOpen: false,
    //Etiqueta
    isModalLabelOpen: false,
    isModalCreateLabelOpen: false,
    isModalColorLabelOpen: false,
    isModalFilterClientsByLabelOpen: false,
    //Tienda
    isModalCategoryOpen: false,
    isModalProductOpen: false,
    //Tarifa
    isModalRateOpen: false,
    isModalQuotaOpen: false,
    isModalSaleOpen: false,
    //Cancellation
    isModalCancellationOpen: false,
    isModalCancelSuscribeClienOpen: false,  //Dar baja inmediata
    //SuscriptionClient / autocompras
    isModalSuscriptionClientOpen: false,
    //ProductClientUnpaid
    isModalProductClientUnpaidOpen: false,
    isModalTotalProductClientUnpaidOpen: false,

    //ProductClient
    isModalProductClientOpen: false,

    //ProductClientAdmin
    isModalProductClientAdminOpen: false,
    //USUARIOS
    isModalUserOpen: false,
    isModalPasswordUser: false,
    //Factura cliente
    isModalClientBillOpen: false,
  },
  reducers: {

    //Abrir modal Cliente
    onOpenClientModal: (state) => { state.isModalClientOpen = true; },
    //Cerrar modal Cliente
    onCloseClientModal: (state) => { state.isModalClientOpen = false; },

    //Abrir modal Label
    onOpenLabelModal: (state) => { state.isModalLabelOpen = true; },
    //Cerrar modal Label
    onCloseLabelModal: (state) => { state.isModalLabelOpen = false; },

    //Abrir modal Create Label
    onOpenCreateLabelModal: (state) => { state.isModalCreateLabelOpen = true; },
    //Cerrar modal Create Label
    onCloseCreateLabelModal: (state) => { state.isModalCreateLabelOpen = false; },

    //Abrir modal Color Label
    onOpenColorLabelModal: (state) => { state.isModalColorLabelOpen = true; },
    //Cerrar modal color Label
    onCloseColorLabelModal: (state) => { state.isModalColorLabelOpen = false; },

    //Abrir modal Filtrar clientes por etiqueta
    onOpenFilterClientsByLabelModal: (state) => { state.isModalFilterClientsByLabelOpen = true; },
    //Cerrar modal Filtrar clientes por etiqueta
    onCloseFilterClientsByLabelModal: (state) => { state.isModalFilterClientsByLabelOpen = false; },

    //Abrir modal Categoria
    onOpenCategoryModal: (state) => { state.isModalCategoryOpen = true; },
    //Cerrar modal Categoria
    onCloseCategoryModal: (state) => { state.isModalCategoryOpen = false; },

    //Abrir modal Producto
    onOpenProductModal: (state) => { state.isModalProductOpen = true; },
    //Cerrar modal Producto
    onCloseProductModal: (state) => { state.isModalProductOpen = false; },


    //Abrir modal Rate
    onOpenRateModal: (state) => { state.isModalRateOpen = true; },
    //Cerrar modal Rate
    onCloseRateModal: (state) => { state.isModalRateOpen = false; },
    //Abrir modal cuota
    onOpenQuotaModal: (state) => { state.isModalQuotaOpen = true; },
    //Cerrar modal cuota
    onCloseQuotaModal: (state) => { state.isModalQuotaOpen = false; },

    //Venta Modal
    onOpenSaleModal: (state) => { state.isModalSaleOpen = true; },
    //Cerrar modal Rate
    onCloseSaleModal: (state) => { state.isModalSaleOpen = false; },

        //Abrir modal Baja Inmediata
    onOpenCancelSuscribeClientModal: (state) => { state.isModalCancelSuscribeClienOpen = true; },
    //Cerrar modal Baja Inmediata
    onCloseCancelSuscribeClientModal: (state) => { state.isModalCancelSuscribeClienOpen = false; },

    //Abrir modal Baja Programada
    onOpenCancellationModal: (state) => { state.isModalCancellationOpen = true; },
    //Cerrar modal Baja Programada
    onCloseCancellationModal: (state) => { state.isModalCancellationOpen = false; },

    //------------- SUSCRIPTION CLIENT ----------------
     //Abrir modal Cancellation
    onOpenSuscriptionClientModal: (state) => { state.isModalSuscriptionClientOpen = true; },
    //Cerrar modal Cancellation
    onCloseSuscriptionClientModal: (state) => { state.isModalSuscriptionClientOpen = false; },

        //------------- PRODUCTCLIENT ----------------
     //Abrir modal unpaid
    onOpenProductClientUnpaidModal: (state) => { state.isModalProductClientUnpaidOpen = true; },
    //Cerrar modal unpaid
    onCloseProductClientUnpaidModal: (state) => { state.isModalProductClientUnpaidOpen = false; },

         //Abrir modal unpaid
    onOpenTotalProductClientUnpaidModal: (state) => { state.isModalTotalProductClientUnpaidOpen = true; },
    //Cerrar modal unpaid
    onCloseTotalProductClientUnpaidModal: (state) => { state.isModalTotalProductClientUnpaidOpen = false; },

    //Abrir modal allProductClient
    onOpenProductClientModal: (state) => { state.isModalProductClientOpen = true; },
    //Cerrar modal allProductClient
    onCloseProductClientModal: (state) => { state.isModalProductClientOpen = false; },


        //Abrir modal allProductClientAdmin
    onOpenProductClientAdminModal: (state) => { state.isModalProductClientAdminOpen = true; },
    //Cerrar modal allProductClientAdmin
    onCloseProductClientAdminModal: (state) => { state.isModalProductClientAdminOpen = false; },

    //Abrir modal Usuario
    onOpenUserModal: (state) => { state.isModalUserOpen = true; },
    //Cerrar modal Usuario
    onCloseUserModal: (state) => { state.isModalUserOpen = false; },

    //Abrir modal Password Usuario
     onOpenPasswordUserModal: (state) => { state.isModalPasswordUser = true; },
    //Cerrar modal Password Usuario
     onClosePasswordUserModal: (state) => { state.isModalPasswordUser = false; },

      //Abrir modal Facturar Usuario
     onOpenClientBillModal: (state) => { state.isModalClientBillOpen = true; },
    //Cerrar modal Facturar Usuario
     onCloseClientBillModal: (state) => { state.isModalClientBillOpen = false; },




  },
})
export const {
  //*Client
  onCloseClientModal,
  onOpenClientModal,

  //*Label
  onOpenLabelModal,
  onCloseLabelModal,
  //*Create Label
  onOpenCreateLabelModal,
  onCloseCreateLabelModal,
  //*Color Label
  onOpenColorLabelModal,
  onCloseColorLabelModal,
  //*Filter Clients by Label
  onOpenFilterClientsByLabelModal,
  onCloseFilterClientsByLabelModal,

  //*Category
  onOpenCategoryModal,
  onCloseCategoryModal,

  //*Product
  onOpenProductModal,
  onCloseProductModal,
  //*Rate
  onOpenRateModal,
  onCloseRateModal,
  //*Quota
  onOpenQuotaModal,
  onCloseQuotaModal,
  //*Venta
  onOpenSaleModal,
  onCloseSaleModal,
  //*Baja
  onOpenCancelSuscribeClientModal,
  onCloseCancelSuscribeClientModal,
  //*Baja Programada
  onOpenCancellationModal,
  onCloseCancellationModal,
  //*SuscriptionClient
  onOpenSuscriptionClientModal,
  onCloseSuscriptionClientModal,
  //*ProductClientUnpaid
  onOpenProductClientUnpaidModal,
  onCloseProductClientUnpaidModal,
  //*TotalProductClientUnpaid
  onOpenTotalProductClientUnpaidModal,
  onCloseTotalProductClientUnpaidModal,
  //*ProductClient
  onOpenTotalProductClientModal,
  onCloseTotalProductClientModal,
  //*ProductClient
  onOpenProductClientModal,
  onCloseProductClientModal,
  //*ProductClient Admin
  onOpenProductClientAdminModal,
  onCloseProductClientAdminModal,

  //*USUARIOS
  onOpenUserModal,
  onCloseUserModal,

  //*Password USUARIOS
  onOpenPasswordUserModal,
  onClosePasswordUserModal,

  //Facturar Usuario
  onOpenClientBillModal,
  onCloseClientBillModal,

} = uiSlice.actions; //accion