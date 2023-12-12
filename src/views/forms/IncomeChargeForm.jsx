import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import CurrenciesService from "../../services/CurrencyService";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import Input from "../shared/components/Input";

const IncomeChargeForm = ({
  onCancel,
  charges,
  setcharges,
  commodities,
  consignee,
  agent,
  shipper,
  editing,
  charge,
}) => {
  // Define state variables for form inputs

  const [currencies, setcurrencies] = useState([]);
  const [itemsAndServices, setitemsAndServices] = useState([]);
  const [internalID, setinternalID] = useState(0);
  const formFormat = {
    type: "income",
    charge: "",
    currency: "",
    applyTo: "",
    applyBy: "weight",
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
    status: 15,
    description: "",
  };

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
    onCancel(true);
    const body = {
      id: internalID,
      ...formData,
      quantity: 1,
    };

    if (editing) {
      const indexToEdit = charges.findIndex((comm) => comm.id == charge.id);
      const copy = [...charges];
      copy[indexToEdit] = body;
      setcharges(copy);
    } else {
      setcharges([...charges, body]);
      setinternalID(internalID + 1);
    }
  };

  useEffect(() => {
    if (editing) {
      const formFormat = {
        type: charge.type,
        charge: charge.charge,
        currency: charge.currency,
        applyTo: charge.applyTo,
        applyBy: charge.applyBy,
        paidAs: charge.paidAs,
        numberOfPieces: charge.numberOfPieces,
        grossWeight: charge.grossWeight,
        weightUnit: charge.weightUnit,
        rateCharge: charge.rateCharge,
        grossVolume: charge.grossVolume,
        volumeUnit: charge.volumeUnit,
        chargeableWeight: charge.chargeableWeight,
        totalAmount: charge.totalAmount,
        show: charge.show,
        status: charge.status,
        description: charge.description,
      };
      setformData(formFormat);
    }
    console.log();
  }, []);

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
      <h3>Income Charge Form</h3>
      <div className="form-row">
        <div className="form-column">
          <label htmlFor="charge" className="text-comm">
            Charge
          </label>
          <select
            className="form-input"
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
          <label htmlFor="applyTo" className="text-comm">
            Apply to
          </label>
          <select
            id="applyTo"
            className="form-input"
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
          <label htmlFor="applyBy" className="text-comm">
            Apply by
          </label>
          <select
            id="applyBy"
            className="form-input"
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
        </div>
        <div className="form-column">
          <label htmlFor="currency" className="text-comm">
            Currency
          </label>
          <select
            id="currency"
            className="form-input"
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
          <label htmlFor="paidAs" className="text-comm">
            Paid as
          </label>
          <select
            id="paidAs"
            className="form-input"
            value={formData.paidAs}
            onChange={(e) =>
              setformData({ ...formData, paidAs: e.target.value })
            }
          >
            {/* Add options for paidAs */}
            <option value="prepaid">Prepaid</option>
            <option value="collect">Collect</option>
          </select>
          <label htmlFor="description" className="text-comm">
            Description:
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
      </div>
      <div className="form-row">
        <div className="form-column ">
          <label htmlFor="numberOfPieces" className="text-comm">
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
            className="form-input"
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
          <label htmlFor="grossWeight" className="text-comm">
            Gross Weight
          </label>
          <div className="input-space">
            <input
              className="with-space"
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
              className="add-select"
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
          <label htmlFor="grossVolume" className="text-comm">
            Gross Volume
          </label>
          <div className="input-space">
            <input
              className="with-space"
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
              className="add-select"
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
          <label htmlFor="chargeableWeight" className="text-comm">
            Chargeable Weight (vlb)
          </label>
          <input
            style={{ backgroundColor: "lightgray" }}
            className="form-input"
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
          <label htmlFor="rateCharge" className="text-comm">
            Rate Charge
          </label>
          <input
            className="form-input"
            type="number"
            id="rateCharge"
            value={formData.rateCharge}
            onChange={(e) => handleChargeRateChange(e)}
          />
        </div>
        <div className="form-column">
          <label htmlFor="totalAmount" className="text-comm">
            Total Amount
          </label>
          <input
            className="form-input"
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
