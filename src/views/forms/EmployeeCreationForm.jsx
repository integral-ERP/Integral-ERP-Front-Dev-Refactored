import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import EmployeeService from "../../services/EmployeeService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";

const EmployeeCreationForm = ({
  employee,
  closeModal,
  creating,
  onEmployeeDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const idTypes = ["CC", "CE", "NIT"];
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    fax: "",
    streetNumber: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    numIdentification: "",
    typeIdentificacion: "CC",
  });

  const handleCountryChange = (event) => {
    setFormData({ ...formData, country: event.target.value });
    setSelectedCountry(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({
      ...formData,
      country: event.target.value,
      state: "",
      city: "",
    });
  };

  const handleStateChange = (event) => {
    setFormData({ ...formData, state: event.target.value });
    setSelectedState(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({ ...formData, state: event.target.value, city: "" });
  };

  useEffect(() => {
    if (!creating && employee) {
      setFormData({
        name: employee.name || "",
        phone: employee.phone || "",
        email: employee.email || "",
        fax: employee.fax || "",
        streetNumber: employee.streetNumber || "",
        city: employee.city || "",
        state: employee.state || "",
        country: employee.country || "",
        zipCode: employee.zipCode || "",
        referentNumber: employee.referentNumber || "",
        numIdentification: employee.numIdentification || "",
        typeIdentificacion: employee.typeIdentificacion || "CC",
      });
    }
  }, [creating, employee]);

  useEffect(() => {
    const fetchData = async () => {
      const countriesData = await CountriesService.fetchCountries();
      setCountries(countriesData.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchData = async () => {
        const statesData = await CountriesService.fetchStates(selectedCountry);
        setStates(statesData.data);
      };
      fetchData();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const fetchData = async () => {
        const citiesData = await CountriesService.fetchCities(
          selectedCountry,
          selectedState
        );
        setCities(citiesData.data);
      };
      fetchData();
    }
  }, [selectedCountry, selectedState]);

  const sendData = async () => {
    let rawData = {
      name: formData.name,
      phone: parseInt(formData.phone),
      email: formData.email,
      fax: parseInt(formData.fax),
      streetNumber: formData.streetNumber,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: parseInt(formData.zipCode),
      numIdentification: parseInt(formData.numIdentification),
      typeIdentificacion: formData.typeIdentificacion,
    };

    const response = await (creating
      ? EmployeeService.createEmployee(rawData)
      : EmployeeService.updateEmployee(employee.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Employee successfully created/updated:", response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onEmployeeDataChange();
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
            href="#general"
            aria-selected={activeTab === "general"}
            onClick={() => setActiveTab("general")}
            role="tab"
          >
            General
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#address"
            aria-selected={activeTab === "address"}
            onClick={() => setActiveTab("address")}
            tabIndex="-1"
            role="tab"
          >
            Address
          </a>
        </li>
      </ul>
      <form
        className={`tab-pane fade ${
            activeTab === "general" ? "show active" : ""
          } company-form__general-form`}
        id="general"
        style={{ display: activeTab === "general" ? "block" : "none" }}
      >
        <div className="company-form__section">
        <Input
            type="text"
            inputName="name"
            placeholder="Name"
            value={formData.name}
            changeHandler={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            label="Name"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="number"
            inputName="phone"
            placeholder="Phone"
            value={formData.phone}
            changeHandler={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            label="Phone"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="fax"
            placeholder="Fax"
            value={formData.fax}
            changeHandler={(e) =>
              setFormData({ ...formData, fax: e.target.value })
            }
            label="Fax"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="email"
            placeholder="Email"
            value={formData.email}
            changeHandler={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            label="Email"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="identification"
            placeholder="Identification"
            value={formData.numIdentification}
            changeHandler={(e) =>
              setFormData({ ...formData, numIdentification: e.target.value })
            }
            label="Identification"
          />
        </div>
        <select
            name="contact-type-id"
            id="identificacionNumber"
            onChange={(e) =>
              setFormData({ ...formData, typeIdentificacion: e.target.value })
            }
          >
            {formData.typeIdentificacion && (
              <option
                key={formData.typeIdentificacion}
                value={formData.typeIdentificacion}
              >
                {formData.typeIdentificacion}
              </option>
            )}
            {idTypes.map((idType) => {
              if (formData.typeIdentificacion && idType === formData.typeIdentificacion) {
                return null;
              }
              return (
                <option key={idType} value={idType} data-key={idType}>
                  {idType}
                </option>
              );
            })}
          </select>
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
          <label htmlFor="country" className="form-label">
            Country:
          </label>
          <select
            name="country"
            id="country"
            className="form-input"
            value={formData.country}
            onChange={(e) => handleCountryChange(e)}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
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
          <label htmlFor="state" className="form-label">
            State:
          </label>
          <select
            name="state"
            id="state"
            className="form-input"
            value={formData.state}
            onChange={(e) => handleStateChange(e)}
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.iso2} value={state.name} data-key={state.iso2}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="company-form__section">
          <label htmlFor="city" className="form-label">
            City:
          </label>
          <select
            name="city"
            id="carrier-info-city"
            className="form-input"  
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
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
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
          <AlertTitle>Success</AlertTitle>
          <strong>
            Employee {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Employee. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

EmployeeCreationForm.propTypes = {
  employee: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onEmployeeDataChange: propTypes.func,
};

EmployeeCreationForm.defaultProps = {
  employee: {},
  closeModal: null,
  creating: false,
  onEmployeeDataChange: null,
};

export default EmployeeCreationForm;
