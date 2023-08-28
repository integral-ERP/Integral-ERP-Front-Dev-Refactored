import { useState } from "react";
import "../../../styles/components/SideBar.scss"
import { useModal } from "../../../hooks/useModal"
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [close, setClose] = useState(false);
  useModal(false);
  const handleDropdownClose = (index) => {
    setClose(!close);
  };

  const [more, setMore] = useState("");
  useModal(false);
  const handleDropdownMore = (index) => {
    if (index === more) {
      setMore("");
    } else {
      setMore(index);
    }
  };

  return (
    <>
      <div className={`sidebar ${close ? "close" : ""}`}>
        <div className="logo-details">
          <i className="bx bxl-c-plus-plus"></i>
          <span className="logo_name">Logo</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link to={"/dashboard"}>
              <i className="bx bx-home"></i>
              <span className="link_name">Home</span>
            </Link>

            <ul className="sub-menu blank">
              <li>
                <a className="link_name" href="#">
                  Home
                </a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "warehouse" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-building"></i>
                <span className="link_name">Warehouse</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("warehouse")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Warehouse
                </a>
              </li>
              <li>
                <a href="#">Pick Up Order</a>
              </li>
              <li>
                <a href="#">Reception</a>
              </li>
              <li>
                <a href="#">Release</a>
              </li>
              <li>
                <a href="#">Commodities</a>
              </li>
              <li>
                <a href="#">Pre Alerts</a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "shipments" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-paper-plane"></i>
                <span className="link_name">Shipments</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("shipments")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Shipments
                </a>
              </li>
              <li>
                <a href="#">Shipment list</a>
              </li>
              <li>
                <a href="#">New master</a>
              </li>
              <li>
                <a href="#">Master list</a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "rates" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-bar-chart-alt-2"></i>
                <span className="link_name">Rates</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("rates")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Rates
                </a>
              </li>
              <li>
                <a href="#">Standard Rates</a>
              </li>
              <li>
                <a href="#">Client Rates</a>
              </li>
              <li>
                <a href="#">Carrier Rates</a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "customs" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-book-open"></i>
                <span className="link_name">Customs</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("customs")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Customs
                </a>
              </li>
              <li>
                <a href="#">1166 XML Import</a>
              </li>
              <li>
                <a href="#">1138 XML Export</a>
              </li>
              <li>
                <a href="#">1084 XML Duties </a>
              </li>
              <li>
                <a href="#">IBA report in txt</a>
              </li>
              <li>
                <a href="#">Simplified Duties </a>
              </li>
              <li>
                <a href="#">Proof of Delivery</a>
              </li>
              <li>
                <a href="#">Value Proposals </a>
              </li>
              <li>
                <a href="#">Changes in Custom's </a>
              </li>
              <li>
                <a href="#">Aprehensions</a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "accounting" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-money-withdraw"></i>
                <span className="link_name">Accounting</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("accounting")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Accounting
                </a>
              </li>
              <li>
                <a href="#">Chart of Accounts</a>
              </li>
              <li>
                <a href="#">Items & Services</a>
              </li>
              <li>
                <a href="#">Invoices</a>
              </li>
              <li>
                <a href="#">Bills</a>
              </li>
              <li>
                <a href="#">Collections</a>
              </li>
              <li>
                <a href="#">Deposits</a>
              </li>
              <li>
                <a href="#">Payments</a>
              </li>
            </ul>
          </li>
          <li
            className={`arrow  ${more === "onlineCustomer" ? "showMenu" : ""}`}
          >
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-user-circle"></i>
                <span className="link_name">Online Customer</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("onlineCustomer")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Online Customer
                </a>
              </li>
              <li>
                <a href="#">pre alerts</a>
              </li>
              <li>
                <a href="#">Items & Services</a>
              </li>
              <li>
                <a href="#">Instructions</a>
              </li>
              <li>
                <a href="#">Payments</a>
              </li>
              <li>
                <a href="#">Shipments</a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "agent" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-briefcase"></i>
                <span className="link_name">Agent</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("agent")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Agent
                </a>
              </li>
              <li>
                <a href="#">Search</a>
              </li>
              <li>
                <a href="#">New Reception</a>
              </li>
              <li>
                <a href="#">New Shipment</a>
              </li>
              <li>
                <a href="#">Payments</a>
              </li>
              <li>
                <a href="#">Shipment list</a>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "maintenance" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-cog"></i>
                <span className="link_name">Maintenance</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("maintenance")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link to={"/maintenance"}>
                  <a className="link_name" href="#">
                    Maintenance
                  </a>
                </Link>
              </li>
              <li>
                <Link to={"/maintenance/carriers"}>Carriers</Link>
              </li>
              <li>
                <a href="#">Agents</a>
              </li>
              <li>
                <a href="#">Vendors</a>
              </li>
              <li>
                <a href="#">Customers</a>
              </li>
              <li>
                <a href="#">Employees</a>
              </li>
              <li>
                <a href="#">Ports</a>
              </li>
              <li>
                <a href="#">Package Type</a>
              </li>
              <li>
                <a href="#">Warehouse providers</a>
              </li>
              <li>
                <a href="#">Locations</a>
              </li>
              <li>
                <a href="#">Countries</a>
              </li>
            </ul>
          </li>
          <li
            className={`arrow  ${more === "configuration" ? "showMenu" : ""}`}
          >
            <div className="icon-link">
              <a href="#">
                <i className="bx bx-universal-access"></i>
                <span className="link_name">Configuration</span>
              </a>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("configuration")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Configuration
                </a>
              </li>
              <li>
                <a href="#">Company</a>
              </li>
              <li>
                <a href="#">Air Operations</a>
              </li>
              <li>
                <a href="#">Document Numbers</a>
              </li>
              <li>
                <a href="#">Email Templates</a>
              </li>
              <li>
                <a href="#">Measurement Units</a>
              </li>
              <li>
                <a href="#">Clauses</a>
              </li>
              <li>
                <a href="#">Events</a>
              </li>
              <li>
                <a href="#">Ocean Operations</a>
              </li>
              <li>
                <a href="#">Payment Terms</a>
              </li>
              <li>
                <a href="#">Shipment Documents</a>
              </li>
            </ul>
          </li>

          <li>
            <div className="profile-details">
              <div className="profile-content">
                <img src="image/profile.jpg" alt="profile" />
              </div>

              <div className="name-job">
                <div className="profile_name">Usuario</div>
                <div className="job">Rol</div>
              </div>
              <i className="bx bx-log-out"></i>
            </div>
          </li>
        </ul>
      </div>
      <section className="home-section">
        <div className="home-content">
          <i
            className="bx bx-menu menu__icon"
            onClick={handleDropdownClose}
          ></i>
          <span className="text">Drop down sidebar</span>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
