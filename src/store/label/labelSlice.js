/**
 * @description Slice de Redux para la gestion de etiquetas (labels).
 * Maneja la lista de etiquetas, etiqueta activa, filtro de busqueda,
 * etiquetas de filtro activas y operaciones CRUD.
 *
 * Estado inicial:
 * - labels: Array - todas las etiquetas del sistema
 * - activeLabel: Object|null - etiqueta seleccionada
 * - status: 'idle' | 'loading' | 'succeeded' | 'failed'
 * - filter: string - termino de busqueda
 * - filteredList: Array - etiquetas que coinciden con el filtro
 * - activeFilterLabels: Array - etiquetas activas para filtrar clientes
 * @module labelSlice
 */

import { createSlice } from '@reduxjs/toolkit';
import { normalizeAllTextFields } from '../../helpers/normalizeText';

export const labelSlice = createSlice({
  name: 'labels',
  initialState: {
    labels: [],
    activeLabel: null,
    status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: '',
    filteredList: [],
    isLoadingLabels: false,
    activeFilterLabels: []

  },
  reducers: {

    //Carga una etiqueta
    onSetActiveLabel: (state, { payload }) => {
      state.activeLabel = payload;
    },

    //Carga de todos los labels
    onSetLabels: (state, { payload }) => {
      state.labels = payload;
      state.isLoading = false;
    },

    onLoadingLabels: (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    },

    addLabel: (state, { payload }) => {
      const normalized = normalizeAllTextFields(payload);
      state.labels.push(normalized);
    },

    onLoadLabels: (state, { payload = [] }) => {
      state.isLoadingLabels = false;
      state.labels = payload;
      payload.forEach(label => {
        const exist = state.labels.some(dbLabel => dbLabel.id === label.id);
        if (!exist) {
          state.labels.push(label)
        }
      })
    },

    //Filtrar labels Busqueda
    onSetFilterLabel: (state, action) => {
      state.filter = action.payload;

      const normalize = str => (str || '')
        .normalize('NFD')                         // Quita tildes
        .replace(/[\u0300-\u036f]/g, '')          // Elimina marcas de acento
        .toUpperCase()

      const filter = normalize(state.filter);
      // Filtrar labels
      state.filteredList = state.labels.filter(label => {
        const fullName = normalize(`${label.name}`);
        return fullName.includes(filter);
      });
    },

    setActiveFilterLabels: (state, action) => {
      state.activeFilterLabels = action.payload;
    },

    clearActiveFilterLabels: (state) => {
      state.activeFilterLabels = [];
    },

    onUpdateLabel: (state, { payload }) => {
      const id = payload.idLabel;
      state.labels = state.labels.map(label => {
        if (label.idLabel === id) {
          // fusiona para no perder campos como memberCount u otros
          return { ...label, ...payload };
        }
        return label;
      });
      // si estás editando la etiqueta activa, actualízala también
      if (state.activeLabel?.idLabel === id) {
        state.activeLabel = { ...state.activeLabel, ...payload };
      }
    },

    onDeleteLabel: (state, { payload }) => {
      const id = payload?.idLabel ?? payload; // admite number o { idLabel }
      state.labels = state.labels.filter(l => l.idLabel !== id);
      if (state.activeLabel?.idLabel === id) {
        state.activeLabel = null;
      }
    },
  }
})
export const {
  onSetActiveLabel,
  addLabel,
  onSetFilterLabel,
  onSetLabels,
  onLoadLabels,
  onLoadingLabels,
  onUpdateLabel,
  onDeleteLabel,
  setActiveFilterLabels,
  clearActiveFilterLabels
} = labelSlice.actions; //accion