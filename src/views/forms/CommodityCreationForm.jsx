import { useState, useEffect, useRef } from "react";
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
  locationEnabled,
  setEditingComodity,
}) => {
  const formFormat = {
    id: "",
    length: "",
    height: "",
    width: "",
    weight: "",
    volumetricWeight: "",
    chargedWeight: "",
    description: "",
    internalCommodities: [],
    containsCommodities: false,
    locationId: "",
    locationCode: ""
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [locations, setlocations] = useState([]);
  const [internalID, setinternalID] = useState(0);

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  
  //added validation of commodities for change border color in inputs
  const ValidationCommodities= !commodities || commodities.length === 0;

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
      // Update the specific commodity being edited
      setCommodities((prevCommodities) => {
        return prevCommodities.map((prevCommodity) =>
        prevCommodity.id === commodity.id ? { ...formData, internalCommodities: prevCommodity.internalCommodities } : prevCommodity   // Update the internalCommodities array
        );
      });
      setEditingComodity(false);
    } else {
      setShowCommoditiesCreationForm(true)
     setCommodities([...commodities, body]);
      setinternalID(internalID + 1);
    }
    setformData(formFormat);
  };

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (formData.height && formData.width && formData.length) {
      const volWeight = (
        (formData.height * formData.width * formData.length) /
        166
      ).toFixed(2);
  
      setformData(prevFormData => ({
        ...prevFormData,
        volumetricWeight: volWeight,
        chargedWeight: Math.max(volWeight, prevFormData.weight),
      }));
    }
  }, [formData.height, formData.length, formData.width, formData.weight]);
  
  /* added comidity y editing */
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
        locationCode: commodity.locationCode,
      };
      setformData(formFormat);
    }
  }, [commodity, editing]);
  

  useEffect(() => {
    LocationService.getLocations()
    .then(response => {
      setlocations(response.data.results);
    })
  }, []);

  useEffect(() => {
    
  }, [formData.weight]);

  return (
    <div className="income-charge-form">
      {/* <h3>Commodity Creation Form</h3> */}
      <div className="row w-100 mb">

        <div className="col-3">
          <label className="text-comm">Length:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              ref={input1Ref}
              value={formData.length}
              onKeyDown={(e) => handleKeyDown(e, input2Ref)}
              onChange={(e) =>
                setformData({ ...formData, length: e.target.value })
              }
              /* added style for validation commodities */
              style={{
                borderColor: ValidationCommodities ? 'green' : '',
                boxShadow: ValidationCommodities ? '0 0 1px 0.2px blue' : '',
              }}
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>

        <div className="col-3">
          <label className="text-comm">Height:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              ref={input2Ref}
              onKeyDown={(e) => handleKeyDown(e, input3Ref)}
              value={formData.height}
              onChange={(e) =>
                setformData({ ...formData, height: e.target.value })
              }
              /* added style for validation commodities */
              style={{
                borderColor: ValidationCommodities ? 'green' : '',
                boxShadow: ValidationCommodities ? '0 0 1px 0.2px blue' : '',
              }}
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>

        <div className="col-3">
          <label className="text-comm">Width:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              ref={input3Ref}
              aria-label=""
              value={formData.width}
              onKeyDown={(e) => handleKeyDown(e, input4Ref)}
              onChange={(e) =>
                setformData({ ...formData, width: e.target.value })
              }
              /* added style for validation commodities */
              style={{
                borderColor: ValidationCommodities ? 'green' : '',
                boxShadow: ValidationCommodities ? '0 0 1px 0.2px blue' : '',
              }}
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>

        <div className="col-3">
          <label className="text-comm">Weigth:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.weight}
              ref={input4Ref}
              onKeyDown={(e) => handleKeyDown(e, input5Ref)}
              onChange={(e) =>
                setformData({ ...formData, weight: e.target.value })
              }
              /* added style for validation commodities */
              style={{
                borderColor: ValidationCommodities ? 'green' : '',
                boxShadow: ValidationCommodities ? '0 0 1px 0.2px blue' : '',
              }}
            />
            <span className="input-group-text num-com">lb</span>
          </div>
        </div>

        <div className="row w-100 mb-3" style={{ padding: "0 0 0 1.5rem" }}>
          <label htmlFor="description" className="text-comm description-form">
          Charge Description:
          </label>
          <input
            name="description"
            type="text"
            className="form-input"
            ref={input7Ref}
            placeholder="Description..."
            value={formData.description}
            onChange={(e) =>
              setformData({ ...formData, description: e.target.value })
            }
            
          />
        </div>

        {locationEnabled && (<>
        <label htmlFor="location" className="text-comm" style={{marginTop: "10px"}}>Location:</label>
        <select name="location" id="location" onChange={(e) => {setformData({...formData, locationId: e.target.value, locationCode: e.target.options[e.target.selectedIndex].getAttribute("data-key")})}}>
          <option value="">Select an option</option>
          {locations.map(location => {
            return (<option key={location.id} value={location.id} data-key={location.code}>{location.code}</option>)})}
        </select>
        </>)}

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

/* added prop editing */
CommodityCreationForm.propTypes = {
  onCancel: propTypes.func,
  commodities: propTypes.array,
  editing: propTypes.bool,
};

CommodityCreationForm.defaultProps = {
  onCancel: null,
  commodities: [],
  editing: false,
};

export default CommodityCreationForm;