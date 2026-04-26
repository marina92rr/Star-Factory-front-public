import React, { useEffect } from 'react'
import { IVAProduct } from '../../helpers/IVAProduct';
import { RateAddNew } from '../components/ratePage/RateAddNew';
import { RateModal } from '../components/ratePage/RateModal';
import { useRateStore } from '../../hooks/useRateStore';
import { useQuotaStore } from '../../hooks/useQuotaStore';
import { onLoadQuota } from '../../store/rates/quotaSlice';
import { QuotaAddNew } from '../components/ratePage/QuotaAddNew';
import { QuotaModal } from '../components/ratePage/QuotaModal';
import { QuotaEdit } from '../components/ratePage/QuotaEdit';
import { QuotaDelete } from '../components/ratePage/QuotaDelete';
import { RateDelete } from '../components/ratePage/RateDelete';
import { RateEdit } from '../components/ratePage/RateEdit';
import { useDispatch } from 'react-redux';


export const RatesPage = () => {

  const dispatch = useDispatch();
  const { starLoadingRates, rates, activeRate, setActiveRate } = useRateStore();
  const { quotas, startLoadingQuotasByRate, activeQuota } = useQuotaStore();

  useEffect(() => {
    starLoadingRates();
  }, [activeQuota]);
  
  return (
    <div className='m-5 fade-in'>
      <div className='py-5'>
        <h1>Tarifas</h1>
        <hr />
      </div>
      <div className=' d-flex'>
        <div className='col-3' >
          <div className='border bg-light rounded-top p-3'>
            <RateAddNew />
            <RateModal />
          </div>
          <table className="table border rounded-top">

            <tbody>
              <tr>
                <td>
                  {rates.map((rate, i) => {
                    return (
                      <div key={i} className=" text-start">
                        <div className='d-flex'>
                          <div
                            className='text p-2 w-100'
                            style={{
                              cursor: 'pointer',
                              background: activeRate?._id === rate._id ? '#007bff' : 'none',
                              color: activeRate?._id === rate._id ? '#ffffff' : '#000000'

                            }}
                            onClick={() => {
                              if (activeRate?._id === rate._id) {
                                setActiveRate(null);
                                dispatch(onLoadQuota([])); // limpiar productos
                              } else {
                                setActiveRate(rate);
                                startLoadingQuotasByRate(rate._id);
                              }
                            }}
                          >
                            {rate.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='col-8 ms-4' >
          <div className='border bg-light rounded-top  d-flex justify-content-between align-items-center p-3'>
            {activeRate ? (
              <h3>{activeRate.description}</h3>
            )
              : (
                <h3 className='text-muted'>Cuotas</h3>
              )}
          </div>

          {activeRate ? (
            <div className='border rounded-top  d-flex justify-content-between align-items-center p-3'>
              <QuotaAddNew />
              <QuotaModal />
              <div className='align-items-end d-flex gap-2'>
                <RateEdit />
                <RateDelete />
              </div>
            </div>
          ) :(
            <div></div>
          )}

          <table className="table border ">
            <thead >
              <tr >
                <th scope='col' className="p-3 text-start">Nombre</th>
                <th scope='col' className="p-3 text-end">Nº Sesiones</th>
                <th scope='col' className="p-3 text-center">Periodo</th>
                <th scope='col' className="p-3 text-end">PVP</th>
                <th scope='col' className="p-3 text-end">IVA</th>
                <th scope='col' className="p-3 text-center">Editar/Borrar</th>

              </tr>
            </thead>
            <tbody>
              {quotas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted">No hay cuotas en esta tarifa</td>
                </tr>
              ) : (
                quotas.map((quota,i) => {
                  const { iva, total } = IVAProduct(quota.price);
                  return (
                    <tr key={i}>
                      <td className='text-primary p-3 text-start'>{quota.name}</td>
                      <td className="p-3 text-end">{quota.numSession}</td>
                      <td className="p-3 text-center">{quota.period}</td>
                      <td className="p-3 text-end">{total}€</td>
                      <td className="p-3 text-end">{iva}€</td>
                      <td >
                        <div className='d-flex justify-content-center align-items-center gap-2'>
                          
                          <QuotaEdit quota={quota} />
                          
                          <QuotaDelete quota={quota} />
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>

  )
}
export default RatesPage;
