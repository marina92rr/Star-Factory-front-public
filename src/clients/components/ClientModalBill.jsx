import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "../../hooks/useUiStore";
import { useClientsStore } from "../../hooks/useClientsStore";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { customStyleModal } from "../../helpers/customStyleModal";
import { useProductClientStore } from "../../hooks/useProductClientStore";
import { capitalizeFirstWord } from "../../helpers/capitalizeFirstWord";

export const ClientModalBill = () => {
  const { isModalClientBillOpen, closeClientBillModal } = useUiStore();
  const { activeClient } = useClientsStore();
  const { startSavingBillClient, startLoadBillByDate } =
    useProductClientStore();

  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    nif: "",
    email: "",
    direction: "",
    price: 0,
    description: "SERVICIOS PRESTADOS",
    productAmount: "",
    paymentMethod: "tarjeta",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  //Añadir varios productos
  const [items, setItems] = useState([
    {
      description: "SERVICIOS PRESTADOS",
      quantity: "",
      price: "",
    },
  ]);

  useEffect(() => {
    if (!isModalClientBillOpen) return;

    if (activeClient?._id) {
      // ✅ Si hay cliente → rellenamos datos
      setFormValues({
        name: capitalizeFirstWord(activeClient.name) || "",
        lastName: capitalizeFirstWord(activeClient.lastName) || "",
        email: capitalizeFirstWord(activeClient.email) || "",
        nif: "",
        direction: "",
        paymentMethod: "tarjeta",
      });
    } else {
      // ✅ Si NO hay cliente → todo vacío
      setFormValues({
        name: "",
        lastName: "",
        email: "",
        nif: "",
        direction: "",
        paymentMethod: "tarjeta",
      });
    }

    // Reiniciamos items siempre
    setItems([
      {
        description: "SERVICIOS PRESTADOS",
        quantity: "",
        price: 0,
      },
    ]);

    setFormSubmitted(false);
  }, [isModalClientBillOpen, activeClient]);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.name.trim().length > 0 ? "is-valid" : "is-invalid";
  }, [formValues.name, formSubmitted]);

  const onInputChange = ({ target }) => {
    const { name, type, checked, value } = target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  //Añadir varios productos
  const onItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  //Añadir nueva linea
  const addItem = () => {
    setItems([
      ...items,
      { description: "SERVICIOS PRESTADOS", quantity: "", price: 0 },
    ]);
  };

  const handleBillAction = async (action) => {
    // Abrir ventana ANTES del await para evitar popup blocker
    const needsPdf = action === "save" || action === "save_send";
    const pdfWindow = needsPdf ? window.open("", "_blank") : null;

    try {
      const billData = {
        name: formValues.name,
        lastName: formValues.lastName,
        email: formValues.email,
        nif: formValues.nif,
        direction: formValues.direction,
        items,
        paymentMethod: formValues.paymentMethod,
        idClient: activeClient?._id || null,
        action,
      };

      const response = await startSavingBillClient(billData);

      // 🔥 Recargar facturas del día seleccionado
      const currentDate =
        localStorage.getItem("accounting.selectedDate") ||
        new Date().toISOString().slice(0, 10);

      await startLoadBillByDate(currentDate);

      // 👇 SOLO si backend devuelve PDF → mostrar en la ventana abierta
      if (pdfWindow) {
        const url = window.URL.createObjectURL(response.data);
        pdfWindow.document.write(
          `<html><head><title>Factura</title></head>` +
          `<body style="margin:0"><embed width="100%" height="100%" src="${url}" type="application/pdf"></body></html>`
        );
        pdfWindow.document.close();
      }

      // Notificacion de email
      const sendsEmail = action === "send" || action === "save_send";
      if (sendsEmail && formValues.email) {
        const emailError = response.headers?.["x-email-error"] || response.data?.emailError;
        if (emailError) {
          Swal.fire("Aviso", `La factura se ha creado pero el correo no se pudo enviar a ${formValues.email}`, "warning");
        } else {
          Swal.fire("Correo enviado", `Factura enviada correctamente a ${formValues.email}`, "success");
        }
      }

      closeClientBillModal();
    } catch (error) {
      if (pdfWindow) pdfWindow.close();
      console.error("Error en acción factura", error);
      alert("Error creando la factura");
    }
  };

  //Coste total

  const total = items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    return acc + price;
  }, 0);

  return (
    <Modal
      isOpen={isModalClientBillOpen}
      onRequestClose={closeClientBillModal}
      style={customStyleModal}
      contentLabel={"Añadir Factura"}
    >
      <h1>{"Añadir Factura"}</h1>
      <hr />
      <form className="container">
        <div className="d-flex gap-2">
          <div className="mb-3">
            {/* Datos de cliente */}
            <label className="form-label">Nombre</label>
            <input
              className={`form-control ${titleClass}`}
              name="name"
              type="text"
              value={formValues.name || ""}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              className="form-control"
              name="lastName"
              type="text"
              value={formValues.lastName || ""}
              onChange={onInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              name="email"
              type="text"
              value={formValues.email || ""}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="d-flex gap-2 mb-3">
          <div className="mb-3">
            <label className="form-label">NIF</label>
            <input
              className="form-control"
              name="nif"
              type="text"
              value={formValues.nif || ""}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="form-label">Dirección</label>
            <input
              className="form-control"
              name="direction"
              type="text"
              value={formValues.direction || ""}
              onChange={onInputChange}
            />
          </div>
        </div>
        {/*Añadir varios productos */}
        {items.map((item, index) => (
          <div key={index} className="d-flex gap-2 mb-2">
            <input
              className="form-control"
              type="text"
              placeholder="Descripción"
              value={item.description}
              onChange={(e) =>
                onItemChange(index, "description", e.target.value)
              }
            />

            <input
              className="form-control"
              placeholder="Cantidad"
              type="text"
              value={item.quantity}
              onChange={(e) => onItemChange(index, "quantity", e.target.value)}
            />

            <input
              className="form-control"
              placeholder="Precio"
              type="number"
              value={item.price}
              onChange={(e) => onItemChange(index, "price", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm "
          onClick={addItem}
        >
          + Añadir línea
        </button>
        <div className="d-flex align-items-end gap-4 mt-3 mb-3">
          <div className="flex-grow-1">
            <label className="form-label">Método de pago</label>
            <select
              className="form-select"
              value={formValues.paymentMethod}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  paymentMethod: e.target.value,
                })
              }
            >
              <option value="tarjeta">Tarjeta</option>
              <option value="efectivo">Efectivo</option>
            </select>
          </div>

          <div>
            <label className="form-label fw-bold">Total</label>
            <div className="fs-4 fw-bold">{total.toFixed(2)} €</div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleBillAction("save")}
          >
            Imprimir
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleBillAction("send")}
          >
            Enviar
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleBillAction("save_send")}
          >
            Imprimir y enviar
          </button>
        </div>
      </form>
    </Modal>
  );
};
