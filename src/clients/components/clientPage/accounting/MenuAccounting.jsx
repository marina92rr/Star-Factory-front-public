/**
 * @description Menu de navegacion por pestanas de la seccion de contabilidad.
 * Muestra enlaces a: Caja diaria, Resumen mensual, Impagos y Facturas.
 * @returns {JSX.Element} Menu horizontal con pestanas de contabilidad
 */
import { NavLink } from "react-router-dom";

const links = [
  { name: "Caja diaria", path: "dailyBox" }, // ruta índice: /clients/:id
  { name: "Resumen", path: "monthSummary" },
  { name: "Impagos", path: "monthUnpaid" },
  {name: "Facturas", path: "dailyBill"}
];

export const MenuAccounting = () => {
  // Opcional: si quieres mostrar el ID en cada enlace

  return (
    <nav className="nav nav-tabs mb-4">
      {links.map(({ name, path, badge }) => (
        <NavLink
          key={path}
          to={path}
          end={path === ""}
          className={({ isActive }) =>
            `nav-link text-secondary ${isActive ? "active" : ""}`
          }
          style={({ isActive }) => (isActive ? { color: "#6c757d" } : {})}
        >
          {name}
          {badge ? <span className="badge bg-danger ms-1">{badge}</span> : null}
        </NavLink>
      ))}
    </nav>
  );
};
