import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import PortServices from "../../services/PortServices";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
const PortsCreationForm = ({
  port,
  closeModal,
  creating,
  onPortDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("port");
  const [countries, setCountries] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    method: "",
    country: "",
    subdivision: "",
    used: false,
    usCustomsCode: "",
    rail: false,
    road: false,
    maritime: false,
    air: false,
    mail: false,
    borderCrossing: false,
  });

  const handleCountryChange = (event) => {
    setFormData({ ...formData, country: event.target.value });
  };

  const handleMethodSelection = (option) => {
    const updatedFormData = { ...formData };
    updatedFormData[option] = true;
    setFormData(updatedFormData);
  };

  useEffect(() => {
    if (!creating && port) {
      setFormData({
        name: port.name || "",
        code: port.code || "",
        method: port.method || "",
        country: port.country || "",
        subdivision: port.subdivision || "",
        used: port.used || "",
        usCustomsCode: port.usCustomsCode || "",
        rail: port.rail || false,
        road: port.road || false,
        maritime: port.maritime || false,
        air: port.air || false,
        mail: port.mail || false,
        borderCrossing: port.borderCrossing || false,
      });
    }
  }, [creating, port]);

  useEffect(() => {
    const fetchData = async () => {
      const countriesData = await CountriesService.fetchCountries();
      setCountries(countriesData.data);
    };

    fetchData();
  }, []);

  const sendData = async () => {
    let rawData = {
      name: formData.name,
      code: formData.code,
      method: formData.method,
      country: formData.country,
      subdivision: formData.subdivision,
      used: formData.used,
      usCustomsCode: formData.usCustomsCode,
      rail: formData.rail,
      road: formData.road,
      maritime: formData.maritime,
      air: formData.air,
      mail: formData.mail,
      borderCrossing: formData.borderCrossing,
    };

    const response = await (creating
      ? PortServices.createPort(rawData)
      : PortServices.updatePort(port.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Port successfully created/updated:", response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onPortDataChange();
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
            href="#port"
            aria-selected={activeTab === "port"}
            onClick={() => setActiveTab("port")}
            role="tab"
          >
            Port
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#uscustomcodes"
            aria-selected={activeTab === "uscustomcodes"}
            onClick={() => setActiveTab("uscustomcodes")}
            tabIndex="-1"
            role="tab"
          >
            US Customs Codes
          </a>
        </li>
      </ul>
      <form
        className={`tab-pane fade ${
          activeTab === "port" ? "show active" : ""
        } company-form__general-form`}
        id="port"
        style={{ display: activeTab === "port" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <label htmlFor="wp-country" className="company-form__label">
            Country
          </label>
          <select
            name="wp-country"
            id="wp-country"
            className="company-form__input"
            value={formData.country}
            onChange={(e) => handleCountryChange(e)}
          >
            <option value="">Select a country</option>
            {formData.country &&
              countries
                .filter((country) => country.name === formData.country)
                .map((country) => (
                  <option
                    key={country.iso2}
                    value={country.name}
                    data-key={country.iso2}
                  >
                    {country.name}
                  </option>
                ))}
            {!formData.city &&
              countries.map((country) => (
                <option
                  key={country.iso2}
                  value={country.name}
                  data-key={country.iso2}
                >
                  {country.name}
                </option>
              ))}
          </select>
        </div>
        <div className="company-form__section">
          <Input
            type="text"
            inputName="portid"
            placeholder="Port ID..."
            value={formData.code}
            changeHandler={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            label="Port ID"
          />
        </div>
        <div className="company-form__section">
          <Input
            type="text"
            inputName="portname"
            placeholder="Port Name..."
            value={formData.name}
            changeHandler={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            label="Port Name"
          />
        </div>
        <div className="company-form__section">
          <Input
            type="text"
            inputName="subdivision"
            placeholder="Subdivision..."
            value={formData.subdivision}
            changeHandler={(e) =>
              setFormData({ ...formData, subdivision: e.target.value })
            }
            label="Subdivision"
          />
        </div>
        <label className="company-form__label">Transportation method</label>
        <div className="startup-wizard-form__section">
          <hr />
          <div className="checkbox_container">
            <Input
              type="checkbox"
              inputName="maritime"
              value={formData.maritime}
              changeHandler={(e) =>
                setFormData({ ...formData, maritime: e.target.checked })
              }
              label="Maritime"
            />
            <Input
              type="checkbox"
              inputName="rail"
              value={formData.rail}
              changeHandler={(e) =>
                setFormData({ ...formData, rail: e.target.checked })
              }
              label="Rail"
            />
            <Input
              type="checkbox"
              inputName="road"
              value={formData.road}
              changeHandler={(e) =>
                setFormData({ ...formData, road: e.target.value })
              }
              label="Road"
            />
            <Input
              type="checkbox"
              inputName="air"
              value={formData.air}
              changeHandler={(e) =>
                setFormData({ ...formData, air: e.target.value })
              }
              label="Air"
            />
            <Input
              type="checkbox"
              inputName="mail"
              value={formData.mail}
              changeHandler={(e) =>
                setFormData({ ...formData, mail: e.target.value })
              }
              label="Mail"
            />
            <Input
              type="checkbox"
              inputName="borderCrossing"
              value={formData.borderCrossing}
              changeHandler={(e) =>
                setFormData({ ...formData, borderCrossing: e.target.value })
              }
              label="Border Crossing Point"
            />
          </div>
        </div>
        <hr />
        <div className="company-form__section">
          <Input
            type="checkbox"
            inputName="usedbycompany"
            value={formData.used}
            changeHandler={(e) =>
              setFormData({ ...formData, used: e.target.checked })
            }
            label="This port is used by my company"
          />
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "uscustomcodes" ? "show active" : ""
        } company-form__general-form`}
        id="uscustomcodes"
        style={{ display: activeTab === "uscustomcodes" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <Input
            type="textarea"
            inputName="uscustomcodes"
            placeholder="US Custom Codes..."
            value={formData.usCustomsCode}
            changeHandler={(e) =>
              setFormData({ ...formData, usCustomsCode: e.target.value })
            }
            label="US Custom Codes"
          />
        </div>
      </form>
      <div className="company-form__options-container">
        <button
          className="company-form__option btn btn-primary"
          onClick={sendData}
        >
          Save
        </button>
        <button
          className="company-form__option btn btn-secondary"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
          <AlertTitle>Success</AlertTitle>
          <strong>
            Port {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Port. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

PortsCreationForm.propTypes = {
  port: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onPortDataChange: propTypes.func,
};

PortsCreationForm.defaultProps = {
  port: {},
  closeModal: null,
  creating: false,
  onPortDataChange: null,
};

export default PortsCreationForm;
