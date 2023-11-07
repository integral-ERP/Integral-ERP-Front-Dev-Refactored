import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import PaymentTermsService from "../../services/PaymentTermsService";
import CurrencyService from "../../services/CurrencyService";

const PaymentTermsCreationForm = ({
  paymentTerm,
  closeModal,
  creating,
  onpaymentTermsDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [PaymentTerms, setPaymentTerms] = useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [currencies, setcurrencies] = useState([]);

  const formFormat = {
    description: "",
    dueDays: "",
    discountPercentage: "",
    discountDays: "",
    inactive: "",
  };

  const [formData, setFormData] = useState({ formFormat });
  // -------------------------------------------------------------
  useEffect(() => {
    console.log("Creating=", creating);
    console.log("Payment Terms=", paymentTerm);
    if (!creating && paymentTerm) {
      console.log("Editing Payment Terms...", paymentTerm);
      setFormData({
        description: paymentTerm.description || "",
        dueDays: paymentTerm.dueDays || "",
        discountPercentage: paymentTerm.discountPercentage || "",
        discountDays: paymentTerm.discountDays || "",
        inactive: paymentTerm.inactive || "",
      });
    }
  }, [creating, paymentTerm]);

  useEffect(() => {
    const fetchData = async () => {
      const currenciesData = await CurrencyService.getCurrencies();
      setcurrencies(currenciesData.data);
    };

    fetchData();
  }, []);
  // -------------------------------------------------------------

  const sendData = async () => {
    let rawData = {
      description: formData.description,
      dueDays: formData.dueDays,
      discountPercentage: formData.discountPercentage,
      discountDays: formData.discountDays,
      inactive: formData.inactive,
    };
    console.log("DATA:", formData);
    const response = await (creating
      ? PaymentTermsService.createPaymentTerm(rawData)
      : PaymentTermsService.updatePaymentTerm(
          paymentTerm.id,
          rawData
        ));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Prueba successfully created/updated:", response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onpaymentTermsDataChange();
        setShowSuccessAlert(false);
        // setFormData(formFormat)
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------------
  const updatePaymentTerm = (url = null) => {
    PaymentTermsService.getPaymentTerms(url)
      .then((response) => {
        const newPaymentTerms = response.data.results.filter(
          (newPaymentTerm) => {
            return !PaymentTerms.some(
              (existingPaymentTerm) =>
                existingPaymentTerm.id === newPaymentTerm.id
            );
          }
        );

        setPaymentTerms(
          [...PaymentTerms, ...newPaymentTerms].reverse()
        );

        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(PaymentTerms);
  };

  useEffect(() => {
    updatePaymentTerm();
  }, []);

  const [accountype, setAccountype] = useState("");

  const handleSearch = (row) => {
    let searchMatch = false;
    console.log("filtrando", row);
    if (row.type === accountype) {
      console.log("Hay informacion");
      searchMatch = true;
    } else {
      console.log("No Hay informacion");
    }
    return searchMatch;
  };
  const filteredData = PaymentTerms.filter((row) => handleSearch(row));

  const handleType = (type) => {
    setAccountype(type);
    setFormData({ ...formData, type: type });
  };
  //--------------------------------------------------------------------------------------------------------------------------------------------------

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
            Payment Terms
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
        <div className="">
         
          <div className="company-form__section">
            <Input
              type="text"
              inputName="description"
              placeholder="Description"
              value={formData.description}
              changeHandler={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              label="Description"
            />
          </div>
          <div className="company-form__section">
            <Input
              type="number"
              inputName="dueDays"
              placeholder="Due Days"
              value={formData.dueDays}
              changeHandler={(e) =>
                setFormData({ ...formData, dueDays: e.target.value })
              }
              label="Due Days"
            />
          </div>
          <div className="company-form__section">
            <Input
              type="number"
              inputName="discountPercentage"
              placeholder="Discount Pe"
              value={formData.discountPercentage}
              changeHandler={(e) =>
                setFormData({ ...formData, discountPercentage: e.target.value })
              }
              label="Discount Percentage"
            />
          </div>
          <div className="company-form__section">
            <Input
              type="number"
              inputName="discountDays"
              placeholder="Discount Da"
              value={formData.discountDays}
              changeHandler={(e) =>
                setFormData({ ...formData, discountDays: e.target.value })
              }
              label="Discount Days"
            />
          </div>
         
          
          <div className="">
            <div className="company-form__section">
              {/* <label htmlFor="currency" className="form-label">
                Inactive:
              </label>
              <select
                id="currency"
                className="form-input"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="">Select a Inactivity</option>
                <option value="No">Yes</option>
                <option value="Yes">No</option>
              </select> */}
               <Input
              type="checkbox"
              inputName="inactive"
              value={formData.inactive}
              changeHandler={(e) =>
                setFormData({ ...formData, inactive: e.target.value })
              }
              label="Inactive"
            />
              
            </div>
          </div>
        </div>
        {/* <div className="form-group">
          <Input
            type="textarea"
            inputName="note"
            placeholder="Nota here..."
            label="Note"
            value={formData.note}
            changeHandler={(e) =>
              setFormData({ ...formData, note: e.target.value })
            }
          />
        </div> */}
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
            Payment Terms {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Payment Terms. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

PaymentTermsCreationForm.propTypes = {
  PaymentTerms: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onpaymentTermsDataChange: propTypes.func,
};

PaymentTermsCreationForm.defaultProps = {
  PaymentTerms: {},
  closeModal: null,
  creating: false,
  onpaymentTermsDataChange: null,
};

export default PaymentTermsCreationForm;
