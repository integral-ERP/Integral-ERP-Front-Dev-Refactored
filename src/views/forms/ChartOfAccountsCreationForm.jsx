import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import CurrencyService from "../../services/CurrencyService";

const  ChartOfAccountsCreationForm = ({
  chartOfAccounts,
  closeModal,
  creating, 

}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [ChartOfAccounts, setChartOfAccounts] = useState([])
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [currencies, setcurrencies] = useState([]);

  const formFormat = {
    name: "",
    typeChart: "",
    accountNumber: "",
    parentAccount: "",
    currency:"",
    note: "",
  };

  const [formData, setFormData] = useState({ formFormat });
// -------------------------------------------------------------
  useEffect(() => {
    if (!creating && chartOfAccounts) {
      setFormData({
        name: chartOfAccounts.name || "",
        typeChart: chartOfAccounts.type || "",
        accountNumber: chartOfAccounts.accountNumber || "",
        parentAccount: chartOfAccounts.parentAccount || "",
        currency: chartOfAccounts.currency || "",
        note: chartOfAccounts.note || "",
      });
    }
  }, [creating, chartOfAccounts]);

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
      name: formData.name,
      typeChart: formData.type,
      accountNumber: formData.accountNumber,
      parentAccount: formData.parentAccount,
      currency: formData.currency,
      note: formData.note,
    };
    console.log("DATA:", formData);
    const response = await (creating
      ? ChartOfAccountsService.createChartOfAccounts(rawData)
      : ChartOfAccountsService.updateChartOfAccounts(
        chartOfAccounts.id,
          rawData
        ));

      if (response.status >= 200 && response.status <= 300) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          closeModal();
  
          setShowSuccessAlert(false);
          setFormData(formFormat)
          window.location.reload();
        }, 1000);
      } else {
        console.log("Something went wrong:", response);
        setShowErrorAlert(true);
      }
    };
  
  //---------------------------------------------------------------------------------------------------------------------------------------------------
  const updateChartOfAccounts = (url = null) => {
    ChartOfAccountsService.getChartOfAccounts(url)
      .then((response) => {
        const newChartOfAccounts = response.data.results.filter(
          (newChartOfAccount) => {
            return !ChartOfAccounts.some(
              (existingChartOfAccount) =>
                existingChartOfAccount.id === newChartOfAccount.id
            );
          }
        );

        setChartOfAccounts(
          [...ChartOfAccounts, ...newChartOfAccounts].reverse()
        );

        if (response.data.next) {

        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
      updateChartOfAccounts();
    }, []);
  
  const [accountype, setAccountype] = useState("");
  
  const handleSearch = (row) => {
    let searchMatch = false
    console.log("filtrando", row)
    if (row.type===accountype){
      console.log("Hay informacion")
      searchMatch = true
    }
    else{
      console.log("No Hay informacion")
    }
    return searchMatch;
  };
  const filteredData = ChartOfAccounts.filter((row) => handleSearch(row));

  const handleType = (type)=> {
    setAccountype(type)
    setFormData({...formData, type:type})
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------
  const handleCancel = () => {
    window.location.reload();
  }

  return (
    <div className="company-form">
      <div className="creation creation-container w-100">
        <div className="row w-100">
          <div className="form-label_name"><h3>Items & Services</h3><span></span></div>

      
      <form
        className={`tab-pane fade ${
          activeTab === "definition" ? "show active" : ""
        } company-form__general-form`}
        id="general"
        style={{ display: activeTab === "definition" ? "block" : "none" }}
      >
        <div className="">
          <div className="company-form__section">
            <label htmlFor="type" className="form-label">
              Type:
            </label>
            <select
              id="type"
              className="form-input"
              value={formData.type}
              onChange={(e) => 
                handleType(e.target.value )}
            >
              <option value="">Select a Type</option>
              <option value="Accounts Receivable">Accounts Receivable</option>
              <option value="Accouns Payable">Accouns Payable</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Cost Of Goods Sold<">Cost Of Goods Sold</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Undeposited Funds">Undeposited Funds</option>
              <option value="Fixed Assets">Fixed Assets</option>
              <option value="Fixed Assets">Other Assets</option>
              <option value="Other Current Assets">Other Current Assets</option>
              <option value="Long Term Liabilities">Long Term Liabilities</option>
              <option value="Other Current Liabilities">Other Current Liabilities</option>
              <option value="Equity">Equity</option>
              <option value="Credit Card">Credit Card</option>
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
              type="num"
              inputName="accountNumber"
              placeholder="Account Number"
              value={formData.accountNumber}
              changeHandler={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              label="Account Number"
            />
          </div>
          <div className="company-form__section">
            <label htmlFor="chartofaccountsType" className="form-label">
              Parent Account:
            </label>
            <select
              id="parentAccount"
              className="form-input"
              inputName="parentAccount"
                onChange={(e) => 
                  setFormData({ ...formData, parentAccount: e.target.value })}
                >
              <option value="">Select a Parent Account</option>
                {filteredData.map((ChartOfAccounts) => (
                  <option
                    key={ChartOfAccounts.id}
                    value={ChartOfAccounts.id}
                    data-key={ChartOfAccounts.type}
                  >

                    {ChartOfAccounts.name + " || " + ChartOfAccounts.type}
                    
                </option>))}
            </select>
          </div>
        <div className="">
          <div className="company-form__section">
            <label htmlFor="currency" className="form-label">
            Currency:
            </label>
            <select
              id="currency"
              className="form-input"
              value={formData.currency}
              onChange={(e) => 
                setFormData({ ...formData, currency: e.target.value })}
            >
              <option value="">Select a currency</option>
              <option value="COP Colombia Peso">COP Colombia Peso</option>
              <option value="USD Unided States Dollar">USD Unided States Dollar</option>
            </select>
          </div>
        </div>
        </div>
        <div className="form-group">
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
        </div>
      </form>    
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
  {/* Conditionally render the success alert */}
  {showSuccessAlert && (
  <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
    <AlertTitle>Success</AlertTitle>
    <strong>
    Chart Of Accounts {creating ? "created" : "updated"} successfully!
    </strong>
  </Alert>
  )}
  {showErrorAlert && (
    <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
      <AlertTitle>Error</AlertTitle>
      <strong>
        Error {creating ? "creating" : "updating"} Chart Of Accounts. Please try again
      </strong>
    </Alert>
  )}

    </div>
  );
};

ChartOfAccountsCreationForm.propTypes = {
  chartOfAccounts: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onChartOfAccountsDataChange: propTypes.func,
};

ChartOfAccountsCreationForm.defaultProps = {
  chartOfAccounts: {},
  closeModal: null,
  creating: false,
  onChartOfAccountsDataChange: null,
};

export default ChartOfAccountsCreationForm;
