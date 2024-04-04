import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import CustomerService from "../../services/CustomerService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
const CustomerCreationForm = ({
  customer,
  closeModal,
  creating,
  onCustomerDataChange,
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
    website: "",
    reference_number: "",
    contact_first_name: "",
    contact_last_name: "",
    street_and_number: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
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
    if (!creating && customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        fax: customer.fax || "",
        website: customer.website || "",
        contact_first_name: customer.contact_first_name || "",
        contact_last_name: customer.contact_last_name || "",
        street_and_number: customer.street_and_number || "",
        city: customer.city || "",
        state: customer.state || "",
        country: customer.country || "",
        zip_code: customer.zip_code || "",
        reference_number: customer.reference_number || "",
      });
    }
  }, [creating, customer]);

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
      website: formData.website,
      reference_number: parseInt(formData.reference_number),
      contact_first_name: formData.contact_first_name,
      contact_last_name: formData.contact_last_name,
      street_and_number: formData.street_and_number,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: parseInt(formData.zip_code),
    };

    const response = await (creating
      ? CustomerService.createCustomer(rawData)
      : CustomerService.updateCustomer(customer.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onCustomerDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }

  };

  const handleCancel = () => {
    window.location.reload();
  }

  return (
    <div className="company-form">
      <div className="row w-100">
        <div className="col-6">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>General</h2><span></span></div>
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
                      inputName="website"
                      placeholder="website"
                      value={formData.website}
                      changeHandler={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      label="Web Site"
                    />
                  </div>
                  <div className="company-form__section">
                    <Input
                      type="text"
                      inputName="reference_number"
                      placeholder="Referent Number"
                      value={formData.reference_number}
                      changeHandler={(e) =>
                        setFormData({ ...formData, reference_number: e.target.value })
                      }
                      label="Reference Number"
                    />
                  </div>
                </div>
                <div className="col-6 text-start">
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
                        inputName="contactFN"
                        placeholder="Contact First Name"
                        value={formData.contact_first_name}
                        changeHandler={(e) =>
                          setFormData({ ...formData, contact_first_name: e.target.value })
                        }
                        label="Contact First Name"
                      />
                    </div>
                    <div className="company-form__section">
                      <Input
                        type="text"
                        inputName="contact_last_name"
                        placeholder="Contact Last Name"
                        value={formData.contact_last_name}
                        changeHandler={(e) =>
                          setFormData({ ...formData, contact_last_name: e.target.value })
                        }
                        label="Contact Last Name"
                      />
                    </div>
                </div>{/* ----------------------------END TWO---------------------------------- */}
            
            </div>
          </div>
        </div>

        <div className="col-6 text-start">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>Address</h2><span></span></div>
            <div>
              <div className="company-form__section">
                <Input
                  type="textarea"
                  inputName="street"
                  placeholder="Street & Address..."
                  value={formData.street_and_number}
                  changeHandler={(e) =>
                    setFormData({ ...formData, street_and_number: e.target.value })
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
                    inputName="zip_code"
                    placeholder="Zip Code..."
                    value={formData.zip_code}
                    changeHandler={(e) =>
                      setFormData({ ...formData, zip_code: e.target.value })
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
        <button className="button-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
          <AlertTitle>Success</AlertTitle>
          <strong>
            Customer {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Customer. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

CustomerCreationForm.propTypes = {
  customer: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onCustomerDataChange: propTypes.func,
};

CustomerCreationForm.defaultProps = {
  customer: {},
  closeModal: null,
  creating: false,
  onCustomerDataChange: null,
};

export default CustomerCreationForm;
