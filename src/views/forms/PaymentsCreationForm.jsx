import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import AsyncSelect from "react-select/async";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Table from "../shared/components/Table";
//-----------------------------------------
import PaymentsService from "../../services/PaymentsService";
import CustomerService from "../../services/CustomerService";
import InvoicesService from "../../services/InvoicesService";
import { result } from "lodash";
// import { result } from "lodash";
// import { get } from "lodash";

const PaymentsCreationForm = ({
  payments,
  closeModal,
  creating,
  onpaymentDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [Payments, setPayments] = useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [customerByOptions, setCustomerByOptions] = useState([]);
  const [customer, setcustomers] = useState([]);
  const today = dayjs().format("YYYY-MM-DD");

  const [seleccion, setSeleccion] = useState('');

  // const [valorBuscado, setValorBuscado] = useState('');
  const formFormat = {
    customerById: "",
    customerByName: "",
    amountReceived: 0.0,
    trasaDate: today,
    number: "",
    memo:"",
    prueba:"",
  };

  const [formData, setformData] = useState({ formFormat });
//------------------------------------------------------------------------------------
  const handleCustomerBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await CustomerService.getCustomerById(id);
    setcustomers(result.data)
    setformData({
      ...formData,
      customerById: id,
      customerByName: name,
    });
    setSeleccion(result);
    // console.log('Valor seleccionado:', id, "+",name);
    // const Payments = (await InvoicesService.getInvoices()).data.results;
    // console.log("Payments=", Payments); 
    // const existe = Payments.includes(name);
    const Payments = (await InvoicesService.getInvoicesAccountID(id)).data;
    setPayments(Payments);
    console.log("Payments=", Payments[0]); 
  };
//--------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (!creating && payments) {
      setformData({
        customerById: payments.customerById,
        customerByName: payments.customerByName,
        trasaDate: payments.trasaDate,
        number: payments.number,
        amountReceived: payments.amountReceived,
        memo:payments.memo,
      });
    }
  }, [creating, payments]);


  // -------------------------------------------------------------

  const sendData = async () => {
    let rawData = {
      customerById: formData.customerById,
      customerByName: formData.customerByName,
      amountReceived: formData.amountReceived,
      trasaDate: formData.trasaDate,
      number: formData.number,
      memo: formData.memo,
    };
    console.log("DATA = ", formData);
    const response = await (creating
      ? PaymentsService.createPayment(rawData)
      : PaymentsService.updatePayment(
          payments.id,
          rawData
        )); 
    //-------------------------------------
    if (response.status >= 200 && response.status <= 300) {
      console.log(
        "Payments Lists successfully created/updated:",
         response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onpaymentDataChange();
        setShowSuccessAlert(false);
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------------------------
  const fetchFormData = async () => {  
    const customer= (await CustomerService.getCustomers()).data.results;
    
   // Function to add 'type' property to an array of objects
    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));
  
    // Add 'type' property to each array
    const customerWithType  = addTypeToObjects(customer,"customer");

    // Merge the arrays
    const customerByOptions = [...customerWithType];
 
    setCustomerByOptions(customerByOptions);
  };

  useEffect(() => {
    fetchFormData();
  }, []);



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
            Accounting Transaction
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
        
         
         
        -----------------------------------------------------------------------------
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="customer" className="form-label">
              Account:
              </label>
              <AsyncSelect
                id="customer"
                value={customerByOptions.find(
                  (option) => option.id === formData.customerById)}
                onChange={(e) => {handleCustomerBySelection(e);}}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={customerByOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <Input
                type="number"
                inputName="amountReceived"
                value={formData.amountReceived}
                changeHandler={(e) =>
                  setformData({ ...formData, amountReceived: e.target.value })
                }
                label="Amount Received"
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Transaction Date"
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
          </div>
          <div className="cont-two">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="number"
                placeholder="Number"
                value={formData.number}
                changeHandler={(e) =>
                  setformData({ ...formData, number: e.target.value })
                }
                label="Check Number"
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <Input
                type="text"
                inputName="memo"
                placeholder="Memo"
                value={formData.memo}
                changeHandler={(e) =>
                  setformData({ ...formData, memo: e.target.value })
                }
                label="Memo"
              />
            </div>
          </div>
        </div>
        <Table
          data={Payments}
          columns={[
              "Name",
              "Number",
              "Account Type",
              "type Chart",
              "Transaction Date",
              "Due Date",
              "Apply",
              "Payment Temse",
          ]}
          // onSelect={handleSelectCommodity} // Make sure this line is correct
          // selectedRow={selectedCommodity}
          // onDelete={handleCommodityDelete}
          // onEdit={() => {
          //   setshowCommodityEditForm(!showCommodityEditForm);
          // }}
          // onInspect={() => {
          //   setshowCommodityInspect(!showCommodityInspect);
          // }}
          onAdd={() => {}}
          showOptions={false}
        />
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
            Payment Lists {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Payment Lists. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

PaymentsCreationForm.propTypes = {
  payments: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onpaymentDataChange: propTypes.func,
};

PaymentsCreationForm.defaultProps = {
  payments: {},
  closeModal: null,
  creating: false,
  onpaymentDataChange: null,
};

export default PaymentsCreationForm;



