import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import CurrenciesService from "../../services/CurrencyService";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import Input from "../shared/components/Input";

const ExpenseChargeForm = ({
  onCancel,
  charges,
  setcharges,
  commodities,
  consignee,
  agent,
  shipper,
}) => {
  // Define state variables for form inputs

  console.log("Consignee:", consignee, "Agent:", agent, "Shipper:", shipper);
  const [currencies, setcurrencies] = useState([]);
  const [itemsAndServices, setitemsAndServices] = useState([]);
  const formFormat = {
    type: "expense",
    charge: "",
    currency: "",
    applyTo: "",
    applyBy: "",
    paidAs: "",
    numberOfPieces: 0,
    grossWeight: 0,
    weightUnit: "lbs",
    rateCharge: "",
    grossVolume: 0,
    volumeUnit: "ft3",
    chargeableWeight: 0,
    totalAmount: 0,
    show: false,
    description: "",
  };
  console.log(commodities);
  const [formData, setformData] = useState(formFormat);
  useEffect(() => {
    CurrenciesService.getCurrencies()
      .then((response) => {
        setcurrencies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });

    ItemsAndServicesService.getItemsAndServices()
      .then((response) => {
        setitemsAndServices(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching Items and Services:", error);
      });
  }, []);

  useEffect(() => {
    // Calcula los valores iniciales utilizando la variable commodities
    let initialNumberOfPieces = 0;
    let initialGrossWeight = 0;
    let initialGrossVolume = 0;
    let initialChargeableWeight = 0;

    if (commodities && commodities.length > 0) {
      commodities.forEach((commodity) => {
        initialNumberOfPieces += 1; // Puedes ajustar esto según tus necesidades
        initialGrossWeight += parseFloat(commodity.weight);
        initialGrossVolume += commodity.volumetricWeight;
        initialChargeableWeight += parseFloat(commodity.chargedWeight);
      });
    }

    // Setea los valores iniciales en el estado del formulario
    setformData({
      ...formData,
      numberOfPieces: initialNumberOfPieces,
      grossWeight: initialGrossWeight,
      grossVolume: initialGrossVolume,
      chargeableWeight: initialChargeableWeight,
    });

    // Resto del código del useEffect (obtención de monedas y servicios)
  }, [commodities]);

  const createCharge = () => {
    const charge = {
      ...formData,
    };
    setcharges([...charges, charge]);
    console.log(charge);
  };

  const handleChargeRateChange = (e) => {
    let unit = 0;
    const rate = e.target.value;
    if (formData.applyBy === "pieces") {
      unit = formData.numberOfPieces;
    }
    if (formData.applyBy === "weight") {
      unit = formData.grossWeight;
    }
    if (formData.applyBy === "volume") {
      unit = formData.grossVolume;
    }
    if (formData.applyBy === "container") {
      unit = formData.numberOfPieces;
    }
    const total = unit * rate;
    setformData({ ...formData, rateCharge: rate, totalAmount: total });
  };

  return (
    <div className="income-charge-form">
      <h2>Expense Charge Form</h2>
      <div className="form-row">
        <div className="form-column">
          <label htmlFor="charge" className="centered-label">
            Freight Service Class
          </label>
          <select
            id="charge"
            value={formData.charge}
            onChange={(e) =>
              setformData({ ...formData, charge: e.target.value })
            }
          >
            {/* Add options for charge */}
            <option value="">Select an option</option>
            {itemsAndServices.map((code) => (
              <option key={code.id} value={code.id}>
                {code.code}
              </option>
            ))}
          </select>
          <label htmlFor="applyTo" className="centered-label">
            Apply to
          </label>
          <select
            id="applyTo"
            value={formData.applyTo}
            onChange={(e) =>
              setformData({ ...formData, applyTo: e.target.value })
            }
          >
            {/* Add options for applyTo */}
            <option value="">Select an option</option>
            {consignee && (
              <option value={consignee.id} data-key="consignee">
                {consignee.name}
              </option>
            )}
            {agent && (
              <option value={agent.id} data-key="agent">
                {agent.name}
              </option>
            )}
            {shipper && (
              <option value={shipper.id} data-key="shipper">
                {shipper.name}
              </option>
            )}
          </select>
        </div>
        <div className="form-column">
          <label htmlFor="currency" className="centered-label">
            Currency
          </label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) =>
              setformData({ ...formData, currency: e.target.value })
            }
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
            value={formData.paidAs}
            onChange={(e) =>
              setformData({ ...formData, paidAs: e.target.value })
            }
          >
            {/* Add options for paidAs */}
            <option value="prepaid">Prepaid</option>
            <option value="collect">Collect</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="description" className="centered-label">
          Description:
        </label>
        <input
          name="description"
          type="text"
          placeholder="Description..."
          value={formData.description}
          onChange={(e) =>
            setformData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="form-row">
        <label htmlFor="applyBy" className="centered-label">
          Apply By
        </label>
        <select
          id="applyBy"
          value={formData.applyBy}
          onChange={(e) =>
            setformData({ ...formData, applyBy: e.target.value })
          }
        >
          {/* Add options for applyBy */}
          <option value="weight">Weight</option>
          <option value="pieces">Pieces</option>
          <option value="volume">Volume</option>
          <option value="container">Container</option>
        </select>
        <div className="form-column">
          <label htmlFor="numberOfPieces" className="centered-label">
            No. of Pieces
          </label>
          <input
            style={{
              backgroundColor: `${
                formData.applyBy === "pieces" ||
                formData.applyBy === "container"
                  ? ""
                  : "lightgray"
              }`,
            }}
            className="short-input"
            type="number"
            id="numberOfPieces"
            readOnly={
              formData.applyBy !== "pieces" && formData.applyBy !== "container"
            }
            value={formData.numberOfPieces}
            onChange={(e) =>
              setformData({ ...formData, numberOfPieces: e.target.value })
            }
          />
        </div>
        <div className="form-column">
          <label htmlFor="grossWeight" className="centered-label">
            Gross Weight
          </label>
          <div style={{ display: "flex" }}>
            <input
              className="short-input"
              style={{
                backgroundColor: `${
                  formData.applyBy === "weight" ? "" : "lightgray"
                }`,
                marginRight: "0px",
              }}
              type="number"
              id="grossWeight"
              readOnly={formData.applyBy !== "weight"}
              value={formData.grossWeight}
              onChange={(e) =>
                setformData({ ...formData, grossWeight: e.target.value })
              }
            />
            <select
              className="short-input-2"
              id="weightUnit"
              value={formData.weightUnit}
              onChange={(e) =>
                setformData({ ...formData, weightUnit: e.target.value })
              }
            >
              <option value="kgs">kgs</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        <div className="form-column">
          <label htmlFor="grossVolume" className="centered-label">
            Gross Volume
          </label>
          <div style={{ display: "flex" }}>
            <input
              className="short-input"
              style={{
                backgroundColor: `${
                  formData.applyBy === "volume" ? "" : "lightgray"
                }`,
                marginRight: "0px",
              }}
              type="number"
              id="grossVolume"
              readOnly={formData.applyBy !== "volume"}
              value={formData.grossVolume}
              onChange={(e) =>
                setformData({ ...formData, grossVolume: e.target.value })
              }
            />
            <select
              className="short-input-2"
              id="volumeUnit"
              value={formData.volumeUnit}
              onChange={(e) =>
                setformData({ ...formData, volumeUnit: e.target.value })
              }
            >
              <option value="ft3">ft3</option>
              <option value="m3">m3</option>
            </select>
          </div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-column">
          <label htmlFor="chargeableWeight" className="centered-label">
            Chargeable Weight (vlb)
          </label>
          <input
            style={{ backgroundColor: "lightgray" }}
            className="short-input"
            type="number"
            readOnly
            id="chargeableWeight"
            value={formData.chargeableWeight}
            onChange={(e) =>
              setformData({ ...formData, chargeableWeight: e.target.value })
            }
          />
        </div>
        <div className="form-column">
          <label htmlFor="rateCharge" className="centered-label">
            Rate Charge
          </label>
          <input
            className="short-input"
            type="number"
            id="rateCharge"
            value={formData.rateCharge}
            onChange={(e) => handleChargeRateChange(e)}
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
            readOnly
            value={formData.totalAmount}
            onChange={(e) =>
              setformData({ ...formData, totalAmount: e.target.value })
            }
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-column">
          <Input
            type="checkbox"
            inputName="showInDocument"
            value={formData.show}
            changeHandler={(e) =>
              setformData({ ...formData, show: e.target.checked })
            }
            label="Show in document"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-column">
          <button
            className="generic-button btn btn-primary"
            style={{ marginRight: "10px" }}
            type="button"
            onClick={createCharge}
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

ExpenseChargeForm.propTypes = {
  onCancel: propTypes.func,
};

ExpenseChargeForm.defaultProps = {
  onCancel: null,
};

export default ExpenseChargeForm;
