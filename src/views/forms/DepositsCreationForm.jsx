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

import DepositsService from "../../services/DepositsService";


const DepositsCreationForm = ({
  deposit,
  closeModal,
  creating,
  ondepositDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");

  const [bankAccount, setbankAccount] = useState([]);

  const [showDepositsCreationForm, setshowDepositsCreationForm] = useState(false)
  const [showDepositEditForm, setshowDepositEditForm] = useState(false);
  const [selectedDeposit, setselectedDeposit] = useState(null);
  const [deposits, setdeposits] = useState([]);
  const formFormat = {
    bankAccount: "",
    trasaDate: today,
    memo: "",
  };

  const [formData, setFormData] = useState({ formFormat });

  useEffect(() => {
    
    
    if (!creating && deposit) {
      setdeposits(deposit.depositCharges)
      
      setFormData({
        bankAccount: deposit.bankAccount,
        trasaDate: deposit.trasaDate,
        memo: deposit.memo,
      });
    }
  }, [creating, deposit]);

  // -------------------------------------------------------------

  const sendData = async () => {
    let rawData = {
      bankAccount: formData.bankAccount,
      date: formData.trasaDate,
      memo: formData.memo,
    };

    
    //-------------------------------------
    const response = await (creating
      ? DepositsService.createDeposit(rawData)
      : DepositsService.updateDeposit(
        deposit.id,
        rawData
      ));

    if (response.status >= 200 && response.status <= 300) {
      
        "Prueba successfully created/updated:",
        response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        ondepositDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }
  };

  // ---------------------------------------------
  const handleSelectDeposit = (deposit) => {
    setselectedDeposit(deposit);
  };

  const handleDepositDelete = () => {
    const newDeposits = deposits.filter(
      (com) => com.id != selectedDeposit.id
    );
    setdeposits(newDeposits);
  };
  const updateSelectedDeposit = (updatedInternalDeposits) => {
    const updatedDeposit = { ...selectedDeposit };
    updatedDeposit.internalDeposits = updatedInternalDeposits;
    setselectedDeposit(updatedDeposit);

    const index = deposits.findIndex((com) => com.id == selectedDeposit.id);

    if (index != -1) {
      const depositsCopy = [...deposits];
      depositsCopy[index] = updatedDeposit;
      setdeposits(depositsCopy);
    }
  };

  const handlebankAccount = (bankAccount) => {
    setbankAccount(bankAccount);
    setFormData({ ...formData, bankAccount: bankAccount });
  };
  return (
    <div className="company-form">
      <div className="creation creation-container w-100">
        <div className="row w-100">
          <div className="col-12 text-start">
            <div className="form-label_name"><h3>Deposit</h3><span></span> </div>

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

            <div className="company-form__section">
              <label htmlFor="bankAccount" className="form-label">
                Bank Account:
              </label>
              <select
                id="bankAccount"
                className="form-input"
                value={formData.bankAccount}
                onChange={(e) => handlebankAccount(e.target.value)}
              >
                <option value="">Select a Bank</option>
                <option value="Bank Acc - Chase 685285053">Bank Acc - Chase 685285053</option>
              </select>
            </div>

            <div className="company-form__section">
              <Input
                type="text"
                inputName="memo"
                placeholder="Memo"
                value={formData.memo}
                changeHandler={(e) =>
                  setFormData({ ...formData, memo: e.target.value })
                }
                label="Memo"
              />
            </div>
          </div>
          <div className="company-form__section">

            {showDepositsCreationForm && (
              <DepositsChargeForm
                onCancel={setshowDepositsCreationForm}
                deposits={deposits}
                setdeposits={setdeposits}
              ></DepositsChargeForm>
            )}
            {showDepositEditForm && (
              <DepositsChargeForm
                onCancel={setshowDepositEditForm}
                deposits={deposits}
                setdeposits={setdeposits}
                deposit={selectedDeposit}
                editing={true}
              ></DepositsChargeForm>
            )}
            {selectedDeposit?.containsDeposits &&
              selectedDeposit.internalDeposits.map(
                (internalDeposit, index) => (
                  <DepositsChargeForm
                    key={index}
                    onCancel={() => { }}
                    deposits={selectedDeposit.internalDeposits}
                    setdeposits={updateSelectedDeposit}
                    deposit={internalDeposit}
                    editing={true}
                  ></DepositsChargeForm>
                )
              )}
          </div>
        </div>
        </div>

        <Table
          // data={deposits}
          columns={[
            "Deposited",
            "Entity",
            "Date",
            "Amount",
            "Number",
            "Division",
          ]}
          onSelect={handleSelectDeposit} // Make sure this line is correct
          onDelete={handleDepositDelete}
          onEdit={() => {
            setshowDepositEditForm(!showDepositEditForm);
          }}
          onInspect={() => {
          }}
          onAdd={() => { }}
          showOptions={false}
        />

    

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
            Deposit Terms {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Deposit Terms. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

DepositsCreationForm.propTypes = {
  deposit: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  ondepositDataChange: propTypes.func,
};

DepositsCreationForm.defaultProps = {
  deposit: {},
  closeModal: null,
  creating: false,
  ondepositDataChange: null,
};

export default DepositsCreationForm;
