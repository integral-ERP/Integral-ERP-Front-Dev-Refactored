import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
import VendorService from "../../services/VendorService";
const VendorsCreationForm = ({
  vendor,
  closeModal,
  creating,
  onvendorDataChange,
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
    if (!creating && vendor) {
      setFormData({
        name: vendor.name || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        fax: vendor.fax || "",
        webSide: vendor.webSide || "",
        firstNameContac: vendor.firstNameContac || "",
        lasNameContac: vendor.lasNameContac || "",
        streetNumber: vendor.streetNumber || "",
        city: vendor.city || "",
        state: vendor.state || "",
        country: vendor.country || "",
        zipCode: vendor.zipCode || "",
        referentNumber: vendor.referentNumber || "",
      });
    }
  }, [creating, vendor]);

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
    console.log("DATA:", formData);
    const response = await (creating
<<<<<<< HEAD
        ? VendorService.createVendor(rawData)
        : VendorService.updateVendor(vendor.id, rawData));
  
      if (response.status >= 200 && response.status <= 300) {
        console.log("Vendor successfully created/updated:", response.data);
        setShowSuccessAlert(true);
        setTimeout(() => {
          closeModal();
          onvendorDataChange();
          setShowSuccessAlert(false);
          window.location.reload();
        }, 2000);
      } else {
        console.log("Something went wrong:", response);
        setShowErrorAlert(true);
      }
=======
      ? VendorService.createVendor(rawData)
      : VendorService.updateVendor(vendor.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Vendor successfully created/updated:", response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onvendorDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 2000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
>>>>>>> main
  };

  return (
    <div className="company-form vendor">

      <div className="row w-100">
        <div className="col-6">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h3>General</h3><span></span></div>
            <div className="row w-100">
              <div className="col-6 text-start">
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
              </div>
           
            <div className="col-6 text-start">
              <div className="company-form__section">
                <Input
                  type="text"
<<<<<<< HEAD
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
          </div>{/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
              <Input
                  type="text"
=======
>>>>>>> main
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
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 text-start">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h3>Address</h3><span></span></div>
            <div>
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
                <select
                  name="wp-country"
                  id="wp-country"
                  className="form-input"
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
                <label htmlFor="wp-state" className="form-label">
                  State:
                </label>
                <select
                  name="wp-state"
                  id="wp-state"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => handleStateChange(e)}
                >
                  <option value="">Select a state</option>
                  {formData.state &&
                    states
                      .filter((state) => state.name === formData.state)
                      .map((state) => (
                        <option
                          key={state.iso2}
                          value={state.name}
                          data-key={state.iso2}
                        >
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
                <label htmlFor="wp-city" className="form-label">
                  City:
                </label>
                <select
                  name="wp-city"
                  id="wp-city"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="">Select a city</option>
                  {formData.city &&
                    cities
                      .filter((city) => city.name === formData.city)
                      .map((city) => (
                        <option
                          key={city.iso2}
                          value={city.name}
                          data-key={city.iso2}
                        >
                          {city.name}
                        </option>
                      ))}
                  {!formData.city &&
                    cities.map((city) => (
                      <option key={city.iso2} value={city.name} data-key={city.iso2}>
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
            </div>
          </div>
        </div>
      </div>

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
            Vendor {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Vendor. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

VendorsCreationForm.propTypes = {
  vendor: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onvendorDataChange: propTypes.func,
};

VendorsCreationForm.defaultProps = {
  vendor: {},
  closeModal: null,
  creating: false,
  onvendorDataChange: null,
};

export default VendorsCreationForm;
