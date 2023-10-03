import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../views/Login";
import Home from "../views/Home";
import Dashboard from "../views/Dashboard";
import Maintenance from "../views/Manteinance/Maintenance";
import Carriers from "../views/Manteinance/Carriers";
import WarehouseProviders from "../views/Manteinance/WarehouseProviders";
import ForwardingAgents from "../views/Manteinance/ForwardingAgents";
import Customers from "../views/Manteinance/Customers";
import Vendors from "../views/Manteinance/Vendors";
import Employees from "../views/Manteinance/Employees";
import PackageType from "../views/Manteinance/PackageType";
import Ports from "../views/Manteinance/Ports";
import Countries from "../views/Manteinance/Countries"
import Locations from "../views/Manteinance/Locations"
import Pickup from "../views/Warehouse/Pickup";
import ItemsAndServices from "../views/Accounting/ItemsAndServices";

import MeasurementUnits from "../views/Configuration/MeasurementUnits";

export const RoutesConfiguration = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/maintenance/carriers" element={<Carriers />} />
        <Route path="/maintenance/warehouseProviders" element={<WarehouseProviders />} />
        <Route path="/maintenance/forwardingAgents" element={<ForwardingAgents />} />
        <Route path="/maintenance/customers" element={<Customers />} />
        <Route path="/maintenance/vendors" element={<Vendors />} />
        <Route path="/maintenance/employees" element={<Employees />} />
        <Route path="/maintenance/packageTypes" element={<PackageType />} />
        <Route path="/maintenance/ports" element={<Ports />} />
        <Route path="/maintenance/countries" element={<Countries />} />
        <Route path="/maintenance/locations" element={<Locations />} />
        <Route path="/warehouse/pickup" element={<Pickup />} />
        <Route path="/accounting/itemsandservices" element={<ItemsAndServices />} />
        <Route path="/configuration/measurementunits" element={<MeasurementUnits />} />
      </Routes>
    </Router>
  );
};
