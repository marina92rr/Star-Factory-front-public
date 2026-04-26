import { renderHook, act } from '@testing-library/react';
import { useBackupStore } from '../../hooks/useBackupStore';
import { clientsApi } from '../../api';
import Swal from 'sweetalert2';

// Mock API y Swal
vi.mock('../../api', () => ({
  clientsApi: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn() },
}));

const mockBackups = [
  { folder: '2026-02-19_10-30-00', info: { totalDocuments: 100, collections: { clients: 50 } } },
  { folder: '2026-02-18_08-00-00', info: { totalDocuments: 80, collections: { clients: 40 } } },
];

describe('useBackupStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── loadBackups ──────────────────────────────────────────────────────────

  test('loadBackups debe cargar la lista de backups', async () => {
    clientsApi.get.mockResolvedValue({ data: { backups: mockBackups } });

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.loadBackups();
    });

    expect(clientsApi.get).toHaveBeenCalledWith('/admin/backups');
    expect(result.current.backups).toEqual(mockBackups);
    expect(result.current.isLoading).toBe(false);
  });

  test('loadBackups debe mostrar error si falla', async () => {
    clientsApi.get.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.loadBackups();
    });

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudieron cargar los backups', 'error');
    expect(result.current.backups).toEqual([]);
  });

  // ─── createBackup ─────────────────────────────────────────────────────────

  test('createBackup debe crear y recargar lista', async () => {
    clientsApi.post.mockResolvedValue({ data: { backup: { folder: '2026-02-19_12-00-00' } } });
    clientsApi.get.mockResolvedValue({ data: { backups: mockBackups } });

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.createBackup();
    });

    expect(clientsApi.post).toHaveBeenCalledWith('/admin/backup');
    expect(Swal.fire).toHaveBeenCalledWith('Backup creado', expect.stringContaining('2026-02-19_12-00-00'), 'success');
    expect(clientsApi.get).toHaveBeenCalledWith('/admin/backups');
  });

  test('createBackup debe mostrar error si falla', async () => {
    clientsApi.post.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.createBackup();
    });

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudo crear el backup', 'error');
  });

  // ─── downloadBackup ───────────────────────────────────────────────────────

  test('downloadBackup debe descargar como blob', async () => {
    const mockBlob = new Blob(['zip-content']);
    clientsApi.get.mockResolvedValue({ data: mockBlob });

    // Mock URL.createObjectURL y revokeObjectURL
    const mockUrl = 'blob:http://localhost/mock';
    global.URL.createObjectURL = vi.fn(() => mockUrl);
    global.URL.revokeObjectURL = vi.fn();

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.downloadBackup('2026-02-19_10-30-00');
    });

    expect(clientsApi.get).toHaveBeenCalledWith('/admin/backups/2026-02-19_10-30-00/download', {
      responseType: 'blob',
    });
  });

  test('downloadBackup debe mostrar error si falla', async () => {
    clientsApi.get.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.downloadBackup('folder');
    });

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudo descargar el backup', 'error');
  });

  // ─── restoreBackup ────────────────────────────────────────────────────────

  test('restoreBackup debe llamar al endpoint correcto', async () => {
    clientsApi.post.mockResolvedValue({ data: { ok: true } });

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.restoreBackup('2026-02-19_10-30-00');
    });

    expect(clientsApi.post).toHaveBeenCalledWith('/admin/restore/2026-02-19_10-30-00');
    expect(Swal.fire).toHaveBeenCalledWith('Restaurado', 'Base de datos restaurada correctamente', 'success');
  });

  test('restoreBackup debe mostrar error si falla', async () => {
    clientsApi.post.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.restoreBackup('folder');
    });

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudo restaurar el backup', 'error');
  });

  // ─── deleteBackup ─────────────────────────────────────────────────────────

  test('deleteBackup debe eliminar y recargar lista', async () => {
    clientsApi.delete.mockResolvedValue({ data: { ok: true } });
    clientsApi.get.mockResolvedValue({ data: { backups: [] } });

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.deleteBackup('2026-02-19_10-30-00');
    });

    expect(clientsApi.delete).toHaveBeenCalledWith('/admin/backups/2026-02-19_10-30-00');
    expect(Swal.fire).toHaveBeenCalledWith('Eliminado', 'Backup eliminado correctamente', 'success');
    expect(clientsApi.get).toHaveBeenCalledWith('/admin/backups');
  });

  test('deleteBackup debe mostrar error si falla', async () => {
    clientsApi.delete.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useBackupStore());

    await act(async () => {
      await result.current.deleteBackup('folder');
    });

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudo eliminar el backup', 'error');
  });
});
