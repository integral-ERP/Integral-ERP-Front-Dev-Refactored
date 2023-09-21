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
      {/* <h1>Hola mundo</h1> */}
      <div className="dashboard__content">
        <div className="content__options">
          <div className="content__info">
            <h2 className="content__title">Home</h2>
            <h3 className="content__subtitle">Welcome to integral</h3>
            <div className="content__search-bar">Search</div>
          </div>
          <div className="content__trm">Tasa Representativa del mercado: ${TRM}</div>
        </div>

        <div className="content__cards">
          <div className="content__card">
            <i className="bx bx-plus-circle card__icon"></i>
            <h4 className="card__title">New Reception</h4>
          </div>
          <div className="content__card">
            <i className="bx bx-store-alt card__icon"></i>
            <h4 className="card__title">Items in Warehouse</h4>
          </div>
          <div className="content__card">
            <i className="bx bx-package card__icon"></i>
            <h4 className="card__title">New Shipment</h4>
          </div>
          <div className="content__card">
            <i className="bx bx-bell card__icon"></i>
            <h4 className="card__title">Pre - Alerts</h4>
          </div>
          <div className="content__card">
            <i className="bx bx-copy-alt card__icon"></i>
            <h4 className="card__title">Instructions Received</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
