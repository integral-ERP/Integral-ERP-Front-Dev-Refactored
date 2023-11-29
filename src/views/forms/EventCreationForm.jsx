import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EventCreationForm = ({ onCancel, events, setevents }) => {
  const formFormat = {
    dateTime: 0,
    type: 0,
    details: 0,
    location: 0,
    includeInTracking: false,
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [internalID, setinternalID] = useState(0);

  const addEvent = () => {
    const body = {
      id: internalID,
      creation_date: formData.dateTime,
      type: formData.type,
      details: formData.details,
      location: formData.location,
      includeInTracking: formData.includeInTracking,
    };
    setevents([...events, body]);
    console.log(events);
  };

  return (
    <div className="income-charge-form">
      <h3>Expense Charge Form</h3>

      <div>
        <div className="form-row">
          <div className="form-column-create">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Entry Date and Time"
                className="font-right"
                value={dayjs(formData.dateTime)}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    dateTime: dayjs(e).format("YYYY-MM-DDTHH:mm:ss"),
                  })
                }
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column-create">
            <label className="text-comm">Event Type:</label>
            <select name="eventType" id="eventType">
              <option value="arrivedDestination">Arrived at Destination</option>
              <option value="arrivedWarehouse">Arrived at Warehouse</option>
              <option value="arrivedWarehouseMIA">
                Arrived at Warehouse MIA
              </option>
              <option value="cargoPicked">Cargo has been picked</option>
              <option value="cargoScannedIn">Cargo scanned in</option>
              <option value="cargoScannedOut">Cargo scanned out</option>
              <option value="cargoStatusUpdate">Cargo status update</option>
              <option value="customsEntry">Customs Entry / Inicio Aduana</option>
              <option value="customsOnHold">Customs On-Hold</option>
              <option value="customsRelease">Customs Release / Liberación</option>
              <option value="deliveredToConsignee">Delivered to Consignee</option>
              <option value="entryStatusUpdate">Entry Status Update</option>
              <option value="externalTrackingUpdate">
                External Tracking Update
              </option>
              <option value="inTransit">In Transit</option>
              <option value="inBond">In Bond (7512)</option>
              <option value="originDocument">Origin Document</option>
              <option value="availablePickup">
                Package Available for Pickup
              </option>
              <option value="cancelled">Package Cancelled</option>
              <option value="delivered">Package Delivered</option>
              <option value="error">Package Error</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label htmlFor="details" className="text-comm">
            Details:
          </label>
          <input
            name="details"
            type="text"
            className="form-input"
            placeholder="Details..."
            value={formData.details}
            onChange={(e) => setformData({ ...formData, details: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-row">
          <div className="form-column-create">
            <label className="text-comm">Location:</label>
            <select name="eventType" id="eventType">
              <option value="arrivedDestination">Arrived at Destination</option>
              <option value="arrivedWarehouse">Arrived at Warehouse</option>
              <option value="arrivedWarehouseMIA">
                Arrived at Warehouse MIA
              </option>
              <option value="cargoPicked">Cargo has been picked</option>
              <option value="cargoScannedIn">Cargo scanned in</option>
              <option value="cargoScannedOut">Cargo scanned out</option>
              <option value="cargoStatusUpdate">Cargo status update</option>
              <option value="customsEntry">Customs Entry / Inicio Aduana</option>
              <option value="customsOnHold">Customs On-Hold</option>
              <option value="customsRelease">Customs Release / Liberación</option>
              <option value="deliveredToConsignee">Delivered to Consignee</option>
              <option value="entryStatusUpdate">Entry Status Update</option>
              <option value="externalTrackingUpdate">
                External Tracking Update
              </option>
              <option value="inTransit">In Transit</option>
              <option value="inBond">In Bond (7512)</option>
              <option value="originDocument">Origin Document</option>
              <option value="availablePickup">
                Package Available for Pickup
              </option>
              <option value="cancelled">Package Cancelled</option>
              <option value="delivered">Package Delivered</option>
              <option value="error">Package Error</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-column-create">
            <Input
              inputName="includeTracking"
              changeHandler={(e) =>
                setformData({ ...formData, includeInTracking: e.target.checked })
              }
              label="Include in Tracking"
              name="includeTracking"
              type="checkbox"
            ></Input>
                    <div className="table-hover charge-buttons">
          <button
            className="button-save pick "
            style={{ marginRight: "10px" }}
            type="button"
            onClick={addEvent}
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

EventCreationForm.propTypes = {
  onCancel: propTypes.func,
  events: propTypes.array,
};

EventCreationForm.defaultProps = {
  onCancel: null,
  events: [],
};

export default EventCreationForm;
