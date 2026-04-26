import { useDispatch, useSelector } from "react-redux";
import { clientsApi } from "../api";
import { normalizeAllTextFields } from "../helpers/normalizeText";
import {
  clearActiveProductClient,
  onAddNewBillClient,
  onAddNewProductClient,
  onDeleteProductClient,
  onLoadAllProductsClient,
  onLoadProductsByDate,
  onLoadProductsByRange,
  onLoadProductsByRangeAll,
  onLoadProductsClient,
  onLoadProductsClientPaid,
  onLoadProductsClientUnpaid,
  onLoadProductsPendingMonth,
  onLoadProductsPendingMonthAll,
  onSetActiveProductClient,
  onSetSelectedDate,
  onUpdateProductClient,
  onUpdateUnpaidProductsByClient,
  resetPagination,
  onStartLoadingBill,
  onLoadBillByDate,
} from "../store/sales/productClientSlice";

export const useProductClientStore = () => {
  const dispatch = useDispatch();
  const {
    productClients,
    productsClientPaid,
    productsClientUnpaid,
    activeProductClient,
    selectedDate,
    productsClientDate,
    productsClientRange,
    productsByRangeAll,
    page,
    totalPages,
    productsPendingMonth,
    productsPendingMonthAll,
    billClientSave,
    billDate,
    isLoadingBill,
  } = useSelector((state) => state.productClient);

  //Producto activo
  const setActiveProductClient = (productclientData) => {
    dispatch(onSetActiveProductClient(productclientData));
  };

  //Limpiar producto activo
  const startClearActiveProductClient = () => {
    dispatch(clearActiveProductClient());
  };

  //Lectura de productos por fecha
  const getAllProductsClientByDate = async (date) => {
    try {
      const { data } = await clientsApi.get(`/productclient/date/${date}`);
      dispatch(onLoadAllProductsClient(data.productsClient)); // ¡Ojo! Asegúrate del nombre exacto del action
    } catch (error) {
      console.error("❌ Error cargando productos por fecha:", error);
    }
  };

  //Lectura de productos por cliente
  const startLoadingProductsByClient = async (idClient) => {
    try {
      const { data } = await clientsApi.get(`/productclient/${idClient}`);
      dispatch(onLoadProductsClient(data.productsClient)); // ¡Ojo! Asegúrate del nombre exacto del action
    } catch (error) {
      console.error("❌ Error cargando productos del cliente:", error);
    }
  };

  //Lectura de productos no pagados por cliente
  const startLoadingProductsClientPaid = async (idClient) => {
    try {
      const { data } = await clientsApi.get(`/productclient/paid/${idClient}`);
      dispatch(onLoadProductsClientPaid(data.productsClientPaid)); // ¡Ojo! Asegúrate del nombre exacto del action
    } catch (error) {
      console.error("❌ Error cargando productos del cliente:", error);
    }
  };

  //Lectura de productos no pagados por cliente
  const startLoadingProductsClientUnpaid = async (idClient) => {
    try {
      const { data } = await clientsApi.get(
        `/productclient/unpaid/${idClient}`,
      );
      dispatch(onLoadProductsClientUnpaid(data.productsClientUnpaid)); // ¡Ojo! Asegúrate del nombre exacto del action
    } catch (error) {
      console.error("❌ Error cargando productos del cliente:", error);
    }
  };

  // Nuevo producto de administración
  const startSavingAdministrationProductClient = async (productClientSave) => {
    try {
      const normalizedProductClient = normalizeAllTextFields(productClientSave); //  normalizar todos los campos string
      const { data } = await clientsApi.post(
        "/productclient/administration",
        normalizedProductClient,
      );
      dispatch(onAddNewProductClient(data));
    } catch (error) {
      console.log("Error en Front", error);
    }
  };

  const startSavingBillClient = async (billData) => {
    try {
      const needsBlob = billData.action === "save" || billData.action === "save_send";
      const config = needsBlob ? { responseType: "blob" } : {};

      const response = await clientsApi.post(
        "/productclient/bill",
        billData,
        config,
      );

      return response;
    } catch (error) {
      console.error("Error creando factura", error);
      throw error;
    }
  };

  const starGetBillById = async (billId, action) => {
    try {
      const needsBlob = action === "print" || action === "print_send";
      const config = needsBlob ? { responseType: "blob" } : {};

      const response = await clientsApi.post(
        `/productclient/bill/${billId}`,
        { action },
        config,
      );

      return response;
    } catch (error) {
      console.error("Error procesando factura", error);
      throw error;
    }
  };

  // Nuevo producto
  const startSavingProductClient = async (productClientSave, isEditMode) => {
    try {
      const normalizedProductClient = normalizeAllTextFields(productClientSave); //  normalizar todos los campos string
      if (isEditMode) {
        const { data } = await clientsApi.put(
          `/productclient/${productClientSave.idClient}`,
          normalizedProductClient,
        );
        dispatch(onUpdateProductClient(data));
        return;
      }

      const { data } = await clientsApi.post(
        "/productclient",
        normalizedProductClient,
      );

      if (Array.isArray(data)) {
        data.forEach((item) => dispatch(onAddNewProductClient(item)));
      } else {
        dispatch(onAddNewProductClient(data));
      }
    } catch (error) {
      console.log("Error en Front", error);
    }
  };

  //Actualizar Producto
  const startUpdateProductClient = async (unpaid) => {
    try {
      const p = normalizeAllTextFields(unpaid);
      const { data } = await clientsApi.put(
        `/productclient/unpaid/${p.idProductClient}`,
        p,
      );
      const updated = data?.suscription ?? data ?? p;
      //dispatch(onUpdateProductClient(updated));
      return updated;
    } catch (e) {
      console.error("Error actualizando suscripción:", e);
      throw e;
    }
  };

  //Actualizar suscripción
  const startPaidTotalProductClient = async (idClient, paymentMethod) => {
    try {
      // 1) Llamada al backend (espera { paymentMethod } como objeto)
      await clientsApi.put(`/productclient/totalunpaid/${idClient}`, {
        paymentMethod,
      });

      // 2) Actualiza SOLO campos en Redux (sin tocar paid ni mover arrays)
      dispatch(
        onUpdateUnpaidProductsByClient({
          idClient,
          updates: { paymentMethod },
        }),
      );
    } catch (e) {
      console.error("Error liquidando impagados del cliente:", e);
    }
  };

  //Obtener producto por fecha CONTABILIDAD
  const setSelectedDate = (date) => {
    dispatch(onSetSelectedDate(date)); // 'YYYY-MM-DD'
  };

  const startLoadProductsByDate = async (date) => {
    try {
      // Normaliza a 'YYYY-MM-DD'
      const normalizedDate =
        date?.length === 10 ? date : new Date(date).toISOString().slice(0, 10);

      const { data } = await clientsApi.get(
        `/productClient/date/${normalizedDate}`,
      );
      dispatch(onLoadProductsByDate(data.productsClient || []));
    } catch (e) {
      console.error("Error cargando productos por fecha", e);
    }
  };

  const startLoadBillByDate = async (date) => {
    try {
      dispatch(onStartLoadingBill());
      // Normaliza a 'YYYY-MM-DD'
      const normalizedDate =
        date?.length === 10 ? date : new Date(date).toISOString().slice(0, 10);

      const { data } = await clientsApi.get(
        `/productClient/billdate/${normalizedDate}`,
      );
      dispatch(onLoadBillByDate(data.bills || []));
    } catch (e) {
      console.error("Error cargando facturas por fecha", e);
    }
  };

  // Eliminar productClient
  const startDeleteProductClient = async (unpaid) => {
    try {
      await clientsApi.delete(
        `/productclient/unpaid/${unpaid.idProductClient}`,
      );
      dispatch(onDeleteProductClient(unpaid));
    } catch (error) {
      console.error("Error al eliminar venta impagada:", error);
      throw error;
    }
  };

  // Eliminar factura o item
  const startDeleteBillClient = async ({
    billId,
    total = false,
    itemIndex = null,
    date,
  }) => {
    try {
      await clientsApi.delete(`/productclient/bill/${billId}`, {
        data: { total, itemIndex },
      });

      // Recargar las facturas del día actual
      if (date) startLoadBillByDate(date);
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // Filtrar productos por rango de fechas
  const startProductClientByRange = async (startDate, endDate, page = 1) => {
    try {
      const { data } = await clientsApi.get("/productClient/range", {
        params: {
          startDate,
          endDate,
          page,
          limit: 20,
        },
      });

      dispatch(
        onLoadProductsByRange({
          data: data.data,
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        }),
      );
    } catch (e) {
      console.error("Error cargando productos por rango", e);
    }
  };

  // Filtrar productos por rango de fechas
  const startProductClientByRangeAll = async (startDate, endDate) => {
    try {
      const { data } = await clientsApi.get("/productClient/range", {
        params: {
          startDate,
          endDate,
          all: true,
        },
      });

      dispatch(
        onLoadProductsByRangeAll({
          data: data.data,
        }),
      );
    } catch (e) {
      console.error("Error cargando productos por rango", e);
    }
  };

  // Filtrar productos por rango de fechas
  const startProductPendingMonth = async (year, month, page = 1) => {
    try {
      const { data } = await clientsApi.get("/productClient/pending", {
        params: {
          year,
          month,
          page,
          limit: 20,
        },
      });

      dispatch(
        onLoadProductsPendingMonth({
          data: data.data,
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        }),
      );
    } catch (e) {
      console.error("Error cargando productos pendientes del mes", e);
    }
  };

  // Filtrar productos por rango de fechas
  const startProductPendingMonthAll = async (year, month) => {
    try {
      const { data } = await clientsApi.get("/productClient/pending", {
        params: {
          year,
          month,
          all: true,
        },
      });

      dispatch(
        onLoadProductsPendingMonthAll({
          data: data.data,
        }),
      );
    } catch (e) {
      console.error("Error cargando productos por rango", e);
    }
  };

  //reseteo paginacion
  const starResetPagination = () => {
    dispatch(resetPagination());
  };

  return {
    //*Propiedades
    productClients,
    productsClientPaid,
    productsClientUnpaid,
    activeProductClient,
    productsClientDate,
    selectedDate,
    productsClientRange,
    productsByRangeAll,
    page,
    totalPages,
    productsPendingMonth,
    productsPendingMonthAll,
    billClientSave,
    billDate,
    isLoadingBill,

    //*Metodos
    startSavingProductClient,
    setActiveProductClient,
    startClearActiveProductClient,
    getAllProductsClientByDate,
    startLoadingProductsByClient,
    startLoadingProductsClientPaid,
    startLoadingProductsClientUnpaid,
    startUpdateProductClient,
    startPaidTotalProductClient,
    startDeleteProductClient,
    startLoadProductsByDate,
    setSelectedDate,
    startSavingAdministrationProductClient,
    startProductClientByRange,
    startProductClientByRangeAll,
    startProductPendingMonth,
    startProductPendingMonthAll,
    starResetPagination,
    startSavingBillClient,
    startLoadBillByDate,
    startDeleteBillClient,
    starGetBillById,
  };
};
