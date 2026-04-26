
import { useEffect } from "react";
import { useClientsStore } from "../../hooks/useClientsStore";
import { MenuAccounting } from "../components/clientPage/accounting/MenuAccounting";
import { Outlet } from "react-router-dom";


export const Accounting = () => {

  const { setActiveClient } = useClientsStore();

  useEffect(() => {
    setActiveClient(null);
  }, []);
 

  return (
    <div className="m-5 fade-in">
      <div className="pt-5 align-items-center">
        <h1 className="mb-4">Contabilidad</h1>
      </div>
      <div className="justify-content-between">
        <div>
          <MenuAccounting />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Accounting;
