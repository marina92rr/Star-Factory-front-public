/**
 * @description Pagina de administracion de backups.
 * Seccion 1: Generar copia de seguridad + tabla de backups existentes.
 * Seccion 2: Importar backup desde backup existente o archivo ZIP, con modos limpio o añadir.
 * Solo accesible para usuarios administradores.
 */
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useBackupStore } from '../../hooks/useBackupStore';

/** Formatea el nombre de carpeta "YYYY-MM-DD_HH-mm-ss" a fecha legible */
const formatBackupDate = (folder) => {
  try {
    const [datePart, timePart] = folder.split('_');
    const [y, m, d] = datePart.split('-');
    const [hh, mm, ss] = timePart.split('-');
    const date = new Date(y, m - 1, d, hh, mm, ss);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return folder;
  }
};

const BackupPage = () => {
  const {
    backups,
    isLoading,
    loadBackups,
    createBackup,
    downloadBackup,
    deleteBackup,
    restoreBackup,
    uploadRestore,
  } = useBackupStore();

  const [importMode, setImportMode] = useState('clean');
  const [importSource, setImportSource] = useState('server'); // 'server' | 'file'
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  // ── Handlers seccion 1 ──

  const handleCreateBackup = async () => {
    const result = await Swal.fire({
      title: 'Crear backup',
      text: '¿Deseas crear una copia de seguridad de la base de datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#007bff',
    });
    if (result.isConfirmed) {
      await createBackup();
    }
  };

  const handleDelete = async (folder) => {
    const result = await Swal.fire({
      title: 'Eliminar backup',
      text: `¿Estas seguro de eliminar el backup del ${formatBackupDate(folder)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });
    if (result.isConfirmed) {
      await deleteBackup(folder);
    }
  };

  // ── Handlers seccion 2 ──

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const canImport =
    importSource === 'server' ? !!selectedFolder : !!selectedFile;

  const handleImport = async () => {
    if (!canImport) return;

    // Confirmacion segun modo
    if (importMode === 'clean') {
      const result = await Swal.fire({
        title: 'Importar limpio',
        html: 'Esta accion <b>borrara todos los datos actuales</b> y los reemplazara con el contenido del backup.<br/><br/>Escribe <b>RESTAURAR</b> para confirmar.',
        input: 'text',
        inputPlaceholder: 'RESTAURAR',
        inputValidator: (value) => {
          if (value !== 'RESTAURAR') return 'Debes escribir RESTAURAR';
        },
        showCancelButton: true,
        confirmButtonText: 'Importar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
      });
      if (!result.isConfirmed) return;
    } else {
      const result = await Swal.fire({
        title: 'Añadir contenido',
        html: 'Se añadiran los documentos del backup a la base de datos.<br/>Los duplicados seran omitidos automaticamente.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Importar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#007bff',
      });
      if (!result.isConfirmed) return;
    }

    if (importSource === 'server') {
      await restoreBackup(selectedFolder, importMode);
      setSelectedFolder('');
    } else {
      await uploadRestore(selectedFile, importMode);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="m-5 slide-in-up">
      {/* Titulo */}
      <div className="pt-5">
        <h1>Backup</h1>
        <hr />
      </div>

      {/* ═══════ SECCION 1: Generar copia de seguridad ═══════ */}
      <section className="mb-5">
        <h4 className="mb-3">
          <i className="bi bi-database-add me-2"></i>
          Generar copia de seguridad
        </h4>

        <button
          className="btn btn-primary mb-4"
          onClick={handleCreateBackup}
          disabled={isLoading}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Generar backup
        </button>

        {/* Spinner */}
        {isLoading && (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {/* Lista vacia */}
        {!isLoading && backups.length === 0 && (
          <div className="alert alert-secondary">
            <i className="bi bi-database me-2"></i>
            No hay copias de seguridad disponibles. Crea una con el boton de arriba.
          </div>
        )}

        {/* Tabla de backups */}
        {!isLoading && backups.length > 0 && (
          <>
            <div className="border bg-light rounded-top p-3">
              <strong>{backups.length} {backups.length === 1 ? 'backup disponible' : 'backups disponibles'}</strong>
            </div>

            <div className="table-responsive">
              <table className="table table-hover border align-middle mb-0">
                <thead>
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 text-center">Colecciones</th>
                    <th className="p-3 text-center">Documentos</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => {
                    const cols = backup.info?.collections;
                    const numCollections = cols ? Object.keys(cols).length : null;
                    const totalDocs = backup.info?.totalDocuments ?? null;
                    return (
                      <tr key={backup.folder}>
                        <td className="p-3">
                          <i className="bi bi-calendar3 me-2 text-muted"></i>
                          {formatBackupDate(backup.folder)}
                        </td>
                        <td className="p-3 text-center">{numCollections ?? '-'}</td>
                        <td className="p-3 text-center">
                          {totalDocs != null
                            ? totalDocs.toLocaleString('es-ES')
                            : '-'
                          }
                        </td>
                        <td className="p-3 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Descargar ZIP"
                              onClick={() => downloadBackup(backup.folder)}
                            >
                              <i className="bi bi-download me-1"></i>
                              Descargar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Eliminar este backup"
                              onClick={() => handleDelete(backup.folder)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* ═══════ SECCION 2: Importar backup ═══════ */}
      <section>
        <h4 className="mb-3">
          <i className="bi bi-upload me-2"></i>
          Importar backup
        </h4>

        {/* Selector de origen */}
        <div className="mb-4" style={{ maxWidth: '700px' }}>
          <label className="form-label fw-bold">Origen</label>
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${importSource === 'server' ? 'active' : ''}`}
                onClick={() => setImportSource('server')}
              >
                <i className="bi bi-hdd me-1"></i>
                Backup existente
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${importSource === 'file' ? 'active' : ''}`}
                onClick={() => setImportSource('file')}
              >
                <i className="bi bi-file-earmark-zip me-1"></i>
                Archivo ZIP
              </button>
            </li>
          </ul>
        </div>

        {/* Selector de modo */}
        <div className="row g-3 mb-4" style={{ maxWidth: '700px' }}>
          <div className="col-6">
            <div
              className={`card h-100 ${importMode === 'clean' ? 'border-danger' : 'border'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setImportMode('clean')}
            >
              <div className="card-body">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="importMode"
                    id="modeClean"
                    checked={importMode === 'clean'}
                    onChange={() => setImportMode('clean')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="modeClean">
                    <i className="bi bi-arrow-repeat me-1 text-danger"></i>
                    Importar limpio
                  </label>
                </div>
                <small className="text-muted d-block mt-2">
                  Borra todos los datos actuales y los reemplaza con el contenido del backup.
                </small>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div
              className={`card h-100 ${importMode === 'merge' ? 'border-primary' : 'border'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setImportMode('merge')}
            >
              <div className="card-body">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="importMode"
                    id="modeMerge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="modeMerge">
                    <i className="bi bi-plus-circle me-1 text-primary"></i>
                    Añadir contenido
                  </label>
                </div>
                <small className="text-muted d-block mt-2">
                  Añade los documentos sin borrar los existentes. Duplicados omitidos.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Input segun origen */}
        <div className="d-flex align-items-center gap-3 mb-2" style={{ maxWidth: '700px' }}>
          {importSource === 'server' ? (
            <select
              className="form-select"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              <option value="">Selecciona un backup...</option>
              {backups.map((b) => {
                const docs = b.info?.totalDocuments;
                const label = formatBackupDate(b.folder) + (docs != null ? ` (${docs.toLocaleString('es-ES')} docs)` : '');
                return (
                  <option key={b.folder} value={b.folder}>{label}</option>
                );
              })}
            </select>
          ) : (
            <input
              ref={fileInputRef}
              type="file"
              className="form-control"
              accept=".zip"
              onChange={handleFileChange}
            />
          )}

          <button
            className={`btn ${importMode === 'clean' ? 'btn-danger' : 'btn-primary'} text-nowrap`}
            disabled={!canImport || isLoading}
            onClick={handleImport}
          >
            <i className="bi bi-upload me-2"></i>
            Importar
          </button>
        </div>

        {importSource === 'file' && selectedFile && (
          <small className="text-muted d-block">
            <i className="bi bi-file-earmark-zip me-1"></i>
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </small>
        )}
      </section>
    </div>
  );
};

export default BackupPage;
