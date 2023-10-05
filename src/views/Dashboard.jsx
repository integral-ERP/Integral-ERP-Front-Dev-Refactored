import "../styles/pages/Dashboard.scss";
import Sidebar from "./shared/components/SideBar"
import { useState, useEffect } from "react";
import NavBar from "./shared/components/NavBar";
import TRMService from "../services/TRMService";
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
      </div>
    </div>
  );
};

export default Dashboard;
