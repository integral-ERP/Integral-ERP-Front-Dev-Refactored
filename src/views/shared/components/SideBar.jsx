import { useState } from "react";
import "../../../styles/components/SideBar.scss";
import { useModal } from "../../../hooks/useModal";
import { Link } from "react-router-dom";
import MyCompanyForm from "../../forms/MyCompanyForm";
import ModalForm from "../components/ModalForm";

import logo from "../../../img/logotext.png";
import usuario from "../../../img/usuario.png";

const Sidebar = () => {
  const [close, setClose] = useState(false);
  useModal(false);
  const handleDropdownClose = (index) => {
    setClose(!close);
  };

  const [isOpenCompanyForm, openCompanyForm, closeCompanyForm] =
    useModal(false);
  useModal(false);
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
          <img className="logo_name" src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to={"/dashboard"}>
              <i className="bx bx-home"></i>
              <span className="link_name">Home</span>
            </Link>

            <ul className="sub-menu blank">
              <li>
                <Link className="link_name">Home</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "warehouse" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-building"></i>
                <span className="link_name">Warehouse</span>
              </Link>

              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("warehouse")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Warehouse</Link>
              </li>
              <li>
                <Link to={"/warehouse/pickup"}>Pick-up Orders</Link>
              </li>
              <li>
                <Link to={"/warehouse/receipt"}>Reception</Link>
              </li>
              <li>
                <Link to={"/warehouse/release"}>Release</Link>
              </li>
              <li>
                <Link to={"/warehouse/commodities"}>Commodities</Link>
              </li>
              <li>
                <Link to={"/warehouse/prealerts"}>Pre Alerts</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "shipments" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-paper-plane"></i>
                <span className="link_name">Shipments</span>
              </Link>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("shipments")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Shipments</Link>
              </li>
              <li>
                <Link to={"/shipments"}>Shipment list</Link>
              </li>

              <li>
                <Link to={"/shipments/master"}>Master List</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "rates" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-bar-chart-alt-2"></i>
                <span className="link_name">Rates</span>
              </Link>

              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("rates")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Rates</Link>
              </li>
              <li>
                <Link to={"/rates/standard"}>Standard Rates</Link>
              </li>
              <li>
                <Link to={"/rates/client"}>Client Rates</Link>
              </li>
              <li>
                <Link to={"/rates/carrier"}>Carrier Rates</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "customs" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-book-open"></i>
                <span className="link_name">Customs</span>
              </Link>

              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("customs")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Customs</Link>
              </li>
              <li>
                <Link to={"/customs/1166xml"}>1166 XML Import</Link>
              </li>
              <li>
                <Link to={"/customs/1138xml"}>1138 XML Export</Link>
              </li>
              <li>
                <Link to={"/customs/1084xml"}>1084 XML Duties</Link>
              </li>
              <li>
                <Link to={"/customs/ibareport"}>IBA report in txt</Link>
              </li>
              <li>
                <Link to={"/customs/simplifiedduties"}>Simplified Duties</Link>
              </li>
              <li>
                <Link to={"/customs/proofdelivery"}>Proof of Delivery</Link>
              </li>
              <li>
                <Link to={"/customs/valueproposal"}>Value Proposals</Link>
              </li>
              <li>
                <Link to={"/customs/changesincustoms"}>
                  Changes in Custom's{" "}
                </Link>
              </li>
              <li>
                <Link to={"/customs/aprehensions"}>Aprehensions</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "accounting" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-money-withdraw"></i>
                <span className="link_name">Accounting</span>
              </Link>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("accounting")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Accounting</Link>
              </li>
              <li>
                <Link to={"/accounting/chartofaccounts"}>
                  Chart of Accounts
                </Link>
              </li>
              <li>
                <Link to={"/accounting/itemsandservices"}>
                  Items & Services
                </Link>
              </li>
              <li>
                <Link to={"/accounting/invoices"}>Invoices</Link>
              </li>
              <li>
                <Link to={"/accounting/bills"}>Bills</Link>
              </li>
              <li>
                <Link to={"/accounting/collections"}>Collections</Link>
              </li>
              <li>
                <Link to={"/accounting/deposits"}>Deposits</Link>
              </li>
              <li>
                <Link to={"/accounting/payments"}>Payments</Link>
                {/* <a href="#">Payments</a> */}
              </li>
            </ul>
          </li>
          <li
            className={`arrow  ${more === "onlineCustomer" ? "showMenu" : ""}`}
          >
            <div className="icon-link">
              <Link>
                <i className="bx bx-user-circle"></i>
                <span className="link_name">Online Customer</span>
              </Link>
              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("onlineCustomer")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Online Customer</Link>
              </li>
              <li>
                <Link to={"/warehouse/prealerts"}>Pre Alerts</Link>
              </li>
              <li>
                <Link to={"/accounting/itemsandservices"}>
                  Items & Services
                </Link>
              </li>
              <li>
                <Link to={"/accounting/instructions"}>Instructions</Link>
              </li>
              <li>
                <Link to={"/accounting/payments"}>Payments</Link>
              </li>
              <li>
                <Link to={"/shipments"}>Shipments</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "agent" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-briefcase"></i>
                <span className="link_name">Agent</span>
              </Link>

              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("agent")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Agent</Link>
              </li>
              <li>
                <Link to={"/agent/search"}>Search</Link>
              </li>
              <li>
                <Link to={"/agent/newreception"}>New Reception</Link>
              </li>
              <li>
                <Link to={"/shipments"}>Shipment list</Link>
              </li>
              <li>
                <Link to={"/accounting/payments"}>Payments</Link>
              </li>
            </ul>
          </li>
          <li className={`arrow  ${more === "maintenance" ? "showMenu" : ""}`}>
            <div className="icon-link">
              <Link>
                <i className="bx bx-cog"></i>
                <span className="link_name">Maintenance</span>
              </Link>
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
                <Link to={"/maintenance/forwardingAgents"}>
                  Forwarding Agents
                </Link>
              </li>
              <li>
                <Link to={"/maintenance/vendors"}>Vendors</Link>
              </li>
              <li>
                <Link to={"/maintenance/customers"}>Customers</Link>
              </li>
              <li>
                <Link to={"/maintenance/employees"}>Employees</Link>
              </li>
              <li>
                <Link to={"/maintenance/ports"}>Ports</Link>
              </li>
              <li>
                <Link to={"/maintenance/packageTypes"}>Package Types</Link>
              </li>
              <li>
                <Link to={"/maintenance/warehouseProviders"}>
                  Warehouse Providers
                </Link>
              </li>
              <li>
                <Link to={"/maintenance/locations"}>Locations</Link>
              </li>
              <li>
                <Link to={"/maintenance/countries"}>Countries</Link>
              </li>
            </ul>
          </li>
          <li
            className={`arrow  ${more === "configuration" ? "showMenu" : ""}`}
          >
            <div className="icon-link">
              <Link>
                <i className="bx bx-universal-access"></i>
                <span className="link_name">Configuration</span>
              </Link>

              <i
                className="bx bxs-chevron-down arrow"
                onClick={() => handleDropdownMore("configuration")}
              ></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Configuration</Link>
              </li>
              <li>
                <Link onClick={openCompanyForm}>
                  Company
                  <ModalForm
                    isOpen={isOpenCompanyForm}
                    closeModal={closeCompanyForm}
                  >
                    <MyCompanyForm
                      closeModal={closeCompanyForm}
                    ></MyCompanyForm>
                  </ModalForm>
                </Link>
              </li>
              <li>
                <Link to={"/Configuration/airoperations"}>Air Operations</Link>
              </li>
              <li>
                <Link to={"/Configuration/documentnumbers"}>
                  Document Numbers
                </Link>
              </li>
              <li>
                <Link to={"/Configuration/emailtemplates"}>
                  Email Templates
                </Link>
              </li>
              <li>
                <Link to={"/Configuration/measurementunits"}>
                  Measurement Units
                </Link>
              </li>
              <li>
                <Link to={"/Configuration/clauses"}>Clauses</Link>
              </li>
              <li>
                <Link to={"/Configuration/events"}>Events</Link>
              </li>
              <li>
                <Link to={"/Configuration/oceanoperations"}>
                  Ocean Operations
                </Link>
              </li>
              <li>
                <Link to={"/Configuration/paymentterms"}>Payment Terms</Link>
              </li>
              <li>
                <Link to={"/Configuration/shipmentdocuments"}>
                  Shipment Documents
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <section className="home-section">
        <div className="home-content">
          <i
            className="bx bx-menu menu__icon"
            onClick={handleDropdownClose}
          ></i>
          <span className="text">Integralerp</span>

          <div className="rith">
            <div className="profile-user">
              <div className="profile-content">
                <img className="img-usuario" src={usuario} alt="usuario" />
              </div>
              <div className="name-job">
                <div className="profile_user">Usuario</div>
                <div className="job">Rol</div>
              </div>
              <i className="bx bx-log-out profile-bx"></i>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
