import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../views/Login";
import Home from "../views/Home";
import Dashboard from "../views/Dashboard";
import Maintenance from "../views/Maintenance";
import Carriers from "../views/Carriers";
import WarehouseProviders from "../views/WarehouseProviders";
import ForwardingAgents from "../views/ForwardingAgents";
import Customers from "../views/Customers";
import Vendors from "../views/Vendors";
import Employees from "../views/Employees";
import PackageType from "../views/PackageType";
import Ports from "../views/Ports";
import Countries from "../views/Countries"
import Locations from "../views/Locations"
import PickUpList from "../views/Pickup";
export const RoutesConfiguration = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/maintenance/carriers" element={<Carriers />} />
        <Route
          path="/maintenance/warehouseProviders"
          element={<WarehouseProviders />}
        />
        <Route
          path="/maintenance/forwardingAgents"
          element={<ForwardingAgents />}
        />
        <Route path="/maintenance/customers" element={<Customers />} />
        <Route path="/maintenance/vendors" element={<Vendors />} />
        <Route path="/maintenance/employees" element={<Employees />} />
        <Route path="/maintenance/packageTypes" element={<PackageType />} />
        <Route path="/maintenance/ports" element={<Ports />} />
        <Route path="/maintenance/countries" element={<Countries />} />
        <Route path="/maintenance/locations" element={<Locations />} />
        <Route path="/warehouse/pickup" element={<PickUpList />} />
      </Routes>
    </Router>
  );
};
