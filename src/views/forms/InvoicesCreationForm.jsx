import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import AsyncSelect from "react-select/async";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "../shared/components/Table";

import InvoicesService from "../../services/InvoicesService";
import PaymentTermsService from "../../services/PaymentTermsService";

import CustomerService from "../../services/CustomerService";
import ForwardingAgentService from "../../services/ForwardingAgentService";

import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";

import React, { createContext, useContext } from 'react';

const invoiceCreationForm = ({
  invoice,
  closeModal,
  creating,
}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");
  const [apply, setapplys] = useState([]);

  const [issuedByOptions, setIssuedByOptions] = useState([]);
  const [paymentByOptions, setPaymentByOptions] = useState([]);
  const [accountByOptions, setAccountByOptions] = useState([]);
  const [typeByOptions, setptypeByOptions] = useState([]);
  
  const [paymentTem, setPaymentTems] = useState([]);
  const [account, setAccountTems] = useState([]);
  const [typeService, setTypeServiceTems] =useState([])


  const [charges, setcharges] = useState([]);
  const [type, settypes] = useState([]);
  const [types, settype] = useState([]);
  const [issuedby, setIssuedby] = useState(null);
  const [payment, setpayments] = useState([]);
  const [accounst, setaccounts] = useState([]);
  var numprice=Number(numqueality);
  var numqueality= Number(numprice);

  let totalp=0;
  let totalt=0;
  let tota=0;

const formFormat = {
  number: "",
  account: "",
  typeService: "",
  paymentTem: "",
  division: "",
  apply: "",
  due: today,
  trasaDate: today,
  bilingAddres: 0.0,
  paidAd: "",
  
  paidAdd: "",
  exchangeRate: "",
  amount: "",
  tax: "",
  totalAmount: "",
  amountDue: "",
  status: "Open",
  prepaid: "Yes",
  price: "",
  currency:"United States Dollar",
  invoice: "",
  typeName: "",
  typeById: "",
  typeByCode: "",

};

const [formData, setformData] = useState(formFormat);
const total = createContext();
const [resultado, setResultado] = useState(0);
// --------------------------------------------------------------------------------
const handleChargeRateChange = (e) => {
  let unit = 0;
  const rate = e.target.value;
  unit = formData.quantity;
  const total = unit * rate;
  
  setformData({ ...formData, price: rate, amount: total });
  tota = total+tota;
  console.log("TOTAL1 =", tota)
  console.log("TOTAL2 =", total)
};//------------------------------------------------------------------------------------
  const handleIssuedBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const description = event.description;
    const result = await ForwardingAgentService.getForwardingAgentById(id);
    setIssuedby(result.data)
    setformData({
      ...formData,
      issuedById: id,
      issuedByName: name,
      issuedByType: type,
    });

  };
  //------------------------------------------------------------------------------------
  const handlePaymentBySelection = async (event) => {
    const id = event.id;
    const description = event.description;
    const result = await PaymentTermsService.getPaymentTermById(id);
    setpayments(result.data)
    setformData({
      ...formData,
      paymentById: id,
      paymentByDesc: description,
    });
  };
  //------------------------------------------------------------------------------------
  const handleAccountBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await PaymentTermsService.getPaymentTermById(id);
    setaccounts(result.data)
    setformData({
      ...formData,
      accountById: id,
      accountByName: name,
    });
  };
  //------------------------------------------------------------------------------------
  const handleTypeServiceBySelection = async (event) => {
    const id = event.id;
    const code = event.code;
    const result = await ItemsAndServicesService.getItemAndServiceById(id);
    settype(result.data)
    setformData({
      ...formData,
      typeById: id,
      typeByCode: code,
    });
  };
  //------------------------------------------------------------------------------------
 
  useEffect(() => {
    const fetchData = async () => {
      const typeData = await ItemsAndServicesService.getItemsAndServices();
      settypes(typeData.data.results);
    };

    fetchData();
  }, []);
  
  
  
  useEffect(() => {
    console.log("Invoices...", invoice);
    
    if (!creating && invoice) {
      console.log("Editing Invoices...", invoice);
      setformData({
        number: invoice.number || "",
        account: invoice.account || "",
        typeService: invoice.typeService || "",
        paymentTem: invoice.paymentTem || "",
        division: invoice.division || "",
        apply: invoice.apply || "",
        due: invoice.due || "",
        trasaDate: invoice.trasaDate,
        bilingAddres: invoice.bilingAddres || "",
        paidAd: invoice.paidAd || "",

        paidAdd: InvoicesService.paidAdd || "",
        exchangeRate: InvoicesService.exchangeRate || "",
        amount: InvoicesService.amount || "",
        tax: InvoicesService.tax || "",
        totalAmount: InvoicesService.totalAmount || "",
        amountDue: InvoicesService.amountDue || "",

        paymentByDesc: invoice.paymentByDesc,
        accountByName: invoice.accountByName || "",
        typeByCode: invoice.typeByCode || "",
        
      });
    }
  }, [creating, invoice]);

  const sendData = async () => {
    let rawData = {
      number: formData.number,
      account: formData.account,
      typeService: formData.typeService,
      paymentTem: formData.paymentTem,
      division: formData.division,
      apply: formData.apply,
      due: formData.due,
      trasaDate: formData.trasaDate,
      bilingAddres: formData.bilingAddres,
      paidAd: formData.paidAd,
      type: formData.type,
      suma : formData.suma,
      resultado : formData.resultado,
      typeName : formData.typeName,
      //----------
      issuedById : formData.issuedById,
      issuedByName : formData.issuedByName,
      //----------
      paymentById: formData.paymentById,
      paymentByDesc: formData.paymentByDesc,
      //----------
      accountById: formData.accountById,
      accountByName: formData.accountByName,
      //----------
      typeById: formData.typeById,
      typeByCode: formData.typeByCode,
      // accountByType: formData.accountByType,
    };
    console.log("DATA:", formData);
    
    const response = await (creating
      ? InvoicesService.createInvoice(rawData)
      : InvoicesService.updateInvoices(invoice.id,rawData));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Invoice successfully created/updated:",response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        // oninvoiceDataChange();
        setShowSuccessAlert(false);
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };
  const sendDataType = async () => {
    let rawData = {
      apply: formData.apply,
      paymentTem: formData.paymentTem,
      account: formData.account,
      typeService: formData.typeService,

    };
    
    console.log("DATA CURTOMER:", formData);
    const response = await (creating
      ? CustomerService.CustomerService(rawData)
      : CustomerService.updateCustomer(
          invoice.id,
          rawData
      )
      ? ItemsAndServicesService.createItemAndService(rawData)
      : ItemsAndServicesService.updateItemsAndServicesService(
        invoice.id,
        rawData
      )
      ? ChartOfAccountsService.createChartOfAccounts(rawData)
      : ChartOfAccountsService.updateChartOfAccounts(
          invoice.id,
          rawData
      ));

    if (response.status >= 200 && response.status <= 300) {
      console.log(
        "Item & Service successfully created/updated:",
        response.data
      );
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        setShowSuccessAlert(false);
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  const handleApply = async (event) => {
    const id = event.id;
    const type = event.type;

    // let result;
    // if (type === "forwarding-agent") {
    //   result = await ForwardingAgentService.getForwardingAgentById(id);
    // }
    // if (type === "customer") {
    //   result = await CustomerService.getCustomerById(id);
    // }
  
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setformData({
      ...formData,
      applyToId: id,
      applyToType: type,
    });
  };
// ----------------------------------------------------------------------
const fetchFormData = async () => {  
  const forwardingAgents= (await ForwardingAgentService.getForwardingAgents()).data.results;
  const paiment         = (await PaymentTermsService.getPaymentTerms()).data.results;
  const accoun          = (await ChartOfAccountsService.getChartOfAccounts()).data.results;
  const type          = (await ItemsAndServicesService.getItemsAndServices()).data.results;
  // Function to add 'type' property to an array of objects
  const addTypeToObjects = (arr, type) =>
    arr.map((obj) => ({ ...obj, type }));

  // Add 'type' property to each array
  const forwardingAgentsWithType  = addTypeToObjects(forwardingAgents,"forwarding-agent");
  const paymentsWithType          = addTypeToObjects(paiment,"paiment-termn");
  const accountWithType           = addTypeToObjects(accoun, "accounten-termn");
  const typeWithType              = addTypeToObjects(type, "type");

  // Merge the arrays
  const issuedByOptions = [...forwardingAgentsWithType];
  const paymentByOptions = [...paymentsWithType];
  const accountByOptions = [...accountWithType];
  const typeByOptions = [...typeWithType];

  setIssuedByOptions(issuedByOptions);
  setPaymentByOptions(paymentByOptions);
  setAccountByOptions(accountByOptions);
  setptypeByOptions(typeByOptions);

};

useEffect(() => {
  fetchFormData();
}, []);

const createCharge = () => {
  const suma =parseInt(formData.amount) + parseInt(resultado);
    setResultado(suma);
  
  const charge = {
    ...formData,
  };


setcharges([...charges, charge]);

totalt= ((charge.price) * (charge.quantity)) + Number(totalp);
};
const handleType = (type) => {
  setItemsAndServicestype(type);
  setformData({ ...formData, type: type });


};
//------------------------------------------------------------------------
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
            Invoices
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
      <div className="containerr">
        <div className="cont-one">
          <div className="company-form__section">
            <Input
              type="text"
              inputName="number"
              placeholder="EXP123456"
              value={formData.number}
              changeHandler={(e) =>
                setformData({ ...formData, number: e.target.value })
              }
              label="Number"
            />
          </div>
      {/* --------------------------------------------------------------------------------------- */}
        <div className="company-form__section">
            <label htmlFor="account" className="form-label">
            Account:
            </label>
            <AsyncSelect
              id="account"
              value={account.find((option) => option.id === formData.account)}
              onChange={(e) => {handleAccountBySelection(e);}}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={accountByOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>
      {/* --------------------------------------------------------------------------------------- */}
          <div className="company-form__section">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Due Date"
                className="font-right"
                value={dayjs(formData.due)}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    due: dayjs(e).format("YYYY-MM-DD"),
                  })
                }
              />
            </LocalizationProvider>
          </div><div className="company-form__section">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Transation Date"
                className="font-right"
                value={dayjs(formData.trasaDate)}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    trasaDate: dayjs(e).format("YYYY-MM-DD"),
                  })
                }
              />
            </LocalizationProvider>
          </div>
        
         
        </div>{/* -------------------------END ONE---------------------------------- */}
        <div className="cont-two">
        <div className="company-form__section">
            <label htmlFor="paymentTem" className="form-label">
            Payment Tems:
            </label>
            <AsyncSelect
              id="paymentTem"
              value={paymentTem.find((option) => option.id === formData.paymentTem)}
              onChange={(e) => {handlePaymentBySelection(e);}}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={paymentByOptions}
              getOptionLabel={(option) => option.description}
              getOptionValue={(option) => option.id}
            />
          </div>
        {/* --------------------------------------------------------------------------------------- */}
        <div className="company-form__section">
          <label htmlFor="division" className="form-label">
            Division:
          </label>
          <select
            id="division"
            className="form-input"
            value={formData.division}
            onChange={(e) =>
            setformData({ ...formData, division: e.target.value })
          }
          >
            <option value="">Division</option>
            <option value="PressEx Logistic">PressEx Logistics</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        {/* --------------------------------------------------------------------------------------- */}
          <div className="company-form__section">
            <label htmlFor="apply" className="form-label">
              Apply To:
            </label>
            <AsyncSelect
              id="apply"
              value={apply.find(
                (option) => option.id === formData.apply
              )}
              onChange={(e) => {
                handleIssuedBySelection(e);
              }}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={issuedByOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>
        {/* --------------------------------------------------------------------------------------- */}
          <div className="company-form__section">
            <Input
              type="textarea"
              inputName="issuedbyinfo"
              placeholder="Issued By..."
              value={formData.issuedByInfo}
              readonly={true}
              label=""
            />
          </div>
        </div>{/* -------------------------END TWO---------------------------------- */}      
      </div>
    <div className="income-charge-form">
    <h3>Income Charge Form</h3>
    <div className="form-row">
      <div className="form-column">
      <div className="containerr">
        {/* <div className="company-form__section">
          <label htmlFor="typeNameType" className="form-label"> 
          Type: 
          </label>
          <select
            id="typeName" 
            className="form-input" 
            inputName="typeName"
            onChange={(e) => setformData({ ...formData, typeName: e.target.value })
            }
          >
            <option value="">Select an Type</option>
            {type.map((typeNames) => (
              <option
                key={typeNames.id}
                value={typeNames.id}
                data-key={typeNames.type}
              >
                {typeNames.code + " || " + typeNames.description + " || " + typeNames.type}
              </option>
            ))}
          </select>
        </div> */}
        {/* --------------------------------------------------------------------------------------- */}
        <div className="company-form__section">
            <label htmlFor="typeService" className="form-label">
            Type 2:
            </label>
            <AsyncSelect
              id="typeService"
              value={typeService.find((option) => option.id === formData.typeService)}
              onChange={(e) => {handleTypeServiceBySelection(e);}}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={typeByOptions}
              getOptionLabel={(option) => option.code}
              getOptionValue={(option) => option.id}
            />
          </div>
      {/* --------------------------------------------------------------------------------------- */}
        <div className="company-form__section">
          <Input
            type="text"
            inputName="taxCode"
            placeholder="Tax Code"
            value={formData.taxCode}
            changeHandler={(e) =>
              setformData({ ...formData, taxCode: e.target.value })
            }
            label="Tax Code"
          />
        </div>
        {/* --------------------------------------------- */}
        <div className="company-form__section">
          <Input
            type="text"
            inputName="description"
            placeholder="Description"
            value={formData.description}
            changeHandler={(e) =>
              setformData({ ...formData, description: e.target.value })
            }
            label="Description"
          />
        </div>
        {/* --------------------------------------------- */}
        <div className="company-form__section">
          <Input
            type="num"
            inputName="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            changeHandler={(e) =>
              setformData({ ...formData, quantity: e.target.value })
            }
            label="Quantity"
          />
        </div>
        {/* --------------------------------------------- */}
        <div className="form-column">
          <label htmlFor="price" className="text-comm">
            Price
          </label>
          <input
            className="form-input"
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleChargeRateChange(e)}
          />
        </div>
        {/* --------------------------------------------- */}
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
        {/* --------------------------------------------- */}
        <div className="company-form__section">
          <Input
            type="text"
            inputName="note"
            placeholder="Note"
            value={formData.note}
            changeHandler={(e) =>
              setformData({ ...formData, note: e.target.value })
            }
            label="Note"
          />
        </div> 
        </div>
      </div>
    </div>
{/* -------------------------------------------------------------------------------------- */}
    <div className="form-row">
      <div className="table-hover charge-buttons">
        <button
          className="button-save__change"
          style={{ marginRight: "10px" }}
          type="button"
          onClick={createCharge}
        >
          Create Charge
        </button>
        <button
          className="button-cancel"
          type="button"
          onClick={() => onCancel(false)}
        >
          Cancel
        </button>
      </div>
      {/* ++++++++++++++++++++++++++++++++ */}
