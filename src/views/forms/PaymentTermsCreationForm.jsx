import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import PaymentTermsService from "../../services/PaymentTermsService";
import CurrencyService from "../../services/CurrencyService";

const PaymentTermsCreationForms = ({
  paymentTerms,
  closeModal,
  creating,
  onpaymentTermDataChange,
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
    inactive: false,
  };

  const [formData, setFormData] = useState({ formFormat });

  useEffect(() => {
    console.log("Creating=", creating);
    console.log("Payment Terms=", paymentTerms);
    if (!creating && paymentTerms) {
      console.log("Editing Payment Terms...", paymentTerms);
      setFormData({
        description: paymentTerms.description || "",
        dueDays: paymentTerms.dueDays || "",
        discountPercentage: paymentTerms.discountPercentage || "",
        discountDays: paymentTerms.discountDays || "",
        inactive: paymentTerms.inactive || false,
      });
    }
  }, [creating, paymentTerms]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const currenciesData = await CurrencyService.getCurrencies();
  //     setcurrencies(currenciesData.data);
  //   };

  //   fetchData();
  // }, []);
  // -------------------------------------------------------------

  const sendData = async () => {
    let rawData = {
      description: formData.description || "",
      dueDays: formData.dueDays || "",
      discountPercentage: formData.discountPercentage || "",
      discountDays: formData.discountDays || "",
      inactive: formData.inactive || false,
    };

    console.log("DATA = ", formData);
    //-------------------------------------
    const response = await (creating
      ? PaymentTermsService.createPaymentTerm(rawData)
      : PaymentTermsService.updatePaymentTerm(
          paymentTerms.id,
          rawData
        ));

    if (response.status >= 200 && response.status <= 300) {
      console.log(
        "Prueba successfully created/updated:",
         response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onpaymentTermDataChange();
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
    console.log("Imprimir = ",PaymentTerms);
  };
  useEffect(() => {
    updatePaymentTerm();
  }, []);
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

PaymentTermsCreationForms.propTypes = {
  paymentTerms: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onpaymentTermDataChange: propTypes.func,
};

PaymentTermsCreationForms.defaultProps = {
  paymentTerms: {},
  closeModal: null,
  creating: false,
  onpaymentTermDataChange: null,
};

export default PaymentTermsCreationForms;



