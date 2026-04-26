/**
 * @description Fila de tabla para una cuota dentro de una tarifa.
 * Muestra el nombre, numero de sesiones, periodo, PVP (con IVA), desglose de IVA
 * y botones de editar/eliminar. Optimizado con React.memo.
 *
 * @param {Object} props
 * @param {Object} props.quota - Datos de la cuota (name, numSession, period, price, idQuota)
 * @returns {JSX.Element} Fila de tabla con datos de la cuota
 */
import { memo } from 'react';
import { IVAProduct } from '../../../helpers/IVAProduct';
import { QuotaEdit } from './QuotaEdit';
import { QuotaDelete } from './QuotaDelete';

export const QuotaRow = memo(({ quota }) => {
  const { iva, total } = IVAProduct(quota.price);

  return (
    <tr>
      <td className='text-primary p-3 text-start'>{quota.name}</td>
      <td className="p-3 text-end">{quota.numSession}</td>
      <td className="p-3 text-center">{quota.period}</td>
      <td className="p-3 text-end">{total}€</td>
      <td className="p-3 text-end">{iva}€</td>
      <td>
        <div className='d-flex justify-content-center align-items-center gap-2'>
          <QuotaEdit quota={quota} />
          <QuotaDelete quota={quota} />
        </div>
      </td>
    </tr>
  );
});