<Table
        data={charges}
        columns={[
          "Status",
          "type",
          "Type 2",
          "Description",
          "Prepaid",
          "Quantity",
          "Price",
          "Amount",
          "Tax Code",
          "Note",
          "Currency",
        ]}
        onSelect={() => {}} // Make sure this line is correct
        selectedRow={{}}
        onDelete={() => {}}
        onEdit={() => {}}
        onAdd={() => {}}
        showOptions={false}
      />
      {/* -------------------------------------------------------------------------- */}

    </div>
  </div>
      {/* <div className="company-form__section">
        {showInvoicesChargesCreationForm && (
          <InvoicesChargesCreationForm
            onCancel={setshowInvoicesChargesCreationForm}
            invoices={invoices}
            setInvoices={setInvoices}
            charges={charges}
            setcharges={setcharges}
          ></InvoicesChargesCreationForm>
        )}
      </div> */}
       {/* -------------------------------------------------------------------------- */}
       {/* <div className="company-form__section">
        
        {showInvoicesAccountCreationForm && (
          <InvoicesAccountCreationForm
            onCancel={setshowInvoicesAccountCreationForm}
            invoices={invoices}
            setInvoices={setInvoices}
          ></InvoicesAccountCreationForm>
        )}
      </div> */}
    </form>
    <div className="containerr">
      <div className="cont-one">
        <div className="company-form__section">
          <label htmlFor="division" className="form-label">
            Division:
          </label>
          <select
            id="paidAd"
            className="form-input"
            value={formData.paidAd}
            onChange={(e) =>
            setformData({ ...formData, paidAd: e.target.value })
          }
          >
            <option value="prepaid">Prepaid</option>
            <option value="collect">Collect</option>
          </select>
        </div>

        
      </div>{/* -------------------------END ONE---------------------------------- */}
      <div className="cont-two">
      <div className="form-column">
          <label htmlFor="amount" className="text-comm">
            Amount:
          </label>
          <input
            className="form-input"
            type="number"
            readOnly
            value={resultado}
            id="amount"
            onChange={(e) =>
              setformData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <div className="form-column">
          <label htmlFor="tax" className="text-comm">
            Tax:
          </label>
          <input
            className="form-input"
            type="number"
            readOnly
            id="amount"
            value={formData.tax}
            onChange={(e) =>
              setformData({ ...formData, tax: e.target.value })
            }
          />
        </div>


        <p>Resultado: {resultado}</p>

        <div className="form-column">
          <label htmlFor="tota" className="text-comm">
          Total Amount:
          </label>
          <input
            className="form-input"
            type="number"
            readOnly
            id="tota"
            value={resultado}
            onChange={(e) =>
              setformData({ ...formData, tota: e.target.value })
            }
          />
        </div>
        <div className="form-column">
          <label htmlFor="amountDue" className="text-comm">
          Amount Due:
          </label>
          <input
            className="form-input"
            type="number"
            readOnly
            id="amountDue"
            value={resultado}
            onChange={(e) =>
              setformData({ ...formData, amountDue: e.target.value })
            }
          />
        </div>
      </div>{/* -------------------------END TWO---------------------------------- */}
            
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
            Invoices{creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"}  Invoice. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};


invoiceCreationForm.propTypes = {
  Invoices: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onInvoicesDataChange: propTypes.func,
};

invoiceCreationForm.defaultProps = {
  Invoices: {},
  closeModal: null,
  creating: false,
  onInvoicesDataChange: null,
};

export default invoiceCreationForm;  

