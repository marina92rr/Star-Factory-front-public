import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productClientSlice } from '../../store/sales/productClientSlice';
import { useProductClientStore } from '../../hooks/useProductClientStore';
import { clientsApi } from '../../api';

// Mock the API module
vi.mock('../../api', () => ({
  clientsApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock normalizeText helper (used by some methods in the hook)
vi.mock('../../helpers/normalizeText', () => ({
  normalizeAllTextFields: (obj) => obj,
}));

const createWrapper = () => {
  const store = configureStore({
    reducer: { productClient: productClientSlice.reducer },
  });
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return { Wrapper, store };
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ═══════════════════════════════════════════════════════════
// startSavingBillClient
// ═══════════════════════════════════════════════════════════
describe('startSavingBillClient', () => {

  it('action "send" → POST sin responseType blob', async () => {
    clientsApi.post.mockResolvedValue({ data: { ok: true } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startSavingBillClient({ action: 'send', name: 'X', lastName: 'Y', items: [] });
    });

    expect(clientsApi.post).toHaveBeenCalledWith('/productclient/bill', expect.any(Object), {});
  });

  it('action "save" → POST con { responseType: "blob" }', async () => {
    clientsApi.post.mockResolvedValue({ data: new Blob() });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startSavingBillClient({ action: 'save', name: 'X', lastName: 'Y', items: [] });
    });

    expect(clientsApi.post).toHaveBeenCalledWith(
      '/productclient/bill', expect.any(Object), { responseType: 'blob' }
    );
  });

  it('action "save_send" → POST con { responseType: "blob" }', async () => {
    clientsApi.post.mockResolvedValue({ data: new Blob() });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startSavingBillClient({ action: 'save_send', name: 'X', lastName: 'Y', items: [] });
    });

    expect(clientsApi.post).toHaveBeenCalledWith(
      '/productclient/bill', expect.any(Object), { responseType: 'blob' }
    );
  });

  it('devuelve la response del API', async () => {
    const mockResponse = { data: { ok: true, bill: { id: 1 } } };
    clientsApi.post.mockResolvedValue(mockResponse);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    let response;
    await act(async () => {
      response = await result.current.startSavingBillClient({ action: 'send', name: 'X', lastName: 'Y', items: [] });
    });

    expect(response).toBe(mockResponse);
  });

  it('error → re-throw', async () => {
    clientsApi.post.mockRejectedValue(new Error('fail'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await expect(
      act(async () => {
        await result.current.startSavingBillClient({ action: 'send', name: 'X', lastName: 'Y', items: [] });
      })
    ).rejects.toThrow('fail');
  });
});

// ═══════════════════════════════════════════════════════════
// starGetBillById
// ═══════════════════════════════════════════════════════════
describe('starGetBillById', () => {

  it('action "print" → POST con { responseType: "blob" }', async () => {
    clientsApi.post.mockResolvedValue({ data: new Blob() });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.starGetBillById('abc123', 'print');
    });

    expect(clientsApi.post).toHaveBeenCalledWith(
      '/productclient/bill/abc123', { action: 'print' }, { responseType: 'blob' }
    );
  });

  it('action "send" → POST sin blob', async () => {
    clientsApi.post.mockResolvedValue({ data: { ok: true } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.starGetBillById('abc123', 'send');
    });

    expect(clientsApi.post).toHaveBeenCalledWith(
      '/productclient/bill/abc123', { action: 'send' }, {}
    );
  });

  it('action "print_send" → POST con blob', async () => {
    clientsApi.post.mockResolvedValue({ data: new Blob() });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.starGetBillById('abc123', 'print_send');
    });

    expect(clientsApi.post).toHaveBeenCalledWith(
      '/productclient/bill/abc123', { action: 'print_send' }, { responseType: 'blob' }
    );
  });

  it('error → re-throw', async () => {
    clientsApi.post.mockRejectedValue(new Error('fail'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await expect(
      act(async () => {
        await result.current.starGetBillById('abc123', 'print');
      })
    ).rejects.toThrow('fail');
  });
});

