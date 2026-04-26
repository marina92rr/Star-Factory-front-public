/**
 * @description Modal de liquidacion de un producto impagado individual.
 * Permite seleccionar metodo de pago y confirmar el pago del producto.
 * @returns {JSX.Element} Modal de liquidacion individual
 */
import Modal from "react-modal";
import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "../../../../hooks/useUiStore";
import { useProductClientStore } from "../../../../hooks/useProductClientStore";
import { customStyleModal } from "../../../../helpers/customStyleModal";

Modal.setAppElement("#root");

export const LiquidateProductClientModal = () => {
  const { isModalProductClientUnpaidOpen, closeProductClientUnpaidModal } =
    useUiStore();
  const {
    activeProductClient,
    startUpdateProductClient,
    startLoadingProductsClientUnpaid,
    startLoadingProductsClientPaid,
  } = useProductClientStore();

  const isEdit = !!activeProductClient?.idProductClient;

  const [formValues, setFormValues] = useState({
    paymentMethod: "",
    paid: "",
    price: "",
    discount: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // acción actual del submit: 'update' | 'liquidate'
  const [action, setAction] = useState("update");

  useEffect(() => {
    if (isEdit && activeProductClient) {
      setFormValues({
        paymentMethod: activeProductClient.paymentMethod,
        paid: activeProductClient.paid,
        price: activeProductClient.price,
        discount: activeProductClient.discount,
      });
    } else {
      setFormValues({ paymentMethod: "", paid: "", price: "", discount: "" }); // Reset form values when not editing
    }
  }, [isEdit, isModalProductClientUnpaidOpen]);

  const finalPrice = useMemo(() => {
    if (!activeProductClient) return 0;
    const price = parseFloat(formValues.price) || activeProductClient.price;
    const discount = parseFloat(formValues.discount) || 0;
    return (price - discount).toFixed(2);
  }, [activeProductClient, formValues.discount, formValues.price]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validaciones Actualizar-Liquidar
    if (action === "liquidate" && !formValues.paymentMethod) {
      setSubmitted(false);
      return;
    }

    const payload =
      action === "liquidate"
        ? {
            ...formValues,
            idProductClient: activeProductClient?.idProductClient, // <-- AQUI
            paid: true,
          }
        : {
            ...formValues,
            idProductClient: activeProductClient?.idProductClient, // <-- AQUI
            paid: false,
          };

    await startUpdateProductClient(payload, true);
    closeProductClientUnpaidModal();
    await startLoadingProductsClientUnpaid(activeProductClient?.idClient);
    await startLoadingProductsClientPaid(activeProductClient?.idClient);

    setFormValues({ paymentMethod: "", paid: "", price: "", discount: "" });
    setSubmitted(false);
    setAction("update");
  };

  return (
    <Modal
      isOpen={isModalProductClientUnpaidOpen}
      closeTimeoutMS={200}
      onRequestClose={closeProductClientUnpaidModal}
      style={customStyleModal}
      contentLabel="Editar Compra automática"
    >
      <h4 className="ps-4">Liquidar deuda</h4>
      <hr />

      <form className="container mb-3 " onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="border p-3 w-100">
            {activeProductClient?.name}
          </label>
        </div>
        {/* Precio y Descuento */}
        <div className="d-flex">
          {/* Precio */}
          <div className="me-3">
            <label className="form-label">Precio</label>
            <div className="input-group">
              <input
                className="form-control"
                ype="text"
                name="price"
                value={formValues.price}
                onChange={onInputChange}
              />
              <span className="input-group-text">€</span>
            </div>
          </div>
          {/* Descuento */}
          <div>
            <label className="form-label">Descuento</label>

            <div className="input-group ">
              <input
                className="form-control"
                ype="text"
                name="discount"
                value={formValues.discount}
                onChange={onInputChange}
              />
              <span className="input-group-text">€</span>
            </div>
          </div>
        </div>

        {/*metodo de pago  */}
        <div className="mb-3 py-3">
          <label className="form-label">Método de pago</label>
          <select
            className="form-select py-2"
            name="paymentMethod"
            value={formValues.paymentMethod}
            onChange={onInputChange}
          >
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>

        <div className="d-flex  ">
          <h4 className="ps-1">{finalPrice} €</h4>

          <div className="ms-auto">
            {/* Botón ACTUALIZAR: mantiene paid = false */}
            <button
              type="submit"
              className="btn btn-primary me-3"
              onClick={() => setAction("update")}
            >
              Actualizar
            </button>
            {/* Botón LIQUIDAR: paid = true */}
            <button
              type="submit"
              className="btn btn-success"
              onClick={() => setAction("liquidate")}
              disabled={submitted}
            >
              Liquidar deuda
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
