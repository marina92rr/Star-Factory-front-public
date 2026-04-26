import { useEffect, useMemo, useState } from "react";
import {ClientName} from "../sales/ClientName";
import { capitalizeFirstWord } from "../../../../helpers/capitalizeFirstWord";
import { DateNavigator } from "../../../../helpers/DateNavigator";
import { EditProductClient } from "./EditProductClient";
import { DeleteProductClient } from "./DeleteProductClient";
import { EditProductClientModal } from "./EditProductClientModal";
import { IVAProduct } from "../../../../helpers/IVAProduct";
import { AddNewProductClient } from "./AddNewProductClient";
import { AddProductClientModal } from "./AddProductClientModal";
import { DateLabel } from "../../../../hooks/DateLabel";
import { useProductClientStore } from "../../../../hooks/useProductClientStore";

//fecha iso local.   (EJ: Local: 2025-09-21 00:00 → UTC es 2025-09-20 22:00.)
const toISO = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);    //
const readISO = () =>
    new URLSearchParams(location.search).get('date') ||
    localStorage.getItem('accounting.selectedDate') ||
    toISO(new Date()
);


export const PageDailyBox = () => {

    const { startLoadProductsByDate, productsClientDate } = useProductClientStore();
    const [date, setDate] = useState(readISO()); // Fecha seleccionada

    // carga inicial y cada vez que cambie la fecha
    useEffect(() => {
        localStorage.setItem('accounting.selectedDate', date);  // Guardar en localStorage(recarga la ultima fecha elegida)
        startLoadProductsByDate(date);
    }, [date]);

    //Fecha seleccionada


    const { totalCash, totalTPV, totalAll, hasPaidSales } = useMemo(() => {

        // Solo ventas pagadas (tienen método de pago)
        const paid = (productsClientDate ?? []).filter(p => p?.paymentMethod != null);

        // Normaliza el método de pago a minúsculas para comparar
        const isCash = (m) => /efectivo/i.test(m);
        const isTPV = (m) => /tarjeta/i.test(m);

        const sum = (arr) => arr.reduce((acc, p) => {
            const price = p.price;
            const discount = p.discount;
            return acc + (price - discount);
        }, 0);

        const cash = sum(paid.filter(p => isCash(p.paymentMethod)));
        const tpv = sum(paid.filter(p => isTPV(p.paymentMethod)));
        const total = cash + tpv;

        return {
            totalCash: cash,
            totalTPV: tpv,
            totalAll: total,
            hasPaidSales: paid.length > 0
        };
    }, [productsClientDate]);



    return (
        <div className='m-5 fade-in'>
            <div className="d-flex justify-content-between">
                <div>
                    <div>
                        <h2 className='mb-4'>Caja diaria</h2>

                        <div className="d-flex justify-content-between">
                            <AddNewProductClient />
                            <AddProductClientModal defaultDate={date} />
                            <DateNavigator value={date} onChange={setDate} />
                        </div>
                    </div>
                </div>
                <div className="col-4 ">
                    <table className="table border align-middle rounded mt-3">
                        <thead className="table-light">
                            <tr>
                                <th scope="col" className="col-1 text-center">Total Efectivo</th>
                                <th scope="col" className="col-1 text-center">Total TPV</th>
                                <th scope="col" className="col-1 text-center">IVA</th>
                                <th scope="col" className="col-1 text-center">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hasPaidSales ? (
                                <tr>
                                    <td className="text-center">{totalCash.toFixed(2)} €</td>
                                    <td className="text-center"> {totalTPV.toFixed(2)} €</td>
                                    <td className="text-center"> {IVAProduct(totalAll).iva} €</td>
                                    <td className="fw-bold text-center"> {totalAll.toFixed(2)} €</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-muted text-center">No hay ventas pagadas en esta fecha</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex flex-column mt-3">

                <table className="table border align-middle rounded-3 ">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" className="col-4">Concepto</th>
                            <th scope="col" className="col-1 ">Entrada (€)</th>
                            <th scope="col" className="col-1 ">Desc. (€)</th>
                            <th scope="col" className="col-1 ">IVA (€)</th>
                            <th scope="col" className="col-2">Fecha Pago</th>
                            <th scope="col" className="col-2">Método de pago</th>
                            <th scope="col" className="col-2">Editar/Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsClientDate?.length ? productsClientDate.map((p, i) => (
                            <tr key={i}>
                                <td className="p-3 d-flex gap-2 align-items-center">
                                    {capitalizeFirstWord(p.name)} —{" "}
                                    {Number(p?.idClient) > 0
                                        ? <ClientName idClient={p.idClient} />
                                        : <span className="badge text-bg-secondary">Administración</span>}
                                </td>
                                <td >{p.paymentMethod != null ? `${p.price - p.discount} €` : '-'}</td>
                                <td >{p.paymentMethod != null ? `${p.discount} €` : '-'}</td>
                                <td >{p.paymentMethod != null ? `${IVAProduct(p.price - p.discount).iva} €` : '-'}</td>
                                <td><DateLabel isoDate={p.paymentDate} /></td>
                                <td>{p.paymentMethod != null ? capitalizeFirstWord(p.paymentMethod) : 'Pendiente'}</td>

                                {/* 👇 sin d-flex en el td */}
                                <td className=" text-nowrap">
                                    <div className="d-inline-flex gap-2">
                                        <EditProductClient productClient={p} />
                                        <EditProductClientModal productClient={p} defaultDate={date} />
                                        <DeleteProductClient productClient={p} defaultDate={date} />
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No hay ventas para la fecha seleccionada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>

    )
}
export default PageDailyBox;
