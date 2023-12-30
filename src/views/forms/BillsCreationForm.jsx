import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import AsyncSelect from "react-select/async";
import Table from "../shared/components/Table";

import BillsService from "../../services/BillsService";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import VendorService from "../../services/VendorService";
import PaymentTermsService from "../../services/PaymentTermsService";
import BillsChargeForm from "./BillsChargeForm";


const BillsCreationForm = ({
  bill,
  closeModal,
  creating,
  onbillDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("bil");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");

  const [accountByOptions, setAccountByOptions] = useState([]);
  const [accounst, setaccounts] = useState([]);
  const [carriVerndorByOptions, setcarriVerndoByOptions] = useState([]);
  const [payment, setpayments] = useState([]);

  const [paymentByOptions, setPaymentByOptions] = useState([]);
  const [issuedby, setVendorCarriby] = useState(null);

  const [showBillsCreationForm, setshowBillsCreationForm] = useState(false)
  const [showBillEditForm, setshowBillEditForm] = useState(false);
  const [selectedBill, setselectedBill] = useState(null);  
  const [bills, setbills] = useState([]);
    

  const formFormat = {
    number: "",
    due: today,
    trasaDate: today,
    paymentById: "",
    paymentTermsByType: "",
    paymentTemr: "",
    accountById : "",
    accountByType : "",
    carriVerndorByName: "",
    carriVerndorById: "",
    status: "Open",
    bills: [],
  };

  const [formData, setFormData] = useState({ formFormat });

  useEffect(() => {
    console.log("Creating=", creating);
    console.log("Bill Terms=", bill);
    if (!creating && bill) {
      setbills(bill.billCharges)
      console.log("Editing Bill Terms...", bill);
      setFormData({
        number: bill.number || "",
        due: bill.due || "",
        trasaDate: bill.trasaDate,
        paymentById: bill.paymentById,
        paymentByDesc: bill.paymentByDesc,
        paymentTemr: bill.paymentTemr,
        accountById: bill.accountById,
        accountByType: bill.accountByType,
        carriVerndorByName: bill.carriVerndorByName,
        carriVerndorById : bill.carriVerndorById,
        billCharges : bill.billCharges,
        status: bill.status || "Open",
      });
    }
  }, [creating, bill]);

  // -------------------------------------------------------------

  const sendData = async () => {
    let rawData = {
      number: formData.number || "",
      due: formData.due,
      trasaDate: formData.trasaDate,
      //----------
      paymentById: formData.paymentById,
      paymentByDesc: formData.paymentByDesc,
      paymentTemr: formData.paymentTemr,
      accountById: formData.accountById,
      accountByType: formData.accountByType,
      carriVerndorByName : formData.carriVerndorByName,
      carriVerndorById : formData.carriVerndorById,
      billCharges: bills,
    };

    console.log("DATA = ", formData);
    const response = await (creating
      ? BillsService.createBill(rawData)
      : BillsService.updateBill(
          bill.id,
          rawData
        ));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Bill successfully created/updated:",
         response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onbillDataChange();
        setShowSuccessAlert(false);
        // window.location.reload();
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

 const fetchFormData = async () => {  
    const accoun        = (await ChartOfAccountsService.getChartOfAccounts()).data.results;
    const carriVerndo   = (await VendorService.getVendors()).data.results;
    const paiment         = (await PaymentTermsService.getPaymentTerms()).data.results
    // Function to add 'type' property to an array of objects
    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));
  
    // Add 'type' property to each array
    const accountWithType           = addTypeToObjects(accoun, "accounten-termn");
    const carriVerndorWithType      = addTypeToObjects(carriVerndo, "carri-Verndor");
    const paymentsWithType          = addTypeToObjects(paiment,"paiment-termn");
    // Merge the arrays
    const accountByOptions = [...accountWithType].filter(account=> account.typeChart=="Accouns Payable");
    const carriVerndorByOptions = [...carriVerndorWithType];
    const paymentByOptions = [...paymentsWithType];

    setAccountByOptions(accountByOptions);
    setcarriVerndoByOptions(carriVerndorByOptions);
    setPaymentByOptions(paymentByOptions);

  
  };
  useEffect(() => {
    fetchFormData();
  }, []);

  const handleAccountBySelection = async (event) => {
    const id = event.id;
    const typeChart = event.typeChart;
    const result = await ChartOfAccountsService.getChartOfAccountsId(id);
    console.log("RESULTADO CHART",result.typeChart) 
    setaccounts(result.data)
    setFormData({
      ...formData,
      accountById: id,
      accountByType: typeChart,
      
    });
    console.log("TYPE_CHART=", typeChart);
  };

//------------------------------------------------------------------------------------
  const handlePaymentBySelection = async (event) => {
    const id = event.id;
    const description = event.description;
    const result = await PaymentTermsService.getPaymentTermById(id);
    setpayments(result.data)
    setFormData({
      ...formData,
      paymentById: id,
      paymentByDesc: description,
    });
  };
//------------------------------------------------------------------------------------
  const handleVendorCarriBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await VendorService.getVendorByID(id);
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setVendorCarriby(result.data)
    setFormData({
      ...formData,
      carriVerndorById: id,
      carriVerndorByName: name,
      carriVerndorByInfo: info,
    });

    };

  // ---------------------------------------------
  const handleSelectBill = (bill) => {
    setselectedBill(bill);
  };

  const handleBillDelete = () => {
    const newBills = bills.filter(
      (com) => com.id != selectedBill.id
    );
    setbills(newBills);
  };
  const updateSelectedBill = (updatedInternalBills) => {
    const updatedBill = { ...selectedBill };
    updatedBill.internalBills = updatedInternalBills;
    setselectedBill(updatedBill);

    const index = bills.findIndex((com) => com.id == selectedBill.id);

    if(index != -1){
      const billsCopy = [...bills];
      billsCopy[index] = updatedBill;
      setbills(billsCopy);
    }

  
  };
  return (
    <div className="company-form">
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#bil"
            aria-selected={activeTab === "bil"}
            onClick={() => setActiveTab("bil")}
            role="tab"
          >
            Bill
          </a>
        </li>      
      </ul>
      <form
        className={`tab-pane fade ${
          activeTab === "bil" ? "show active" : ""
        } company-form__general-form`}
        id="bill"
        style={{ display: activeTab === "bil" ? "block" : "none" }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="number"
                placeholder="PNF123456"
                value={formData.number}
                changeHandler={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                label="Number"
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  className="font-right"
                  value={dayjs(formData.due)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      due: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Transation Date"
                  className="font-right"
                  value={dayjs(formData.trasaDate)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trasaDate: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <label htmlFor="account" className="form-label">
              Account:
              </label>
              <AsyncSelect
                id="account"
                value={accountByOptions.find(
                  (option) => option.id === formData.accountById)}
                onChange={(e) => {handleAccountBySelection(e);}}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={accountByOptions}
                getOptionLabel={(option) => option.name + " || " + " Accouns Payable "}
                getOptionValue={(option) => option.id}
              />
            </div>
          </div>{/* --------------------------------------------------------------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
              <label htmlFor="apply" className="form-label">
                Vendor:
              </label>
              <AsyncSelect
                id="apply"
                value={carriVerndorByOptions.find(
                  (option) => option.id === formData.carriVerndorById)}
                onChange={(e) => {handleVendorCarriBySelection(e);}}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={carriVerndorByOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
        {/* --------------------------------------------------------------------------------------- */}
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="carriVerndorByInfo"
                placeholder="Apply to..."
                value={formData.carriVerndorByInfo}
                readonly={true}
                label=""
              />
            </div>
            <div className="company-form__section">
              <label htmlFor="paymentTem" className="form-label">
              Payment Tems:
                </label>
                <AsyncSelect
                  id="paymentTem"
                  value={paymentByOptions.find(
                    (option) => option.id === formData.paymentById)}
                  onChange={(e) => {handlePaymentBySelection(e);}}
                  isClearable={true}
                  placeholder="Search and select..."
                  defaultOptions={paymentByOptions}
                  getOptionLabel={(option) => option.description}
                  getOptionValue={(option) => option.id}
                />
            </div>
          </div>
          <div className="company-form__section">
      <button
        type="button"
        className="button-addpiece"
        onClick={() =>
          setshowBillsCreationForm(!showBillsCreationForm)
        }
      >
        Add Piece
      </button>
      {showBillsCreationForm && (
        <BillsChargeForm
          onCancel={setshowBillsCreationForm}
          bills={bills}
          setBills={setbills}
        ></BillsChargeForm>
      )}
      {showBillEditForm && (
        <BillsChargeForm
          onCancel={setshowBillEditForm}
          bills={bills}
          setBills={setbills}
          bill={selectedBill}
          editing={true}
        ></BillsChargeForm>
      )}
      {selectedBill?.containsBills &&
        selectedBill.internalBills.map(
          (internalBill, index) => (
            <BillsChargeForm
              key={index}
              onCancel={() => {}}
              bills={selectedBill.internalBills}
              setBills={updateSelectedBill}
              bill={internalBill}
              editing={true}
            ></BillsChargeForm>
          )
        )}
    </div>
        </div> 
        <Table
        data={bills}
        columns={[
        "Status",
        "Description",
        "Prepaid",
        "Quantity",
        "Price",
        "Amount",
        "Tax Code",
        "Tax Rate",
        "Tax Amt",
        "Amt + Tax",
        // "Currency",
        "Options",
        ]}
        onSelect={handleSelectBill} // Make sure this line is correct
        onDelete={handleBillDelete}
        onEdit={() => {
          setshowBillEditForm(!showBillEditForm);
        }}
        onInspect={() => {
        }}
        onAdd={() => {}}
        showOptions={false}
      />
      
      </form>
    {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      
      <form
      
        className={`tab-pane fade ${
          activeTab === "event" ? "show active" : ""
        } company-form__general-form`}
        id="event"
        style={{ display: activeTab === "event" ? "block" : "none" }}
      >
       event
      </form>
      {/* ---------------------------------------------------------------------------- */}
      {/* <form
        className={`tab-pane fade ${
          activeTab === "attachment" ? "show active" : ""
        } company-form__general-form`}
        id="attachment"
        style={{ display: activeTab === "attachment" ? "block" : "none" }}
      >
       attachment
      </form> */}
      {/* ---------------------------------------------------------------------------- */}
      {/* <form
        className={`tab-pane fade ${
          activeTab === "note" ? "show active" : ""
        } company-form__general-form`}
        id="note"
        style={{ display: activeTab === "note" ? "block" : "none" }}
      >
       note
      </form> */}
      {/* ---------------------------------------------------------------------------- */}
      {/* <form
        className={`tab-pane fade ${
          activeTab === "internaNote" ? "show active" : ""
        } company-form__general-form`}
        id="internaNote"
        style={{ display: activeTab === "internaNote" ? "block" : "none" }}
      >
       internaNote
      </form> */}
      {/* ---------------------------------------------------------------------------- */}
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
            Bill Terms {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Bill Terms. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

BillsCreationForm.propTypes = {
  bill: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onbillDataChange: propTypes.func,
};

BillsCreationForm.defaultProps = {
  bill: {},
  closeModal: null,
  creating: false,
  onbillDataChange: null,
};

export default BillsCreationForm;
