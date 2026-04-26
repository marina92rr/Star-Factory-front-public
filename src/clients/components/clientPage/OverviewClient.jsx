/**
 * @description Vista general (overview) de un cliente.
 * Muestra las suscripciones activas del cliente con proxima fecha de compra,
 * datos de contacto, productos impagados y productos pagados.
 * @returns {JSX.Element} Vista resumen del cliente con suscripciones y productos
 */
import React, { use, useEffect } from 'react'
import { useClientsStore } from '../../../hooks/useClientsStore'
import { useSuscriptionClientStore } from '../../../hooks/useSuscriptionClientStore';
import { getNextPurchaseDate } from '../../../helpers/getNextPurchaseDate';
import { capitalizeFirstWord } from '../../../helpers/capitalizeFirstWord';
import { DeleteSuscriptionClient } from './productSusciption/DeleteSuscriptionClient';
import { EditSuscriptionClient } from './productSusciption/EditSuscriptionClient';
import { SuscriptionClientModal } from './productSusciption/SuscriptionClientModal';

export const OverviewClient = () => {

  const { activeClient, setActiveClient } = useClientsStore();
  const { suscriptionClients, startLoadingSuscriptionsByClient } = useSuscriptionClientStore();


  useEffect(() => {
    if (activeClient?.idClient) {
      startLoadingSuscriptionsByClient(activeClient.idClient);
    }
  }, [activeClient]);

  return (
    <>
      <h4 className="border rounded-top br-3 d-flex align-items-center p-3 bg-light m-0">Autocompras</h4>
      <table className='table border'>
        <thead>
          <tr>
            <th className='py-3' scope='col'>Concepto</th>
            <th className='py-3' scope='col'>Fecha (Próxima compra)</th>
            <th className='py-3' scope='col'>Total</th>
            <th className='py-3' scope='col'>Desc.</th>
            <th className='py-3' scope='col'>Método Pago</th>
            <th className='py-3' scope='col'>Caducidad</th>
            <th className='py-3' scope='col'>Editar</th>
          </tr>
        </thead>
        <tbody >
        {(suscriptionClients?.length ?? 0) === 0 ? (
            <tr><td colSpan={5} className='text-muted'>No hay suscripciones</td></tr>
          ) : (
            suscriptionClients.map((suscriptions, i) => {
              return (
                <tr key={i}>
                  <td className='py-3'>{capitalizeFirstWord(suscriptions.name)}</td>
                  <td className='py-3'>Se intentará la próxima compra el {getNextPurchaseDate()}</td>
                  <td className='py-3'>{suscriptions.price - suscriptions.discount} €</td>
                  <td className='py-3'>{suscriptions.discount} €</td>
                  <td className='py-3'>{capitalizeFirstWord(suscriptions.paymentMethod)}</td>
                  <td className='py-3'>Siempre</td>
                  <td className='d-flex py-3 align-items-center gap-2'>
                   <EditSuscriptionClient suscription={suscriptions}/>
                   <SuscriptionClientModal suscription={suscriptions}/>
                   <DeleteSuscriptionClient suscription={suscriptions}/>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      


    </>
  )
}
