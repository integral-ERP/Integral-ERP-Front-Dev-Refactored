import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import CurrencyService from "../../services/CurrencyService";
const ItemAndServiceCreationForm = ({
  itemAndService,
  closeModal,
  creating,
  onitemAndServiceDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [currencies, setcurrencies] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    accountName: "",
    type: "",
    amount: "",
    currency: "",
    iataCode: "",
  });

  useEffect(() => {
    if (!creating && itemAndService) {
      setFormData({
        code: itemAndService.code || "",
        description: itemAndService.description || "",
        accountName: itemAndService.accountName || "",
        type: itemAndService.type || "",
        amount: itemAndService.amount || "",
        currency: itemAndService.currency || "",
        iataCode: itemAndService.iataCode || "",
      });
    }
  }, [creating, itemAndService]);

  useEffect(() => {
    const fetchData = async () => {
      const currenciesData = await CurrencyService.getCurrencies();
      setcurrencies(currenciesData.data);
    };

    fetchData();
  }, []);

  const sendData = async () => {
    let rawData = {
      code: formData.code,
      description: formData.description,
      accountName: formData.accountName,
      type: formData.type,
      amount: formData.amount,
      currency: formData.currency,
      iataCode: formData.iataCode,
    };
    console.log("DATA:", formData);
    const response = await (creating
      ? ItemsAndServicesService.createItemAndService(rawData)
      : ItemsAndServicesService.updateItemsAndServicesService(
          itemAndService.id,
          rawData
        ));

    if (response.status >= 200 && response.status <= 300) {
      console.log(
        "Item & Service successfully created/updated:",
        response.data
      );
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onitemAndServiceDataChange();
        setShowSuccessAlert(false);
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  return (
    <div className="company-form">
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#definition"
            aria-selected={activeTab === "definition"}
            onClick={() => setActiveTab("definition")}
            role="tab"
          >
            Definition
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#automaticCreation"
            aria-selected={activeTab === "automaticCreation"}
            onClick={() => setActiveTab("automaticCreation")}
            tabIndex="-1"
            role="tab"
          >
            Automatic Creation
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#notes"
            aria-selected={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
            tabIndex="-1"
            role="tab"
          >
            Notes
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#other"
            aria-selected={activeTab === "other"}
            onClick={() => setActiveTab("other")}
            tabIndex="-1"
            role="tab"
          >
            Other
          </a>
        </li>
      </ul>
      <form
        className={`tab-pane fade ${
          activeTab === "definition" ? "show active" : ""
        } company-form__general-form`}
        id="general"
        style={{ display: activeTab === "definition" ? "block" : "none" }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Type:</label>
              <select className="medium-select">
                <option value="">Select an option</option>
                <option value="other">Other</option>
                <option value="freight">Freight</option>
                <option value="valuation">Valuation</option>
                <option value="tax">Tax</option>
                <option value="other freight">Other Freight</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="description"
                placeholder="Description..."
                value={formData.description}
                changeHandler={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                label="Description"
              />
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="code"
                placeholder="code"
                value={formData.code}
                changeHandler={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                label="Code"
              />
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Account:</label>
              <select className="medium-select">
                <option value="">Select an account</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Price:</label>
              <select className="medium-select">
                <option value="">Select an account</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section">
              <Input
                type="checkbox"
                inputName="resale"
                value={formData.resale}
                changeHandler={(e) =>
                  setFormData({ ...formData, resale: e.target.checked })
                }
                label="It is a resale item"
              />
            </div>
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Tax Code:</label>
              <select className="medium-select">
                <option value="">Select an option</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section">
              <Input
                type="checkbox"
                inputName="createResale"
                value={formData.createResale}
                changeHandler={(e) =>
                  setFormData({ ...formData, createResale: e.target.checked })
                }
                label="Create related resale item automatically"
              />
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Expense Item:</label>
              <select className="medium-select">
                <option value="">Select an account</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Preferred Vendor:</label>
              <select className="medium-select">
                <option value="">Select an account</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">3rd party liability account:</label>
              <select className="medium-select">
                <option value="">Select an account</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">3rd party asset account:</label>
              <select className="medium-select">
                <option value="">Select an account</option>
                <option value="freight">Freight</option>
              </select>
            </div>
            <div className="company-form__section" style={{ display: "flex" }}>
              <label htmlFor="">Currency:</label>
              <select className="medium-select">
                <option value="">Select a currency</option>
                {Object.entries(currencies).map(
                  ([currencyCode, currencyName]) => (
                    <option key={currencyCode} value={currencyCode}>
                      {currencyCode} - {currencyName}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="company-form__section">
              <Input
                type="checkbox"
                inputName="3rdPartyBilling"
                value={formData.thirdPartyBilling}
                changeHandler={(e) =>
                  setFormData({ ...formData, thirdPartyBilling: e.target.checked })
                }
                label="Enforce 3rd party billing"
              />
            </div>
            <div className="company-form__section">
              <Input
                type="checkbox"
                inputName="inactive"
                value={formData.inactive}
                changeHandler={(e) =>
                  setFormData({ ...formData, inactive: e.target.checked })
                }
                label="Inactive"
              />
            </div>
          </div>
          {/* ----------------------------END TWO---------------------------------- */}
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "address" ? "show active" : ""
        } company-form__general-form`}
        id="address"
        style={{ display: activeTab === "address" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <Input
            type="textarea"
            inputName="street"
            placeholder="Street & Address..."
            value={formData.streetNumber}
            changeHandler={(e) =>
              setFormData({ ...formData, streetNumber: e.target.value })
            }
            label="Street & Address"
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="wp-country" className="form-label">
            Country
          </label>
        </div>
        <div className="company-form__section">
          <label htmlFor="wp-state" className="form-label">
            State:
          </label>
        </div>
        <div className="company-form__section">
          <label htmlFor="wp-city" className="form-label">
            City:
          </label>
        </div>
        <div className="company-form__section">
          <Input
            type="text"
            inputName="zipcode"
            placeholder="Zip Code..."
            value={formData.zipCode}
            changeHandler={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            label="Zip Code"
          />
        </div>
      </form>
      <div className="company-form__options-container">
        <button className="button-save" onClick={sendData}>
          Save
        </button>
        <button className="button-cancel" onClick={closeModal}>
          Cancel
        </button>
      </div>
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Vendor {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert
          severity="error"
          onClose={() => setShowErrorAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Vendor. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

ItemAndServiceCreationForm.propTypes = {
  itemAndService: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onitemAndServiceDataChange: propTypes.func,
};

ItemAndServiceCreationForm.defaultProps = {
  itemAndService: {},
  closeModal: null,
  creating: false,
  onitemAndServiceDataChange: null,
};

export default ItemAndServiceCreationForm;
