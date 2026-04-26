import { productClientSlice, onStartLoadingBill, onLoadBillByDate, onAddNewBillClient } from '../../store/sales/productClientSlice';

const reducer = productClientSlice.reducer;
const initialState = productClientSlice.getInitialState();

describe('productClientSlice — bill reducers', () => {

  it('initialState: isLoadingBill es false', () => {
    expect(initialState.isLoadingBill).toBe(false);
  });

  it('initialState: billDate es []', () => {
    expect(initialState.billDate).toEqual([]);
  });

  it('initialState: billClients es []', () => {
    expect(initialState.billClients).toEqual([]);
  });

  it('onStartLoadingBill → isLoadingBill true', () => {
    const state = reducer(initialState, onStartLoadingBill());
    expect(state.isLoadingBill).toBe(true);
  });

  it('onStartLoadingBill no modifica billDate', () => {
    const prev = { ...initialState, billDate: [{ id: 1 }] };
    const state = reducer(prev, onStartLoadingBill());
    expect(state.billDate).toEqual([{ id: 1 }]);
  });

  it('onLoadBillByDate → isLoadingBill false', () => {
    const loading = { ...initialState, isLoadingBill: true };
    const state = reducer(loading, onLoadBillByDate([{ id: 1 }]));
    expect(state.isLoadingBill).toBe(false);
  });

  it('onLoadBillByDate → billDate = payload', () => {
    const bills = [{ id: 1 }, { id: 2 }];
    const state = reducer(initialState, onLoadBillByDate(bills));
    expect(state.billDate).toEqual(bills);
  });

  it('onLoadBillByDate con array vacío → billDate = []', () => {
    const prev = { ...initialState, billDate: [{ id: 1 }] };
    const state = reducer(prev, onLoadBillByDate([]));
    expect(state.billDate).toEqual([]);
  });

  it('flujo: onStartLoadingBill → onLoadBillByDate', () => {
    let state = reducer(initialState, onStartLoadingBill());
    expect(state.isLoadingBill).toBe(true);
    state = reducer(state, onLoadBillByDate([{ id: 1 }]));
    expect(state.isLoadingBill).toBe(false);
  });

  it('onAddNewBillClient → push al array', () => {
    const bill = { id: 99, name: 'Test' };
    const state = reducer(initialState, onAddNewBillClient(bill));
    expect(state.billClients).toHaveLength(1);
    expect(state.billClients[0]).toEqual(bill);
  });

  it('onAddNewBillClient preserva items previos', () => {
    const prev = { ...initialState, billClients: [{ id: 1 }] };
    const state = reducer(prev, onAddNewBillClient({ id: 2 }));
    expect(state.billClients).toHaveLength(2);
    expect(state.billClients[0]).toEqual({ id: 1 });
  });
});
