import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import CurrenciesService from "../../services/CurrencyService";
import Input from "../shared/components/Input";
const IncomeChargeForm = ({ onCancel, charges, setcharges }) => {
  // Define state variables for form inputs
  const [charge, setCharge] = useState("");
  const [currencies, setcurrencies] = useState([]);
  const [applyTo, setApplyTo] = useState("");
  const [applyBy, setApplyBy] = useState("");
  const [currency, setCurrency] = useState("");
  const [paidAs, setPaidAs] = useState("");
  const [showInDocuments, setShowInDocuments] = useState(false);
  // Define state variables for additional form inputs
  const [numberOfPieces, setNumberOfPieces] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kgs"); // Default to kgs
  const [rateCharge, setRateCharge] = useState("");
  const [grossVolume, setGrossVolume] = useState("");
  const [volumeUnit, setVolumeUnit] = useState("ft3"); // Default to ft3
  const [chargeableWeight, setChargeableWeight] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    setShowInDocuments(!showInDocuments);
  };

  useEffect(() => {
    CurrenciesService.getCurrencies()
      .then((response) => {
        setcurrencies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  return (
    <div className="income-charge-form">
      <h2>Income Charge Form</h2>
      <div className="form-row">
        <div className="form-column">
          <label htmlFor="charge" className="centered-label">
            Charge
          </label>
          <select
            id="charge"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
          >
            {/* Add options for charge */}
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <label htmlFor="applyTo" className="centered-label">
            Apply to
          </label>
          <select
            id="applyTo"
            value={applyTo}
            onChange={(e) => setApplyTo(e.target.value)}
          >
            {/* Add options for applyTo */}
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <label htmlFor="applyBy" className="centered-label">
            Apply by
          </label>
          <select
            id="applyBy"
            value={applyBy}
            onChange={(e) => setApplyBy(e.target.value)}
          >
            {/* Add options for applyBy */}
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
        <div className="form-column">
          <label htmlFor="currency" className="centered-label">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="">Select a currency</option>
            {Object.entries(currencies).map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode} - {currencyName}
              </option>
            ))}
          </select>
          <label htmlFor="paidAs" className="centered-label">
            Paid as
          </label>
          <select
            id="paidAs"
            value={paidAs}
            onChange={(e) => setPaidAs(e.target.value)}
          >
            {/* Add options for paidAs */}
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
          <Input
            type="checkbox"
            inputName="showInDocuments"
            placeholder=""
            readonly={false}
            value={false}
            label="Show in Documents"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-column">
          <label htmlFor="numberOfPieces" className="centered-label">
            No. of Pieces
          </label>
          <input
            className="short-input"
            type="number"
            id="numberOfPieces"
            value={numberOfPieces}
            onChange={(e) => setNumberOfPieces(e.target.value)}
          />
        </div>
        <div className="form-column">
          <label htmlFor="grossWeight" className="centered-label">
            Gross Weight
          </label>
          <div style={{ display: "flex" }}>
            <input
              className="short-input"
              type="number"
              id="grossWeight"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
            />
            <select
              className="short-input"
              id="weightUnit"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            >
              <option value="kgs">kgs</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div className="form-column">
          <label htmlFor="rateCharge" className="centered-label">
            Rate Charge
          </label>
          <select
            className="medium-input"
            id="rateCharge"
            value={rateCharge}
            onChange={(e) => setRateCharge(e.target.value)}
          >
            {/* Add options for rateCharge */}
            <option value="max-charge">Max. Charge</option>
            <option value="min-charge">Min. Charge</option>
          </select>
        </div>
      </div>
      <div className="form-row">
          <div className="form-column">
            <label htmlFor="grossVolume" className="centered-label">
              Gross Volume
            </label>
            <div style={{ display: "flex" }}>
              <input
                className="short-input"
                type="number"
                id="grossVolume"
                value={grossVolume}
                onChange={(e) => setGrossVolume(e.target.value)}
              />
              <select
                className="medium-input"
                id="volumeUnit"
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value)}
              >
                <option value="ft3">ft3</option>
                <option value="m3">m3</option>
              </select>
            </div>
          </div>
          <div className="form-column">
            <label htmlFor="chargeableWeight" className="centered-label">
              Chargeable Weight (vlb)
            </label>
            <input
              className="short-input"
              type="number"
              id="chargeableWeight"
              value={chargeableWeight}
              onChange={(e) => setChargeableWeight(e.target.value)}
            />
          </div>
          <div className="form-column">
            <label htmlFor="totalAmount" className="centered-label">
              Total Amount
            </label>
            <input
              className="short-input"
              type="number"
              id="totalAmount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
        </div>
      <div className="form-row">
        <div className="form-column">
          <button
            className="generic-button btn btn-primary"
            style={{ marginRight: "10px" }}
            type="button"
          >
            Create Charge
          </button>
          <button
            className="generic-button btn btn-primary"
            type="button"
            onClick={() => onCancel(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

IncomeChargeForm.propTypes = {
  onCancel: propTypes.func,
};

IncomeChargeForm.defaultProps = {
  onCancel: null,
};

export default IncomeChargeForm;
