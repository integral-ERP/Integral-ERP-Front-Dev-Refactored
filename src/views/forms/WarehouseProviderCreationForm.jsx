import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import WarehouseProviderService from "../../services/WarehouseProviderService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
const WarehouseProviderCreationForm = ({
  warehouseProvider,
  closeModal,
  creating,
  onWarehouseProviderDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("general");
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
    mobilePhone: "",
    email: "",
    fax: "",
    webSide: "",
    referentNumber: "",
    firstNameContac: "",
    lasNameContac: "",
    streetNumber: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
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
    if (!creating && warehouseProvider) {
      setFormData({
        name: warehouseProvider.name || "",
        phone: warehouseProvider.phone || "",
        mobilePhone: warehouseProvider.mobilePhone || "",
        email: warehouseProvider.email || "",
        fax: warehouseProvider.fax || "",
        webSide: warehouseProvider.webSide || "",
        firstNameContac: warehouseProvider.firstNameContac || "",
        lasNameContac: warehouseProvider.lasNameContac || "",
        streetNumber: warehouseProvider.streetNumber || "",
        city: warehouseProvider.city || "",
        state: warehouseProvider.state || "",
        country: warehouseProvider.country || "",
        zipCode: warehouseProvider.zipCode || "",
        referentNumber: warehouseProvider.referentNumber || "",
      });
    }
  }, [creating, warehouseProvider]);

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
          const citiesData = await CountriesService.fetchCities(selectedCountry, selectedState);
          setCities(citiesData.data);
        };
        fetchData();
      }
  }, [selectedCountry, selectedState]);

  const sendData = async () => {
    let rawData = {
      name: formData.name,
      phone: parseInt(formData.phone),
      mobilePhone: parseInt(formData.mobilePhone),
      email: formData.email,
      fax: parseInt(formData.fax),
      webSide: formData.webSide,
      referentNumber: parseInt(formData.referentNumber),
      firstNameContac: formData.firstNameContac,
      lasNameContac: formData.lasNameContac,
      streetNumber: formData.streetNumber,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: parseInt(formData.zipCode),
    };

    const response = await (creating
        ? WarehouseProviderService.createWarehouseProvider(rawData)
        : WarehouseProviderService.updateWarehouseProvider(warehouseProvider.id, rawData));
  
      if (response.status >= 200 && response.status <= 300) {
        console.log("Warehouse Provider successfully created/updated:", response.data);
        setShowSuccessAlert(true);
        setTimeout(() => {
          closeModal();
          onWarehouseProviderDataChange();
          setShowSuccessAlert(false);
          warehouseProvider = null;
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
            type="number"
            inputName="mphone"
            placeholder="Mobile Phone"
            value={formData.mobilePhone}
            changeHandler={(e) =>
              setFormData({ ...formData, mobilePhone: e.target.value })
            }
            label="Mobile Phone"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="number"
            inputName="fax"
            placeholder="fax"
            value={formData.fax}
            changeHandler={(e) =>
              setFormData({ ...formData, fax: e.target.value })
            }
            label="Fax"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="email"
            inputName="email"
            placeholder="email"
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
            inputName="website"
            placeholder="website"
            value={formData.website}
            changeHandler={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            label="Website"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="rnumber"
            placeholder="rnumber"
            value={formData.referentNumber}
            changeHandler={(e) =>
              setFormData({ ...formData, referentNumber: e.target.value })
            }
            label="Reference Number"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="contactFN"
            placeholder="contactFN"
            value={formData.contactFirstName}
            changeHandler={(e) =>
              setFormData({ ...formData, contactFirstName: e.target.value })
            }
            label="Contact First Name"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="contactLN"
            placeholder="contactLN"
            value={formData.contactLastName}
            changeHandler={(e) =>
              setFormData({ ...formData, contactLastName: e.target.value })
            }
            label="Contact Last Name"
          />
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
                  <option key={country.iso2} value={country.name} data-key={country.iso2}>
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
          <label htmlFor="wp-state" className="company-form__label">
            State:
          </label>
          <select
            name="wp-state"
            id="wp-state"
            className="company-form__input"
            value={formData.state}
            onChange={(e) => handleStateChange(e)}
          >
            <option value="">Select a state</option>
            {formData.state &&
              states
                .filter((state) => state.name === formData.state)
                .map((state) => (
                  <option key={state.iso2} value={state.name} data-key={state.iso2}>
                    {state.name}
                  </option>
                ))}
            {!formData.state &&
              states.map((state) => (
                <option
                  key={state.iso2}
                  value={state.name}
                  data-key={state.iso2}
                >
                  {state.name}
                </option>
              ))}
          </select>
        </div>
        <div className="company-form__section">
          <label htmlFor="wp-city" className="company-form__label">
            City:
          </label>
          <select
            name="wp-city"
            id="wp-city"
            className="company-form__input"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          >
            <option value="">Select a city</option>
            {formData.city &&
              cities
                .filter((city) => city.name === formData.city)
                .map((city) => (
                  <option key={city.iso2} value={city.name} data-key={city.iso2}>
                    {city.name}
                  </option>
                ))}
            {!formData.city &&
              cities.map((city) => (
                <option
                  key={city.iso2}
                  value={city.name}
                  data-key={city.iso2}
                >
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
        <button className="company-form__option btn btn-primary" onClick={sendData}>
          Save
        </button>
        <button className="company-form__option btn btn-secondary" onClick={closeModal}>
          Cancel
        </button>
      </div>
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
          <AlertTitle>Success</AlertTitle>
          <strong>
            Warehouse Provider {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Warehouse Provider. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

WarehouseProviderCreationForm.propTypes = {
  warehouseProvider: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onWarehouseProviderDataChange: propTypes.func,
}

WarehouseProviderCreationForm.defaultProps = {
  warehouseProvider: {},
  closeModal: null,
  creating: false,
  onWarehouseProviderDataChange: null,
}

export default WarehouseProviderCreationForm;
