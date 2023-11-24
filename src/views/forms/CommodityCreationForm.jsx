import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommoditiesService from "../../services/CommoditiesService";
import LocationService from "../../services/LocationService";
const CommodityCreationForm = ({
 onCancel,
  commodities,
  setCommodities, setShowCommoditiesCreationForm,
  editing,
  commodity,
}) => {
  const formFormat = {
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    volumetricWeight: 0,
    chargedWeight: 0,
    description: "",
    locationId: "",
    locationCode: ""
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [locations, setlocations] = useState([]);
  const [internalID, setinternalID] = useState(0);

  const addCommodity = () => {
    const body = {
      id: internalID,
      length: formData.length,
      height: formData.height,
      width: formData.width,
      weight: formData.weight,
      volumetricWeight: formData.volumetricWeight,
      chargedWeight: formData.volumetricWeight,
      description: formData.description,
      internalCommodities: [],
      containsCommodities: false,
      locationId: formData.locationId,
      locationCode: formData.locationCode
    };
    if (editing) {
      const indexToEdit = commodities.findIndex(
        (comm) => comm.id == commodity.id
      );
      const copy = [...commodities];
      copy[indexToEdit] = body;
      setCommodities(copy);
    } else {
      setShowCommoditiesCreationForm(true)
    setCommodities([...commodities, body]);
      setinternalID(internalID + 1);
    }
    console.log(commodities);
  };

  useEffect(() => {
    console.log(formData);
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
        id: commodity.id,
        weight: commodity.weight,
        length: commodity.length,
        width: commodity.width,
        height: commodity.height,
        volumetricWeight: commodity.volumetricWeight,
        chargedWeight: commodity.chargedWeight,
        description: commodity.description,
        locationId: commodity.locationId,
        locationCode: commodity.locationCode
      };
      setformData(formFormat);
    }
  }, []);

  useEffect(() => {
    LocationService.getLocations()
    .then(response => {
      setlocations(response.data.results);
    })
  }, []);

  return (
    <div className="income-charge-form">
      <h3>Commodity Creation Form</h3>
      <div className="form-row">
        <div className="form-column-create">
          <label className="text-comm">Weigth:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.weight}
              onChange={(e) =>
                setformData({ ...formData, weight: e.target.value })
              }
            />
            <span className="input-group-text num-com">lb</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Length:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.length}
              onChange={(e) =>
                setformData({ ...formData, length: e.target.value })
              }
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Width:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.width}
              onChange={(e) =>
                setformData({ ...formData, width: e.target.value })
              }
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Height:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.height}
              onChange={(e) =>
                setformData({ ...formData, height: e.target.value })
              }
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Volume:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.volumetricWeight}
              readOnly
            />
            <span className="input-group-text num-com">in3</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm__space">Chargeable Weight:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.chargedWeight}
              onChange={(e) =>
                setformData({ ...formData, ratedWeight: e.target.value })
              }
            />
            <span className="input-group-text num-com">lb</span>
          </div>
        </div>
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
          style={{ width: "100%" }}
        />
        <label htmlFor="location" className="text-comm" style={{marginTop: "10px"}}>Location:</label>
        <select name="location" id="location" onChange={(e) => {setformData({...formData, locationId: e.target.value, locationCode: e.target.options[e.target.selectedIndex].getAttribute("data-key")})}}>
          <option value="">Select an option</option>
          {locations.map(location => {
            return (<option key={location.id} value={location.id} data-key={location.code}>{location.code}</option>)})}
        </select>
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

CommodityCreationForm.propTypes = {
  onCancel: propTypes.func,
  commodities: propTypes.array,
};

CommodityCreationForm.defaultProps = {
  onCancel: null,
  commodities: [],
};

export default CommodityCreationForm;
