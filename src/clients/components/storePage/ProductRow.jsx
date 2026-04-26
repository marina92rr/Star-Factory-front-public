/**
 * @description Fila de tabla para un producto de la tienda.
 * Muestra el nombre del producto, su PVP (con IVA), el desglose de IVA
 * y botones de editar/eliminar. Optimizado con React.memo.
 *
 * @param {Object} props
 * @param {Object} props.product - Datos del producto (name, price, idProduct)
 * @returns {JSX.Element} Fila de tabla con datos del producto
 */
import { memo } from 'react';
import { IVAProduct } from '../../../helpers/IVAProduct';
import { ProductEdit } from './ProductEdit';
import { ProductDelete } from './ProductDelete';

export const ProductRow = memo(({ product }) => {
  const { iva, total } = IVAProduct(product.price);

  return (
    <tr>
      <td className='text-primary p-3 text-start'>{product.name}</td>
      <td className="p-3 text-end">{total}€</td>
      <td className="p-3 text-end">{iva}€</td>
      <td>
        <div className='d-flex justify-content-center align-items-center gap-2'>
          <ProductEdit product={product} />
          <ProductDelete product={product} />
        </div>
      </td>
    </tr>
  );
});