// ═══════════════════════════════════════════════════════════
// startLoadBillByDate
// ═══════════════════════════════════════════════════════════
describe('startLoadBillByDate', () => {

  it('despacha onStartLoadingBill (isLoadingBill true durante fetch)', async () => {
    let resolvePromise;
    clientsApi.get.mockImplementation(() => new Promise((r) => { resolvePromise = r; }));
    const { Wrapper, store } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    // Start call (don't await)
    let promise;
    act(() => {
      promise = result.current.startLoadBillByDate('2026-01-15');
    });

    // While pending, loading should be true
    expect(store.getState().productClient.isLoadingBill).toBe(true);

    // Resolve
    await act(async () => {
      resolvePromise({ data: { bills: [] } });
      await promise;
    });
  });

  it('llama GET /productClient/billdate/:date normalizado', async () => {
    clientsApi.get.mockResolvedValue({ data: { bills: [] } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startLoadBillByDate('2026-01-15');
    });

    expect(clientsApi.get).toHaveBeenCalledWith('/productClient/billdate/2026-01-15');
  });

  it('tras respuesta → isLoadingBill false + billDate con datos', async () => {
    const bills = [{ id: 1 }, { id: 2 }];
    clientsApi.get.mockResolvedValue({ data: { bills } });
    const { Wrapper, store } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startLoadBillByDate('2026-01-15');
    });

    expect(store.getState().productClient.isLoadingBill).toBe(false);
    expect(store.getState().productClient.billDate).toEqual(bills);
  });

  it('data.bills vacío → billDate = []', async () => {
    clientsApi.get.mockResolvedValue({ data: { bills: [] } });
    const { Wrapper, store } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startLoadBillByDate('2026-01-15');
    });

    expect(store.getState().productClient.billDate).toEqual([]);
  });

  it('fecha YYYY-MM-DD se usa directamente', async () => {
    clientsApi.get.mockResolvedValue({ data: { bills: [] } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startLoadBillByDate('2026-03-20');
    });

    expect(clientsApi.get).toHaveBeenCalledWith('/productClient/billdate/2026-03-20');
  });
});

// ═══════════════════════════════════════════════════════════
// startDeleteBillClient
// ═══════════════════════════════════════════════════════════
describe('startDeleteBillClient', () => {

  it('llama DELETE con { data: { total, itemIndex } }', async () => {
    clientsApi.delete.mockResolvedValue({ data: { ok: true } });
    clientsApi.get.mockResolvedValue({ data: { bills: [] } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startDeleteBillClient({ billId: 'abc', total: true, itemIndex: null });
    });

    expect(clientsApi.delete).toHaveBeenCalledWith('/productclient/bill/abc', {
      data: { total: true, itemIndex: null },
    });
  });

  it('con date → llama startLoadBillByDate (verifica GET al endpoint)', async () => {
    clientsApi.delete.mockResolvedValue({ data: { ok: true } });
    clientsApi.get.mockResolvedValue({ data: { bills: [] } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startDeleteBillClient({ billId: 'abc', total: true, date: '2026-01-15' });
    });

    // After delete, should call GET to reload bills
    await waitFor(() => {
      expect(clientsApi.get).toHaveBeenCalledWith('/productClient/billdate/2026-01-15');
    });
  });

  it('sin date → NO llama startLoadBillByDate', async () => {
    clientsApi.delete.mockResolvedValue({ data: { ok: true } });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.startDeleteBillClient({ billId: 'abc', total: true });
    });

    expect(clientsApi.get).not.toHaveBeenCalled();
  });

  it('error API → no lanza (catch silencioso)', async () => {
    clientsApi.delete.mockRejectedValue(new Error('fail'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProductClientStore(), { wrapper: Wrapper });

    // Should not throw
    await act(async () => {
      await result.current.startDeleteBillClient({ billId: 'abc', total: true });
    });
  });
});
