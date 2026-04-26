/**
 * @description Hook personalizado para gestionar backups de la base de datos.
 * Maneja estado local (no Redux) ya que es funcionalidad exclusiva de admin.
 * Provee operaciones sobre backups: listar, crear, descargar, restaurar y eliminar.
 * @returns {Object} Estado y funciones para gestionar backups
 */
import { useState, useCallback } from 'react';
import { clientsApi } from '../api';
import Swal from 'sweetalert2';

export const useBackupStore = () => {
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBackups = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await clientsApi.get('/admin/backups');
      setBackups(data.backups || []);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los backups', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBackup = async () => {
    setIsLoading(true);
    try {
      const { data } = await clientsApi.post('/admin/backup');
      Swal.fire('Backup creado', `Backup "${data.backup?.folder}" creado correctamente`, 'success');
      await loadBackups();
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackup = async (folder) => {
    try {
      const { data } = await clientsApi.get(`/admin/backups/${folder}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folder}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire('Error', 'No se pudo descargar el backup', 'error');
    }
  };

  const restoreBackup = async (folder, mode = 'clean') => {
    setIsLoading(true);
    try {
      const { data } = await clientsApi.post(`/admin/restore/${folder}`, { mode });

      const cols = data.collections || {};
      const lines = Object.entries(cols)
        .map(([name, info]) => {
          if (info.status === 'skipped') return `<b>${name}</b>: omitida (sin datos)`;
          if (info.status === 'error') return `<b>${name}</b>: error`;
          if (info.status === 'partial') return `<b>${name}</b>: ${info.inserted} insertados, ${info.duplicates} duplicados`;
          return `<b>${name}</b>: ${info.documents} documentos`;
        })
        .join('<br/>');

      Swal.fire({
        title: mode === 'clean' ? 'Restauracion completa' : 'Contenido añadido',
        html: lines || 'Proceso completado',
        icon: 'success',
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo restaurar el backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackup = async (folder) => {
    setIsLoading(true);
    try {
      await clientsApi.delete(`/admin/backups/${folder}`);
      Swal.fire('Eliminado', 'Backup eliminado correctamente', 'success');
      await loadBackups();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadRestore = async (file, mode) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);

      const { data } = await clientsApi.post('/admin/upload-restore', formData);

      const cols = data.collections || {};
      const lines = Object.entries(cols)
        .map(([name, info]) => {
          if (info.status === 'skipped') return `<b>${name}</b>: omitida (sin datos)`;
          if (info.status === 'error') return `<b>${name}</b>: error`;
          if (info.status === 'partial') return `<b>${name}</b>: ${info.inserted} insertados, ${info.duplicates} duplicados`;
          return `<b>${name}</b>: ${info.documents} documentos`;
        })
        .join('<br/>');

      Swal.fire({
        title: mode === 'clean' ? 'Restauracion completa' : 'Contenido añadido',
        html: lines || 'Proceso completado',
        icon: 'success',
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo procesar el archivo ZIP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    backups,
    isLoading,
    loadBackups,
    createBackup,
    downloadBackup,
    restoreBackup,
    deleteBackup,
    uploadRestore,
  };
};
