import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  OverviewClient,
  ReservationsClient,
  SalesClient,
  ProfileClient,
} from "../clients/components/clientPage";
import {
  ClientPage,
  ClientsPage,
} from "../clients/pages";
import { AddNewSales } from "../clients/components/clientPage/AddNewSales";
import { LoginPage } from "../auth/pages/LoginPage";
import { useAuthStore } from "../hooks/useAuthStore";

// Lazy loading: paginas de uso ocasional/administrativo
const StorePage = lazy(() => import("../clients/pages/StorePage"));
const RatesPage = lazy(() => import("../clients/pages/RatesPage"));
const LabelsPage = lazy(() => import("../clients/pages/LabelsPage"));
const Accounting = lazy(() => import("../clients/pages/Accounting"));
const MonthlySummary = lazy(() => import("../clients/pages/MonthlySummary"));
const RegisterPage = lazy(() => import("../auth/pages/RegisterPage"));
const ProfileUserPage = lazy(() => import("../auth/pages/ProfileUserPage"));
const BackupPage = lazy(() => import("../clients/pages/BackupPage"));
const PageDailyBox = lazy(() => import("../clients/components/clientPage/accounting/PageDailyBox"));
const PageMonthSummary = lazy(() => import("../clients/components/clientPage/accounting/PageMonthSummary"));
const PageMonthPending = lazy(() => import("../clients/components/clientPage/accounting/PageMonthPending"));
const PageDailyBill = lazy(() => import("../clients/components/clientPage/accounting/PageDailyBill"));

/** Spinner de carga mientras se descarga un chunk lazy */
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export const AppRoutes = () => {
  const { status } = useAuthStore();

  if (status === "checking") {
    return <h3>Cargando...</h3>;
  }

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          {/* ----------------------Login/Register---------------------- */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          {/* ----------------------Clientes---------------------- */}
          <Route path="/" element={<ClientsPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
          {/* ----------------------Cliente---------------------- */}
          <Route path=":idClient" element={<ClientPage />}>
            {/* Ruta índice: /clients/ */}
            <Route index element={<Navigate to="overview" replace />} />
            {/* Vista general */}
            <Route path="overview" element={<OverviewClient />} />
            {/* Reservas */}
            <Route path="reservations" element={<ReservationsClient />} />
            {/* Ventas */}
            <Route path="sales" element={<SalesClient />} />
            {/* AddVentas */}
            <Route path="addSales" element={<AddNewSales />} />
            {/* Perfil */}
            <Route path="profile" element={<ProfileClient />} />
          </Route>

          {/* ----------------------Tienda---------------------- */}
          <Route path="/store" element={<Suspense fallback={<PageLoader />}><StorePage /></Suspense>} />

          {/* ----------------------Servicios---------------------- */}
          <Route path="/rates" element={<Suspense fallback={<PageLoader />}><RatesPage /></Suspense>} />

          {/* ----------------------Etiquetas---------------------- */}
          <Route path="/labels" element={<Suspense fallback={<PageLoader />}><LabelsPage /></Suspense>} />

          {/* ----------------------Contabilidad---------------------- */}
          <Route path="/accounting" element={<Suspense fallback={<PageLoader />}><Accounting /></Suspense>}>
            <Route index element={<Navigate to="dailyBox" replace />} />
            <Route path="dailyBox" element={<Suspense fallback={<PageLoader />}><PageDailyBox /></Suspense>} />
            <Route path="monthSummary" element={<Suspense fallback={<PageLoader />}><PageMonthSummary /></Suspense>} />
            <Route path="monthUnpaid" element={<Suspense fallback={<PageLoader />}><PageMonthPending /></Suspense>} />
            <Route path="dailyBill" element={<Suspense fallback={<PageLoader />}><PageDailyBill /></Suspense>} />
          </Route>

          {/* ----------------------Resumen mensual---------------------- */}
          <Route path="/monthly-summary" element={<Suspense fallback={<PageLoader />}><MonthlySummary /></Suspense>} />

          {/* ----------------------Registro de usuarios (solo admin)---------------------- */}
          <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />

          {/* ----------------------Copias de seguridad (solo admin)---------------------- */}
          <Route path="/admin/backups" element={<Suspense fallback={<PageLoader />}><BackupPage /></Suspense>} />

          {/* ----------------------Perfil de usuario---------------------- */}
          <Route path="/profileUser" element={<Suspense fallback={<PageLoader />}><ProfileUserPage /></Suspense>} />
        </>
      )}
    </Routes>
  );
};
