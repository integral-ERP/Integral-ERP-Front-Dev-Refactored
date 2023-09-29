import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommoditiesService from "../../services/CommoditiesService";
const CommodityCreationForm = ({ onCancel, commodities, setCommodities }) => {
  const formFormat = {
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    volumetricWeight: 0,
    chargedWeight: 0,
    description: ""
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  
  const [internalID, setinternalID] = useState(0);
  
  const addCommodity = () => {
    const body= {
      id: internalID,
      length: formData.length,
      height: formData.height,
      width: formData.width,
      weight: formData.weight,
      volumetricWeight: formData.volumetricWeight,
      chargedWeight: formData.volumetricWeight,
      description: ""
      // TODO: add fields for volumetric weight and charged weight
    }
    setCommodities([...commodities, body])
    console.log(commodities);
  }

  useEffect(() => {
    console.log(formData);
    if(formData.height && formData.width && formData.length){
      const volWeight = ((formData.height * formData.width * formData.length) / 166).toFixed(0);
      const ratedWeight = formData.volumetricWeight >= formData.weight ? formData.volumetricWeight : formData.weight;
      setformData({...formData, volumetricWeight: volWeight, chargedWeight: ratedWeight});
    }
  }, [formData.height, formData.length, formData.width]);
  

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
            <input type="number" className="form-comm" aria-label="" value={formData.length}
              onChange={(e) =>
                setformData({ ...formData, length: e.target.value })
              }/>
            <span className="input-group-text num-com">in</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Width:</label>
          <div className="input-group ">
            <input type="number" className="form-comm" aria-label="" value={formData.width}
              onChange={(e) =>
                setformData({ ...formData, width: e.target.value })
              }/>
            <span className="input-group-text num-com">in</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Height:</label>
          <div className="input-group ">
            <input type="number" className="form-comm" aria-label="" value={formData.height}
              onChange={(e) =>
                setformData({ ...formData, height: e.target.value })
              }/>
            <span className="input-group-text num-com">in</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm">Volume:</label>
          <div className="input-group ">
            <input type="number" className="form-comm" aria-label="" value={formData.volumetricWeight} readOnly/>
            <span className="input-group-text num-com">in3</span>
          </div>
        </div>
        <div className="form-column-create">
          <label className="text-comm__space">Chargeable Weight:</label>
          <div className="input-group ">
            <input type="number" className="form-comm" aria-label="" value={formData.chargedWeight}
              onChange={(e) =>
                setformData({ ...formData, ratedWeight: e.target.value })
              }/>
            <span className="input-group-text num-com">lb</span>
          </div>          
        </div>
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
          <strong>
            Commodity created successfully!
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
            Error creating Commodity. Please try
            again
          </strong>
        </Alert>
      )}
    </div>
  );
};

CommodityCreationForm.propTypes = {
  onCancel: propTypes.func,
  commodities: propTypes.array
};

CommodityCreationForm.defaultProps = {
  onCancel: null,
  commodities: []
};

export default CommodityCreationForm;
