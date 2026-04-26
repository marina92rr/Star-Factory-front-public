/**
 * @description Vista de reservas de un cliente.
 * Seccion preparada para mostrar las reservas del cliente (en desarrollo).
 * @returns {JSX.Element} Vista de reservas del cliente
 */
export const ReservationsClient = () => {
  return (

    <div>
      <h4 className="border rounded-top br-3 d-flex align-items-center p-3 bg-light m-0">Reservas</h4>
      <table className='table border'>
        <thead>
          <tr>
            <th className='py-3' scope='col'>Concepto</th>
            <th className='py-3' scope='col'>Fecha (Próxima compra)</th>
            <th className='py-3' scope='col'>Total</th>
            <th className='py-3' scope='col'>Método Pago</th>
            <th className='py-3' scope='col'>Caducidad</th>
          </tr>
        </thead>
        <tbody >
          <tr >
            <td className='text-muted'>No tiene reservas actualmente</td>
            <td className='py-3'></td>
            <td className='py-3'></td>
            <td className='py-3'></td>
            <td className='py-3'></td>

          </tr>
        </tbody>
      </table>

    </div>
  )
}
