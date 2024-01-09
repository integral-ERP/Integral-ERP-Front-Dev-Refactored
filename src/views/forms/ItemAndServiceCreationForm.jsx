import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import CurrencyService from "../../services/CurrencyService";

import ChartOfAccountsService from "../../services/ChartOfAccountsService";

const ItemAndServiceCreationForm = ({
  itemAndService,
  closeModal,
  creating,
}) => {
  // const [activeTab, setActiveTab] = useState("definition");
  const [currencies, setcurrencies] = useState([]);
  const [itemsAndServices, setItemsAndServices] = useState([]);
  const [accounst, setaccounts] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [itemsAndServicestype, setItemsAndServicestype] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    accountName: "",
    type: "",
    amount: "",
    currency: "",
    iataCode: "",
    price: 0.0,
  });

  useEffect(() => {
    console.log("creating =", creating)
    console.log("itemAndService =", itemAndService)
    if (!creating && itemAndService) {
      setFormData({
        code: itemAndService.code || "",
        description: itemAndService.description || "",
        accountName: itemAndService.accountName,
        type: itemAndService.type || "",
        amount: itemAndService.amount || "",
        currency: itemAndService.currency || "",
        iataCode: itemAndService.iataCode || "",
        price: itemAndService.amount,
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
      accountName: formData.accountName ,
      type: formData.type,
      amount: formData.price,
      currency: formData.currency,
      iataCode: formData.iataCode,
    };
    console.log("DATA:", formData);
    const response = await (creating
      ? ItemsAndServicesService.createItemAndService(rawData)
      : ItemsAndServicesService.updateItemsAndServices(
        itemAndService.id,
        rawData
      ));

    if (response.status >= 200 && response.status <= 300) {
      console.log(
        "Item & Service successfully created/updated:",
        response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        // onitemAndServiceDataChange();
        setShowSuccessAlert(false);
        setFormData(formData)
        window.location.reload();
      }, 2000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const accountData = await ChartOfAccountsService.getChartOfAccounts();
      setaccounts(accountData.data.results);
    };

    fetchData();
  }, []);

  const handleType = (type) => {
    setItemsAndServicestype(type);
    setFormData({ ...formData, type: type });
  };

  //

  const updateItemsAndServices = (url = null) => {
    ItemsAndServicesService.getItemsAndServices(url)
      .then((response) => {
        const newItemsAndServices= response.data.results.filter(
          (newItemsAndService) => {
            return !itemsAndServices.some(
              (existingPaymentTerm) =>
                existingPaymentTerm.id === newItemsAndService.id
            );
          }
        );

        setItemsAndServices(
          [...itemsAndServices, ...newItemsAndServices].reverse()
        );

        if (response.data.next) {
          // setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Imprimir = ", itemsAndServices);
  };
  useEffect(() => {
    updateItemsAndServices();
  }, []);

  return (
    <div className="company-form">
      <div className="creation creation-container w-100">
        <div className="row w-100">
          <div className="form-label_name"><h3>Definition</h3><span></span></div>

          <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="" className="form-label">
                Type:
              </label>
              <select
                className="form-input"
                id="type"
                value={formData.type}
                onChange={(e) => handleType(e.target.value)}
              >
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

            <div className="company-form__section">
              <label htmlFor="accountNameType" className="form-label">
                Account:
              </label>
              <select
                id="accountName"
                className="form-input"
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                value={formData.accountName}
              >
                <option value="">Select an Account Name</option>
                {accounst.map((accountNames) => (
                  <option
                    key={accountNames.id}
                    value={accountNames.id}
                    data-key={accountNames.typeChart}
                  >
                    {accountNames.name + " || " + accountNames.typeChart}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-6 text-start">
           
            <div className="company-form__section">
              <label htmlFor="currency" className="text-comm">
                Currency
              </label>
              <select
                id="currency"
                className="form-input"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="">Select a currency</option>
                {Object.entries(currencies).map(([currencyCode, currencyName]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode} - {currencyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="company-form__section">
              <Input
                type="number"
                inputName="price"
                value={formData.price}
                changeHandler={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                label="Price"
              />
            </div>

            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="iataCode"
                placeholder="IATA Code here..."
                label="IATA Code"
                value={formData.iataCode}
                changeHandler={(e) =>
                  setFormData({ ...formData, iataCode: e.target.value })
                }
              />
            </div>
          </div>
        </div>




        {/* <div className="col-6">
          <div className="creation creation-container w-100">
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
      </div>
      </div> */}
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
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Item and Service {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Item and Service. Please
            try again
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