import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import AsyncSelect from "react-select/async";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import CustomerService from "../../services/CustomerService";

const DepositsChargeForm = ({ 
  onCancel, 
  deposits, 
  setBills, 
  editing, 
  deposit, 
}) => {
  const formFormat = {
    accountByName: "",
    amount: 0.0,
    description: "",
    entity: "",
    accountById:"",
    account: "",
  };

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [formData, setformData] = useState(formFormat);
  const [accountByOptions, setaccountByOptions] = useState(formFormat);
  const [accountByName, setaccountByName] = useState([]);
  const [customeByOptions, setcustomeByOptions] = useState(formFormat);
  const [internalID, setinternalID] = useState(0);
  // --------------------------------------------------------------------------------

  const addCommodity = () => {
    const suma = parseInt(formData.amount);
    setformData({ ...formData, suma: formData.suma });
    const body = {
      id: internalID,
      accountByName: formData.accountByName,
      amount: formData.amount,
      description: formData.description,
      entity: formData.entity,
      accountByType: formData.accountByType,
      accountById: formData.accountById,
    };
    if (editing) {
      const indexToEdit = deposits.findIndex((comm) => comm.id == deposit.id);
      const copy = [...deposits];
      copy[indexToEdit] = body;
      setBills(copy);
    } else {
      setBills([...deposits, body]);
      setinternalID(internalID + 1);
    }
    console.log("BILLSS= ", deposits);
  };

  useEffect(() => {
    if (formData.totalAmount && formData.quantity) {
      setformData({
        ...formData,
        amount: formData.totalAmount * formData.quantity,
      });
      console.log("PReuba=", formData.totalAmount, formData.quantity);
    }
  }, [formData.totalAmount, formData.quantity]);

  useEffect(() => {
    console.log("FORMDATA= ", formData);
    if (formData.height && formData.width && formData.length) {
      const volWeight = (
        (formData.height * formData.width * formData.length) /
        166
      ).toFixed(0);
      const ratedWeight =
        formData.volumetricWeight >= formData.weight
          ? formData.volumetricWeight
          : formData.weight;
      setformData({
        ...formData,
        volumetricWeight: volWeight,
        chargedWeight: ratedWeight,
      });
    }
  }, [formData.height, formData.length, formData.width]);

  useEffect(() => {
    if (editing) {
      const formFormat = {
        id: deposit.id,
        accountByName: deposit.accountByName,
        description: deposit.description,
        accountByType: deposit.accountByType,
        accountById: deposit.accountById,
      };
      setformData(formFormat);
    }
  }, []);

  

  const sendDataType = async () => {
    let rawData = {
      accountByName: formData.accountByName,
      account: formData.account,
    };
    const response = await (creating
      ? ChartOfAccountsService.createChartOfAccounts(rawData)
      : ChartOfAccountsService.updateChartOfAccounts(deposit.id, rawData)
      
      ? CustomerService.CustomerService(rawData)
      : CustomerService.updateCustomer(deposit.id, rawData)
      
      );

    if (response.status >= 200 && response.status <= 300) {
      console.log("Bills successfully created/updated:", response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onInvoicesDataChange();
        setShowSuccessAlert(false);
        // window.location.reload();
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  const fetchFormData = async () => {
    const accoun = (await ChartOfAccountsService.getChartOfAccounts()).data.results;
    const customer = (await CustomerService.getCustomers()).data.results;
    // Function to add 'type' property to an array of objects
    const addTypeToObjects = (arr, type) => arr.map((obj) => ({ ...obj, type }));
    const addCustomerToObjects = (arr, type) => arr.map((obj) => ({ ...obj, type }));

    // Add 'type' property to each array
    const accountWithType = addTypeToObjects(accoun, "accounten-termn");
    const customeWithType = addCustomerToObjects(customer, "customer");

    // Merge the arrays
    // const accountByOptions = [...accountWithType].filter(account => account.typeChart == "Accounts Receivable"||"Income"||"Expense"||"Cost Of Goods Sold"||"Bank Account"||"Equity"||"Other Current Assets"||"Fixed Assets"||"Other Current Liabilities"||"Other Assets");
    const accountByOptions = [...accountWithType].filter(account => account.typeChart == "Accounts Receivable");
    const customeByOptions = [... customeWithType]

    setaccountByOptions(accountByOptions);
    setcustomeByOptions(customeByOptions);
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  //------------------------------------------------------------------------------------
  const handleAccountBySelection = async (event) => {
    const id = event.id;
    const typeChart = event.typeChart;
    const name = event.name;
    const result = await ChartOfAccountsService.getChartOfAccountsId(id);
    console.log("RESULTADO CHART", result.typeChart)
    setaccounts(result.data)
    setformData({
      ...formData,
      accountById: id,
      accountByType: typeChart,
      accountByName: name,

    });
    console.log("TYPE_CHART=", typeChart);
  };
  //------------------------------------------------------------------------------------
  const handleEntityBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await CustomerService.getCustomerById(id);
    settype(result.data);
    setformData({
      ...formData,
      customerByCode: id,
      customerByCode: name,
    });
  };

  return (
    <div className="company-form row income-charge-form">
      <h3>Invoices Creation Form</h3>
      <div className="row w-100">
        <div className="col-6">
          <div className="company-form__section">
            <label htmlFor="account" className="form-label">
              Chart Account:
            </label>
            <AsyncSelect
              id="account"
              value={accountByName.find(
                (option) => option.id === formData.accountByName)}
              onChange={(e) => { handleAccountBySelection(e); }}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={accountByOptions}
              getOptionLabel={(option) => option.name + " || " + "Accounts Receivable"}
              getOptionValue={(option) => option.id}
            />
          </div>
          {/* --------------------------------------------------------------------------- */}
          <div className="form-column">
            <label htmlFor="amount" className="text-comm">
              Amount
            </label>
            <input
              className="form-input"
              type="number"
              id="amount"
              readOnly
              value={formData.amount}
              onChange={(e) =>
                setformData({ ...formData, amount: e.target.value })
              }
            />
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <div>
            <label htmlFor="description" className="text-comm">
              Description
            </label>
            <input
              name="description"
              type="text"
              className="form-input"
              placeholder="Description..."
              value={formData.description}
              onChange={(e) =>
                setformData({ ...formData, description: e.target.value })
              }
            />
          </div>
          {/* ---------------------------------------------------------------------------- */}
          <div className="company-form__section">
          <label htmlFor="customerByCode" className="form-label">
          Entity:
          </label>
          <AsyncSelect
            id="customerByCode"
            // value={customerByCode.find((option) => option.id === formData.customerByCode)}
            onChange={(e) => {handleEntityBySelection(e);}}
            isClearable={true}
            placeholder="Search and select..."
            defaultOptions={customeByOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            />
        </div>
         {/* --------------------------------------------- */}
        </div>

        <div className="table-hover charge-buttons">
          <button
            className="button-save pick "
            style={{ marginRight: "10px" }}
            type="button"
            onClick={addCommodity}
          >
            <i className="fas fa-check-circle"></i>
          </button>
          <button
            className="button-cancel pick "
            type="button"
            onClick={() => onCancel(false)}
          >
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
      </div>
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>Commodity created successfully!</strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert
          severity="error"
          onClose={() => setShowErrorAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Error</AlertTitle>
          <strong>Error creating Commodity. Please try again</strong>
        </Alert>
      )}
    </div>
  );
};

DepositsChargeForm.propTypes = {
  onCancel: propTypes.func,
  deposits: propTypes.array,
};

DepositsChargeForm.defaultProps = {
  onCancel: null,
  deposits: [],
};

export default DepositsChargeForm;
