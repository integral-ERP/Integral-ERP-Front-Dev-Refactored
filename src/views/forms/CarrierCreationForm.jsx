import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import CarrierService from "../../services/CarrierService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";

const CarrierCreationForm = ({
  carrier,
  closeModal,
  creating,
  onCarrierDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [carrierType, setcarrierType] = useState("Land");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const formFormat ={
    name: "",
    phone: "",
    mobilePhone: "",
    email: "",
    fax: "",
    website: "",
    entityId: "",
    contactFirstName: "",
    contactLastName: "",
    streetNumber: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    carrierType: "Land",
    methodCode: "Land",
    carrierCode: "",
    idNumber: "",
    typeIdentificacion: "",
    // FIELDS FOR AIRLINE
    iataCode: "",
    airlineCode: "",
    airlinePrefix: "",
    airwayBillNumbers: "",
    passengersOnlyAirline: false,
    // FIELDS FOR LAND
    scacNumber: "",
    // FIELDS FOR OCEAN
    fmcNumber: "",
  };
  const [formData, setFormData] = useState(formFormat);

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
    if (!creating && carrier) {
      console.log("Editing carrier...", carrier);
      let updatedFormData = {
        name: carrier.name || "",
        phone: carrier.phone || "",
        mobilePhone: carrier.movelPhone || "",
        email: carrier.email || "",
        fax: carrier.fax || "",
        website: carrier.webSide || "",
        entityId: carrier.referentNumber || "",
        contactFirstName: carrier.firstNameContac || "",
        contactLastName: carrier.lasNameContac || "",
        streetNumber: carrier.streetNumber || "",
        city: carrier.city || "",
        state: carrier.state || "",
        country: carrier.country || "",
        zipCode: carrier.zipCode || "",
        carrierType: carrier.carrierType || "",
        methodCode: carrier.methodCode || "",
        carrierCode: carrier.carrierCode || "",
        idNumber: carrier.numIdentification || "",
        typeIdentificacion: carrier.typeIdentificacion || "",
      }; // Create a copy of the existing formData

      if (carrier.carrierType === "Land") {
        updatedFormData.scacNumber = carrier.scacNumber;
      }
      if (carrier.carrierType === "Air") {
        updatedFormData.iataCode = carrier.iataCode;
        updatedFormData.airlineCode = carrier.airlineCode;
        updatedFormData.airlinePrefix = carrier.airlinePrefix;
        updatedFormData.airwayBillNumbers = carrier.airwayBillNumbers;
        updatedFormData.passengersOnlyAirline = carrier.passengersOnlyAirline;
      }
      if (carrier.carrierType === "Ocean") {
        updatedFormData.scacNumber = carrier.scacNumber;
        updatedFormData.fmcNumber = carrier.fmcNumber;
      }
      for (let property in updatedFormData) {
        if (updatedFormData[property] === null) {
          updatedFormData[property] = "";
        }
      }
      setFormData(updatedFormData); // Update formData once with all the changes
    }
    console.log("Form data:", formData);
  }, [creating, carrier]);

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
      movelPhone: parseInt(formData.mobilePhone),
      email: formData.email,
      fax: parseInt(formData.fax),
      webSide: formData.website,
      referentNumber: parseInt(formData.entityId),
      firstNameContac: formData.contactFirstName,
      lasNameContac: formData.contactLastName,
      numIdentification: parseInt(formData.idNumber),
      typeIdentificacion: formData.typeIdentificacion,
      sistenID: "",
      streetNumber: formData.streetNumber,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: parseInt(formData.zipCode),
      parentAccount: "",
      carrierType: formData.carrierType,
      methodCode: formData.carrierType,
      carrierCode: formData.carrierCode,
      scacNumber: formData.scacNumber,
      iataCode: formData.iataCode,
      airlineCode: formData.airlineCode,
      airlinePrefix: formData.airlinePrefix,
      airwayBillNumbers: formData.airwayBillNumbers,
      passengersOnlyAirline: formData.passengersOnlyAirline,
    };

    const response = await (creating
      ? CarrierService.createCarrier(rawData)
      : CarrierService.updateCarrier(carrier.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Carrier successfully created/updated:", response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onCarrierDataChange();
        setShowSuccessAlert(false);
        setFormData(formFormat)
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  const handleTypeChange = (e) => {
    const selectedCarrierType = e.target.value;
    setcarrierType(selectedCarrierType);
    setFormData({
      ...formData,
      carrierType: selectedCarrierType,
      methodCode: selectedCarrierType,
    });
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
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#land"
            aria-selected={activeTab === "land"}
            onClick={() => setActiveTab("land")}
            tabIndex="-1"
            role="tab"
          >
            Land
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#airline"
            aria-selected={activeTab === "airline"}
            onClick={() => setActiveTab("airline")}
            tabIndex="-1"
            role="tab"
          >
            Airline
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#ocean"
            aria-selected={activeTab === "ocean"}
            onClick={() => setActiveTab("ocean")}
            tabIndex="-1"
            role="tab"
          >
            Ocean
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
          <label htmlFor="carrierType" className="company-form__label">
            Carrier Type:
          </label>
          <select
            id="carrierType"
            className="form-input"
            value={formData.carrierType}
            onChange={(e) => handleTypeChange(e)}
          >
            <option value="Land">Land</option>
            <option value="Air">Air</option>
            <option value="Ocean">Ocean</option>
          </select>
        </div>
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
            inputName="ccode"
            placeholder="Carrier Code"
            value={formData.carrierCode}
            changeHandler={(e) =>
              setFormData({ ...formData, carrierCode: e.target.value })
            }
            label="Carrier Code"
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
        <div className="company-form__section">
          <Input
            type="text"
            inputName="idNumber"
            placeholder="idNumber"
            value={formData.idNumber}
            changeHandler={(e) =>
              setFormData({ ...formData, idNumber: e.target.value })
            }
            label="Identification Number"
          />
          <select
            name="identificacionNumber"
            id="identificacionNumber"
            className="form-input"
          >
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="NIT">NIT</option>
          </select>
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
      <form
       className={`tab-pane fade ${
        activeTab === "airline" ? "show active" : ""
      } company-form__general-form`}
      id="airline"
      style={{ display: activeTab === "airline" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <Input
            type="text"
            inputName="iata"
            placeholder="IATA code..."
            value={formData.iataCode}
            changeHandler={(e) =>
              setFormData({ ...formData, iataCode: e.target.value })
            }
            label="IATA account number"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="airlinecode"
            placeholder="Airline code..."
            value={formData.airlineCode}
            changeHandler={(e) =>
              setFormData({ ...formData, airlineCode: e.target.value })
            }
            label="Airline Code"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="airlineprefix"
            placeholder="Airline Prefix..."
            value={formData.airlinePrefix}
            changeHandler={(e) =>
              setFormData({ ...formData, airlinePrefix: e.target.value })
            }
            label="Airline Prefix"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="textarea"
            inputName="airlinebillnumbers"
            placeholder="Airline Bill Numbers..."
            value={formData.airwayBillNumbers}
            changeHandler={(e) =>
              setFormData({ ...formData, airwayBillNumbers: e.target.value })
            }
            label="IATA account number"
          />
        </div>
        <hr />
        <div className="company-form__section">
        <Input
            type="checkbox"
            inputName="passengerOnly"
            value={formData.passengersOnlyAirline}
            changeHandler={(e) =>
              setFormData({ ...formData, passengersOnlyAirline: e.target.value.checked })
            }
            label="This is a passengers only airline"
          />
        </div>
      </form>
      <form className={`tab-pane fade ${
          activeTab === "land" ? "show active" : ""
        } company-form__general-form`}
        id="land"
        style={{ display: activeTab === "land" ? "block" : "none" }}>
        <div className="company-form__section">
          <Input
            type="text"
            inputName="scacNumber"
            value={formData.scacNumber}
            changeHandler={(e) =>
              setFormData({ ...formData, scacNumber: e.target.value.checked })
            }
            label="SCAC Number"
          />
        </div>
      </form>
      <form className={`tab-pane fade ${
          activeTab === "ocean" ? "show active" : ""
        } company-form__general-form`}
        id="ocean"
        style={{ display: activeTab === "ocean" ? "block" : "none" }}>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="fmcnumber"
            placeholder="FMC Number..."
            value={formData.fmcNumber}
            changeHandler={(e) =>
              setFormData({ ...formData, fmcNumber: e.target.value })
            }
            label="FMC number"
          />
        </div>
        <div className="company-form__section">
        <Input
            type="text"
            inputName="scacnumber"
            placeholder="SCAC Number..."
            value={formData.scacNumber}
            changeHandler={(e) =>
              setFormData({ ...formData, scacNumber: e.target.value })
            }
            label="SCAC number"
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
            Carrier {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Carrier. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

CarrierCreationForm.propTypes = {
  carrier: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onCarrierDataChange: propTypes.func,
};

CarrierCreationForm.defaultProps = {
  carrier: {},
  closeModal: null,
  creating: false,
  onCarrierDataChange: null,
};

export default CarrierCreationForm;
