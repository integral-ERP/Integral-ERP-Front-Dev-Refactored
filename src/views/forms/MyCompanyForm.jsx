import "../../styles/components/MyCompanyForm.css";
import CountriesService from "../../services/CountriesService";
import CompanyService from "../../services/CompanyService";
import CurrenciesService from "../../services/CurrencyService";
import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
const MyCompanyForm = (props) => {

  const [companyType, setCompanyType] = useState({
    logisticsProvi: false,
    distribution: false,
    airlineCarrier: false,
    oceanCarrier: false,
    companyWarehouse: false,
  });

  const [importSchedule, setimportSchedule] = useState({
    schedulesB: false,
    schedulesD: false,
    schedulesK: false,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [rawFileLogo, setrawFileLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [currencies, setcurrencies] = useState({});
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setselectedCountryCode] = useState("");
  const [selectedStateCode, setselectedStateCode] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedFile, setselectedFile] = useState(null);
  // State variables with 'Retrieved' at the end of their names
  const [systemCurrencyRetrieved, setSystemCurrencyRetrieved] = useState(null);
  const [companyExists, setcompanyExists] = useState(false);
  const [companyID, setcompanyID] = useState("");
  const [requestsError, setrequestsError] = useState(false);

  // COMPANY TYPE VARIABLES
  const [logisticsProvi, setlogisticsProvi] = useState(false);
  const [distribution, setdistribution] = useState(false);
  const [airlineCarrier, setairlineCarrier] = useState(false);
  const [oceanCarrier, setoceanCarrier] = useState(false);
  const [companyWarehouse, setcompanyWarehouse] = useState(false);

  // GENERAL FORM VARIABLES
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");

  // ADDRESS FORM VARIABLES
  const [streetNumber, setStreetNumber] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // REGISTRATION CODES
  const [iataCode, setIataCode] = useState("");
  const [fmc, setFmc] = useState("");
  const [customsCode, setCustomsCode] = useState("");
  const [tsaNumber, setTsaNumber] = useState("");

  // CURRENCY
  const [selectedCurrency, setSelectedCurrency] = useState("");

  // IMPORT SCHEDULE
  const [schedulesB, setschedulesB] = useState(false);
  const [schedulesD, setschedulesD] = useState(false);
  const [schedulesK, setschedulesK] = useState(false);

  const handleCountryChange = (event) => {
    const selectedCountryValue = event.target.value;
    setSelectedCountry(selectedCountryValue);

    // Retrieve the country code and set it in the state
    const selectedCountryCode =
      event.target.options[event.target.selectedIndex].getAttribute("data-key");
    setselectedCountryCode(selectedCountryCode);
  };

  const handleStateChange = (event) => {
    const selectedStateValue = event.target.value;
    setSelectedState(selectedStateValue);

    // Retrieve the state code and set it in the state
    const selectedStateCode =
      event.target.options[event.target.selectedIndex].getAttribute("data-key");
    setselectedStateCode(selectedStateCode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setselectedFile(URL.createObjectURL(file));
    console.log("selected file:", selectedFile);
    setSelectedFileName(file.name);
    setrawFileLogo(file);
  };

  const handleRadioChange = (option) => {
    const updatedCompanyType = {
      logisticsProvi: false,
      distribution: false,
      airlineCarrier: false,
      oceanCarrier: false,
      companyWarehouse: false,
    };
    updatedCompanyType[option] = true;
    switch (option) {
      case "logisticsProvi":
        setlogisticsProvi(true);
        setdistribution(false);
        setairlineCarrier(false);
        setoceanCarrier(false);

        break;
      case "distribution":
        setlogisticsProvi(false);
        setdistribution(true);
        setairlineCarrier(false);
        setoceanCarrier(false);

        break;
      case "airlineCarrier":
        setlogisticsProvi(false);
        setdistribution(false);
        setairlineCarrier(true);
        setoceanCarrier(false);

        break;
      case "oceanCarrier":
        setlogisticsProvi(false);
        setdistribution(false);
        setairlineCarrier(false);
        setoceanCarrier(true);

        break;
      default:
        // If companyWarehouse is selected or none of the above, set it to true and others to false
        setlogisticsProvi(false);
        setdistribution(false);
        setairlineCarrier(false);
        setoceanCarrier(false);
    }
    setCompanyType(updatedCompanyType);
  };

  const handleScheduleSelection = (option) => {
    const updatedSchedule = { ...importSchedule };
    updatedSchedule[option] = true;
    setimportSchedule(updatedSchedule);
    switch (option) {
      case "schedulesB":
        setschedulesB(!schedulesB);
        break;
      case "schedulesD":
        setschedulesD(!schedulesD);
        break;
      case "schedulesK":
        setschedulesK(!schedulesK);
        break;
      default:
        setschedulesB(false);
        setschedulesD(false);
        setschedulesK(false);
    }
  };

  const warehouseSelected = (event) => {
    const updatedCompanyType = { ...companyType };
    updatedCompanyType.companyWarehouse = event.target.checked;
    setcompanyWarehouse(event.target.checked);
    setCompanyType(updatedCompanyType);
  };

  const handleNextButtonClick = () => {
    if (activeTab < 6) {
      setActiveTab(activeTab + 1);
    } else {
      sendInformation();
    }
  };

  const handleBrowseButtonClick = () => {
    document.getElementById("imageFile").click();
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      console.log(file);
      if (!file) {
        resolve(null); // Resolve with null when the file is empty or null
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (reader.readyState === FileReader.DONE) {
            resolve(reader.result);
          } else {
            reject("FileReader failed to read the file.");
          }
        };
        reader.onerror = reject;
      }
    });

  // Function to convert an image URL to base64
  async function imageUrlToBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      // Convert the Blob to a base64 data URL
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
      return base64String;
    } catch (error) {
      console.error("Error fetching or converting the image:", error);
      return null;
    }
  }
  useEffect(() => {
    console.log(selectedStateCode, selectedState);
    if (states) {
      setselectedStateCode(selectedStateCode);
    }
  }, [selectedStateCode, states, selectedState]);

  useEffect(() => {
    // ... (existing code)

    // Clear the message after 3 seconds
    if (message) {
      const timerId = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [message]);

  useEffect(() => {
    CurrenciesService.getCurrencies()
      .then((response) => {
        setcurrencies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  // useEffect to fetch the data from backend for each request
  useEffect(() => {
    CompanyService.getCompanyType()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setcompanyWarehouse(data.companyWarehouse);
          setlogisticsProvi(data.logisticsProvi);
          setoceanCarrier(data.oceanCarrier);
          setairlineCarrier(data.airlineCarrier);
          setdistribution(data.distribution);
          setCompanyType(data);
        }
      })
      .catch((error) => {
        console.log("Error fetching company type data:", error);
      });

    CompanyService.getCompanyInfo()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setName(data.nameCompany || "");
          setPhone(data.phone || "");
          setFax(data.fax || "");
          setEmail(data.email || "");
          setWebsite(data.webSide || "");
          setContactFirstName(data.firstNameContac || "");
          setContactLastName(data.lasNameContac || "");
        }
      })
      .catch((error) => {
        console.log("Error fetching company info data:", error);
      });

    CompanyService.getAddress()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setStreetNumber(data.streetNumber);
          setCity(data.city);
          setSelectedCountry(data.country);
          setSelectedState(data.state);
          setZipCode(data.zipCode);
        }
      })
      .catch((error) => {
        console.log("Error fetching address info data:", error);
      });

    CompanyService.getCompanyLogo()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setselectedFile(data.imgLogo);
          setSelectedFileName(data.imgName);
        }
      })
      .catch((error) => {
        console.log("Error fetching company logo data:", error);
      });

    CompanyService.getCompanyRegistrationCodes()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setIataCode(data.iataCode);
          setFmc(data.fmc);
          setCustomsCode(data.scacCodeUs);
          setTsaNumber(data.tsaNumber);
        }
      })
      .catch((error) => {
        console.log("Error fetching company registration code data:", error);
      });

    CompanyService.getCompanySystemCurrency()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setSelectedCurrency(data.localCurrency);
          setSystemCurrencyRetrieved(data);
        }
      })
      .catch((error) => {
        console.log("Error fetching system currency data:", error);
      });

    CompanyService.getCompanyImportSchedule()
      .then((response) => {
        const data = response.data.length > 0 ? response.data.pop() : null;
        if (data) {
          setcompanyExists(true);
          setcompanyID(data.id);
          setschedulesB(data.schedulesB);
          setschedulesD(data.schedulesD);
          setschedulesK(data.schedulesK);
          setimportSchedule(data);
        }
      })
      .catch((error) => {
        console.log("Error fetching import schedule data:", error);
      });
  }, []);

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
        const statesData = await CountriesService.fetchStates(selectedCountryCode);
        setStates(statesData.data);
      };
      fetchData();
    }
  }, [selectedCountry, selectedCountryCode]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const fetchData = async () => {
        const citiesData = await CountriesService.fetchCities(
          selectedCountryCode,
          selectedStateCode
        );
        setCities(citiesData.data);
      };
      fetchData();
    }
  }, [selectedCountry, selectedState, selectedCountryCode, selectedStateCode]);

  useEffect(() => {
    if (requestsError) {
      CompanyService.deleteCompanyType()
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      CompanyService.deleteCompanyInfo()
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      CompanyService.deleteCompanyLogo()
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      CompanyService.deleteCompanyRegistrationCodes()
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      CompanyService.deleteCompanySystemCurrency()
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      CompanyService.deleteCompanyImportSchedule()
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  }, [requestsError]);

  const sendInformation = async () => {
    const newCompanyInfo = {
      nameCompany: name || document.getElementById("company-info_name").value,
      phone:
        parseInt(phone) || document.getElementById("company-info_phone").value,
      fax: parseInt(fax) || document.getElementById("company-info_fax").value,
      email: email || document.getElementById("company-info_email").value,
      webSide: website || document.getElementById("company-info_website").value,
      firstNameContac:
        contactFirstName ||
        document.getElementById("company-info_contactFirstName").value,
      lasNameContac:
        contactLastName ||
        document.getElementById("company-info_contactLastName").value,
    };

    const newAddressInfo = {
      streetNumber:
        streetNumber ||
        document.getElementById("address-info_street&number").value,
      city: city || document.getElementById("address-info_city").value,
      country:
        selectedCountry ||
        document.getElementById("address-info_country").value,
      state:
        selectedState || document.getElementById("address-info_state").value,
      zipCode:
        parseInt(zipCode) ||
        document.getElementById("address-info_zipCode").value,
    };

    let newCompanyLogo = {};

    newCompanyLogo = {
      imgName: selectedFileName !== "" ? selectedFileName : "",
      imgLogo: selectedFile
        ? await imageUrlToBase64(selectedFile)
        : (await toBase64(rawFileLogo)) || null,
    };

    const newCompanyRegisCode = {
      iataCode:
        iataCode || document.getElementById("company-regis_iataCode").value,
      fmc: fmc || document.getElementById("company-regis_fmc").value,
      scacCodeUs:
        customsCode ||
        document.getElementById("company-regis_customsCode").value,
      tsaNumber:
        tsaNumber || document.getElementById("company-regis_tsaNumber").value,
    };

    const newSystemCurrency = {
      localCurrency:
        selectedCurrency || document.getElementById("syst-curr_currency").value,
      companyMoreCurren: false,
    };

    const response = companyExists
      ? CompanyService.massUpdate(
          companyID,
          companyType,
          newCompanyInfo,
          newAddressInfo,
          newCompanyLogo,
          newCompanyRegisCode,
          newSystemCurrency,
          importSchedule
        )
      : CompanyService.massCreate(
          companyID,
          companyType,
          newCompanyInfo,
          newAddressInfo,
          newCompanyLogo,
          newCompanyRegisCode,
          newSystemCurrency,
          importSchedule
        );
    
        if(response.status === 1){
            // All requests were successful, no need to proceed with delete requests
          setMessage("Datos almacenados correctamente!");
          setcompanyExists(true);
          console.log("All requests completed successfully!");
          setcompanyExists(true);
          setcompanyID(1);
        }else {
            console.log("Hubo un error al crear los datos...", response.error);
          if (!companyExists) {
            setrequestsError(true);
          }
        }
  };

  {
    /*


          <button
            type="button"
            className="startup-wizard-form__button"
            onClick={handleAddCurrency}
          >
            Add Currency
          </button>
<div className="startup-wizard-form__section">
          Selected Currencies:
          <ul>
            {selectedCurrencies.map((currencyCode) => (
              <li key={currencyCode}>{currencyCode}</li>
            ))}
          </ul>
        </div>*/
  }

  return (
    <div className="startup-wizard-form">
      <div className="startup-wizard-form__tabs-button-container">
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "company type" ? "active" : "unactive"
          }`}
          onClick={() => setActiveTab(0)}
          disabled={activeTab === 0 ? true : false}
        >
          Company Type
        </button>
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "company info" ? "active" : ""
          }`}
          onClick={() => setActiveTab(1)}
        >
          Company Info
        </button>
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "address info" ? "active" : ""
          }`}
          onClick={() => setActiveTab(2)}
        >
          Address Info
        </button>
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "company logo" ? "active" : ""
          }`}
          onClick={() => setActiveTab(3)}
        >
          Company Logo
        </button>
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "company registration codes" ? "active" : ""
          }`}
          onClick={() => setActiveTab(4)}
        >
          Company Registration Codes
        </button>
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "system currencies" ? "active" : ""
          }`}
          onClick={() => setActiveTab(5)}
        >
          System Currencies
        </button>
        <button
          className={`startup-wizard-form__tabs-button ${
            activeTab === "schedules" ? "active" : ""
          }`}
          onClick={() => setActiveTab(6)}
        >
          Import schedules B-D-K
        </button>
      </div>
      <form
        className={`startup-wizard-form__general-form ${
          activeTab == 0 ? "active" : "hidden"
        }`}
      >
        {/* ... */}
        <fieldset className="startup-wizard-form__fieldset">
          <div className="startup-wizard-form__section">
            <label>
              <input
                type="radio"
                name="companyType"
                value="logisticsProvi"
                onChange={() => handleRadioChange("logisticsProvi")}
                checked={logisticsProvi}
                className="startup-wizard-form__input-checkbox"
              />
              Logistics Provider (Freight forwarder, NVOCC, Courier, Ground
              Carrier, Warehouse Provider)
            </label>
          </div>
          <div className="startup-wizard-form__section">
            <label>
              <input
                type="radio"
                name="companyType"
                value="distribution"
                onChange={() => handleRadioChange("distribution")}
                checked={distribution}
                className="startup-wizard-form__input-checkbox"
              />
              Distribution / Wholesale company
            </label>
          </div>
          <div className="startup-wizard-form__section">
            <label>
              <input
                type="radio"
                name="companyType"
                value="airlineCarrier"
                onChange={() => handleRadioChange("airlineCarrier")}
                checked={airlineCarrier}
                className="startup-wizard-form__input-checkbox"
              />
              Airline Carrier
            </label>
          </div>
          <div className="startup-wizard-form__section">
            <label>
              <input
                type="radio"
                name="companyType"
                value="oceanCarrier"
                onChange={() => handleRadioChange("oceanCarrier")}
                checked={oceanCarrier}
                className="startup-wizard-form__input-checkbox"
              />
              Ocean Carrier
            </label>
          </div>
        </fieldset>
        <hr />
        <div className="startup-wizard-form__section">
          <label>
            <input
              type="checkbox"
              name="bondedWarehouse"
              className="startup-wizard-form__input-checkbox"
              id="warehouse"
              checked={companyWarehouse}
              onChange={warehouseSelected}
            />
            Yes, this company has a bonded warehouse
          </label>
        </div>
      </form>
      <form
        className={`startup-wizard-form__company-info-form ${
          activeTab === 1 ? "active" : "hidden"
        }`}
      >
        {/* ... */}
        <div className="startup-wizard-form__section">
          <label htmlFor="name" className="startup-wizard-form__label">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="company-info_name"
            className="startup-wizard-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="phone" className="startup-wizard-form__label">
            Phone
          </label>
          <input
            type="number"
            name="company-info_phone"
            id="company-info_phone"
            className="startup-wizard-form__input input-number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="fax" className="startup-wizard-form__label">
            Fax:
          </label>
          <input
            type="number"
            name="company-info_fax"
            id="company-info_fax"
            className="startup-wizard-form__input input-number"
            value={fax}
            onChange={(e) => setFax(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="email" className="startup-wizard-form__label">
            Email:
          </label>
          <input
            type="text"
            name="company-info_email"
            id="company-info_email"
            className="startup-wizard-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="website" className="startup-wizard-form__label">
            Website:
          </label>
          <input
            type="text"
            name="company-info_website"
            id="company-info_website"
            className="startup-wizard-form__input"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="contactFirstName"
            className="startup-wizard-form__label"
          >
            Contact First Name:
          </label>
          <input
            type="text"
            name="company-info_contactFirstName"
            id="company-info_contactFirstName"
            className="startup-wizard-form__input"
            value={contactFirstName}
            onChange={(e) => setContactFirstName(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="contactLastName"
            className="startup-wizard-form__label"
          >
            Contact Last Name:
          </label>
          <input
            type="text"
            name="company-info_contactLastName"
            id="company-info_contactLastName"
            className="startup-wizard-form__input"
            value={contactLastName}
            onChange={(e) => setContactLastName(e.target.value)}
          />
        </div>
      </form>
      <form
        className={`startup-wizard-form__address-form ${
          activeTab === 2 ? "active" : "hidden"
        }`}
      >
        {/* ... */}
        <div className="startup-wizard-form__section">
          <label htmlFor="street&number" className="startup-wizard-form__label">
            Street & Number:
          </label>
          <textarea
            type="text"
            name="address-info_street&number"
            id="address-info_street&number"
            className="startup-wizard-form__input"
            value={streetNumber || ""}
            onChange={(e) => setStreetNumber(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="country" className="startup-wizard-form__label">
            Country:
          </label>
          <select
            name="address-info_country"
            id="address-info_country"
            className="startup-wizard-form__input"
            onChange={(e) => handleCountryChange(e)}
            value={selectedCountry}
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

        <div className="startup-wizard-form__section">
          <label htmlFor="state" className="startup-wizard-form__label">
            State:
          </label>
          <select
            name="address-info_state"
            id="address-info_state"
            className="startup-wizard-form__input"
            onChange={(e) => handleStateChange(e)}
            value={selectedState}
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.iso2} value={state.name} data-key={state.iso2}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="city" className="startup-wizard-form__label">
            City:
          </label>
          <select
            name="city"
            id="address-info_city"
            className="startup-wizard-form__input"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="zipCode" className="startup-wizard-form__label">
            Zip Code:
          </label>
          <input
            type="text"
            name="address-info_zipCode"
            id="address-info_zipCode"
            className="startup-wizard-form__input"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>
      </form>
      <form
        className={`startup-wizard-form__logo-form ${
          activeTab === 3 ? "active" : "hidden"
        }`}
      >
        {/* ... */}
        <div className="startup-wizard-form__section">
          <label htmlFor="imageFile" className="startup-wizard-form__label">
            File Name:
          </label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="startup-wizard-form__file-input startup-wizard-form__file-input"
          />
          <input
            type="text"
            onClick={handleBrowseButtonClick}
            className="startup-wizard-form__input"
            value={selectedFileName || ""}
          />
          <button
            className="startup-wizard-form__browse-button"
            onClick={handleBrowseButtonClick}
            type="button"
          >
            Browse
          </button>
        </div>
        <div className="startup-wizard-form__section img-container">
          <img
            src={selectedFile}
            className="startup-wizard-form__image-preview"
            id="preview"
          />
        </div>
      </form>

      <form
        className={`startup-wizard-form__regis-form ${
          activeTab === 4 ? "active" : "hidden"
        }`}
      >
        {/* ... */}
        <div className="startup-wizard-form__section">
          <label
            htmlFor="mobilePhone"
            className="startup-wizard-form__label large-label"
          >
            IATA Code:
          </label>
          <input
            type="text"
            name="company-regis_iataCode"
            id="company-regis_iataCode"
            className="startup-wizard-form__input input-number"
            value={iataCode}
            onChange={(e) => setIataCode(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="fmc"
            className="startup-wizard-form__label large-label"
          >
            FMC:
          </label>
          <input
            type="text"
            name="company-regis_fmc"
            id="company-regis_fmc"
            className="startup-wizard-form__input input-number"
            value={fmc}
            onChange={(e) => setFmc(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="customsCode"
            className="startup-wizard-form__label large-label"
          >
            SCAC Code or US Customs code:
          </label>
          <input
            type="text"
            name="company-regis_customsCode"
            id="company-regis_customsCode"
            className="startup-wizard-form__input"
            value={customsCode}
            onChange={(e) => setCustomsCode(e.target.value)}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="tsaNumber"
            className="startup-wizard-form__label large-label"
          >
            TSA Number:
          </label>
          <input
            type="text"
            name="company-regis_tsaNumber"
            id="company-regis_tsaNumber"
            className="startup-wizard-form__input"
            value={tsaNumber}
            onChange={(e) => setTsaNumber(e.target.value)}
          />
        </div>
      </form>
      <form
        className={`startup-wizard-form__currency-form ${
          activeTab === 5 ? "active" : "hidden"
        }`}
      >
        <div className="startup-wizard-form__section">
          <h2 className="startup-wizard-form__title">System Currencies</h2>
        </div>
        <hr className="section_separator" />
        <div className="startup-wizard-form__section"></div>
        <div className="startup-wizard-form__section">
          <label htmlFor="mobilePhone" className="startup-wizard-form__label">
            Please, select your local currency
          </label>
        </div>
        <label
          htmlFor="mobilePhone"
          className="startup-wizard-form__label"
          id="left-text"
        >
          Local currency
        </label>

        <div className="startup-wizard-form__section">
          <select
            name="syst-curr_currency"
            id="syst-curr_currency"
            className="startup-wizard-form__input"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {Object.entries(currencies).map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode} - {currencyName}
              </option>
            ))}
          </select>
        </div>
        <div className="startup-wizard-form__section">
          <label className="startup-wizard-form__label" id="left-text">
            Current currency:
          </label>
          <label className="startup-wizard-form__label" id="left-text">
            {systemCurrencyRetrieved?.localCurrency || ""}
          </label>
        </div>
      </form>
      <form
        className={`startup-wizard-form__schedule-form ${
          activeTab === 6 ? "active" : "hidden"
        }`}
      >
        {/* ... */}
        <div className="startup-wizard-form__section">
          <label
            htmlFor="mobilePhone"
            className="startup-wizard-form__label large-label"
          >
            <input
              type="checkbox"
              name="schedulesB"
              id="schedulesB"
              className="startup-wizard-form__input-checkbox"
              onChange={() => handleScheduleSelection("schedulesB")}
              checked={schedulesB}
            />
            Schedules B (Commodity Classification)
          </label>
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="mobilePhone"
            className="startup-wizard-form__label large-label"
          >
            <input
              type="checkbox"
              name="schedulesD"
              id="schedulesD"
              className="startup-wizard-form__input-checkbox"
              onChange={() => handleScheduleSelection("schedulesD")}
              checked={schedulesD}
            />
            Schedules D (United States Ports)
          </label>
        </div>
        <div className="startup-wizard-form__section">
          <label
            htmlFor="mobilePhone"
            className="startup-wizard-form__label large-label"
          >
            <input
              type="checkbox"
              name="schedulesK"
              id="schedulesK"
              className="startup-wizard-form__input-checkbox"
              onChange={() => handleScheduleSelection("schedulesK")}
              checked={schedulesK}
            />
            Schedules K (Other Countries Ports)
          </label>
        </div>
        <div className="startup-wizard-form__section">
          <h2 className="startup-wizard-form__title">{message || ""}</h2>
        </div>
      </form>
      <div className="startup-wizard-form__options-container">
        <button
          className="startup-wizard-form__option"
          onClick={() => handleNextButtonClick()}
          type="button"
        >
          {activeTab >= 6 ? "Finish" : "Next"}
        </button>
        <button
          className="startup-wizard-form__option"
          onClick={props.closeModal}
        >
          Cancel
        </button>
        <button className="startup-wizard-form__option">Help</button>
      </div>
    </div>
  );
};

MyCompanyForm.propTypes = {
  closeModal: propTypes.func,
};

MyCompanyForm.defaultProps = {
  closeModal: null,
};

export default MyCompanyForm;
