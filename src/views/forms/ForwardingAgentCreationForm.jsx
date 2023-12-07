import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import ForwardingAgentService from "../../services/ForwardingAgentService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
const ForwardingAgentsCreationForm = ({
  forwardingAgent,
  closeModal,
  creating,
  onForwardingAgentDataChange,
}) => {
  
  const [activeTab, setActiveTab] = useState("general");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
    numIdentification: "",
    typeIdentificacion: "",
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

  const idTypes = ["CC", "CE", "NIT"];

  const handleStateChange = (event) => {
    setFormData({ ...formData, state: event.target.value });
    setSelectedState(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({ ...formData, state: event.target.value, city: "" });
  };

  useEffect(() => {
    if (!creating && forwardingAgent) {
      setFormData({
        name: forwardingAgent.name || "",
        phone: forwardingAgent.phone || "",
        mobilePhone: forwardingAgent.mobilePhone || "",
        email: forwardingAgent.email || "",
        fax: forwardingAgent.fax || "",
        webSide: forwardingAgent.webSide || "",
        firstNameContac: forwardingAgent.firstNameContac || "",
        lasNameContac: forwardingAgent.lasNameContac || "",
        numIdentification: forwardingAgent.numIdentification || "",
        typeIdentificacion: forwardingAgent.typeIdentificacion || "",
        streetNumber: forwardingAgent.streetNumber || "",
        city: forwardingAgent.city || "",
        state: forwardingAgent.state || "",
        country: forwardingAgent.country || "",
        zipCode: forwardingAgent.zipCode || "",
        referentNumber: forwardingAgent.referentNumber || "",
      });
    }
  }, [creating, forwardingAgent]);

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
    console.log("DATA:",formData);
    let rawData = {
      name: formData.name,
      phone: parseInt(formData.phone),
      movelPhone: parseInt(formData.mobilePhone),
      email: formData.email,
      fax: parseInt(formData.fax),
      webSide: formData.webSide,
      referentNumber: parseInt(formData.referentNumber),
      firstNameContac: formData.firstNameContac,
      lasNameContac: formData.lasNameContac,
      numIdentification: formData.numIdentification,
      typeIdentificacion: formData.typeIdentificacion || "CC",
      streetNumber: formData.streetNumber,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: parseInt(formData.zipCode),
    };

    const response = await (creating
        ? ForwardingAgentService.createForwardingAgent(rawData)
        : ForwardingAgentService.updateForwardingAgent(forwardingAgent.id, rawData));
  
      if (response.status >= 200 && response.status <= 300) {
        console.log("Forwarding Agent successfully created/updated:", response.data);
        setShowSuccessAlert(true);
        setTimeout(() => {
          closeModal();
          onForwardingAgentDataChange();
          setShowSuccessAlert(false);
          window.location.reload();
        }, 2000);
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
      <div className="containerr">
        <div className="cont-one">
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
              type="text"
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
              inputName="contactLN"
              placeholder="contactLN"
              value={formData.lasNameContac}
              changeHandler={(e) =>
                setFormData({ ...formData, lasNameContac: e.target.value })
              }
              label="Contact Last Name"
            />
          </div>
        </div>{/* ----------------------------END ONE---------------------------------- */}
        <div className="cont-two">
          <div className="company-form__section">
            <Input
              type="text"
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
              type="text"
              inputName="website"
              placeholder="website"
              value={formData.webSide}
              changeHandler={(e) =>
                setFormData({ ...formData, webSide: e.target.value })
              }
              label="Website"
            />
          </div>
          <div className="company-form__section">
            <Input
              type="text"
              inputName="contactFN"
              placeholder="contactFN"
              value={formData.firstNameContac}
              changeHandler={(e) =>
                setFormData({ ...formData, firstNameContac: e.target.value })
              }
              label="Contact First Name"
            />
          </div>
          <div className="company-form__section">
            <Input
              type="text"
              inputName="idNumber"
              placeholder="idNumber"
              value={formData.numIdentification}
              changeHandler={(e) =>
                setFormData({ ...formData, numIdentification: e.target.value })
              }
              label="Identification Number"
            />
          </div>
          <p className="textId">Tipo de documento</p>
          <select
            name="identificacionNumber"
            id="identificacionNumber"
            className="form-input"
            >
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="NIT">NIT</option>
          </select>
        </div>{/* ----------------------------END TWO---------------------------------- */}
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
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
          <AlertTitle>Success</AlertTitle>
          <strong>
            Forwarding Agent {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Forwarding Agent. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

ForwardingAgentsCreationForm.propTypes = {
  forwardingAgent: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onForwardingAgentDataChange: propTypes.func,
};

ForwardingAgentsCreationForm.defaultProps = {
  forwardingAgent: {},
  closeModal: null,
  creating: false,
  onForwardingAgentDataChange: null,
};

export default ForwardingAgentsCreationForm;
