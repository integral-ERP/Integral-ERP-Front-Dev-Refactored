import "../styles/pages/Dashboard.scss";
import Sidebar from "./shared/components/SideBar"
import { useState, useEffect } from "react";
import NavBar from "./shared/components/NavBar";
import TRMService from "../services/TRMService";
import HeaderDashboard from "./shared/components/headerDashboard";
import DashboardReport from "./shared/components/DashboardReport";
const Dashboard = () => {

  const [TRM, setTRM] = useState(0);
  const getTRM = async () => {
    const response = await TRMService.getTRMToday();
    console.log(response.data[0].valor);
    setTRM(response.data[0].valor);
  }
  useEffect(() => {
    getTRM();
  }, [])
  
  return (
    <div className="dashboard__layout">
      <div className="dashboard__sidebar">
      
        <Sidebar />
        <HeaderDashboard />
        <DashboardReport />
      </div>
    </div>
  );
};

export default Dashboard;
