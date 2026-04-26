/**
 * @description Configuracion del store principal de Redux.
 * Combina todos los slices de la aplicacion: auth, client, ui, labels,
 * category, product, rate, quota, productClient y suscriptionClient.
 * @module store
 */
import { configureStore } from "@reduxjs/toolkit"
import { clientSlice } from "./clients/clientSlice"
import { uiSlice } from "./ui/uiSlice"
import { labelSlice } from "./label/labelSlice"
import { categorySlice } from "./storeFactory/categorySlice"
import { productSlice } from "./storeFactory/productSlice"
import { rateSlice } from "./rates/rateSlice"
import { quotaSlice } from "./rates/quotaSlice"
import { productClientSlice } from "./sales/productClientSlice"
import { suscriptionClientSlice } from "./sales/suscriptionClientSlice"
import { authSlice } from "./auth/authSlice"


/** @description Store de Redux configurado con todos los reducers de la aplicacion */
export const store = configureStore({

    reducer:{
        auth: authSlice.reducer,
        client: clientSlice.reducer,
        ui: uiSlice.reducer,
        labels: labelSlice.reducer,
        category: categorySlice.reducer,
        product: productSlice.reducer,
        rate: rateSlice.reducer,
        quota: quotaSlice.reducer,
        productClient: productClientSlice.reducer,
        suscriptionClient: suscriptionClientSlice.reducer  
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
})