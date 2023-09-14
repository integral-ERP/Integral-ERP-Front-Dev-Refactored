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
    ratedWeight: 0,
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
      chargedWeight: formData.chargedWeight
      // TODO: add fields for volumetric weight and charged weight
    }
    setCommodities([...commodities, body])
    console.log(commodities);
  }

  const sendDataCommodity = async () => {
    

    const response = await CommoditiesService.createCommodity(body);
      

    if (response.status >= 200 && response.status <= 300) {
      console.log("Commodity successfully created/updated:", response.data);
      // TODO: push response.data into current pieces array data to show in table 
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } else {
      console.log("Something went wrong:", response);
      setShowErrorAlert(true);
    }
  }

  useEffect(() => {
    console.log(formData);
    if(formData.height && formData.width && formData.length){
      console.log("Hola");
      const volWeight = ((formData.height * formData.width * formData.length) / 1728).toFixed(2);
      setformData({...formData, volumetricWeight: volWeight});
      console.log(volWeight);
    }
  }, [formData.height, formData.length, formData.width]);
  

  return (
    <div className="income-charge-form">
      <h2>Commodity Creation Form</h2>
      <div className="form-row">
        <div className="form-column">
          <label className="centered-label">Weigth:</label>
          <div className="input-group ">
            <input
              type="number"
              className="form-control"
              aria-label=""
              value={formData.weight}
              onChange={(e) =>
                setformData({ ...formData, weight: e.target.value })
              }
            />
            <span className="input-group-text">lb</span>
          </div>
        </div>
        <div className="form-column ">
          <label className="centered-label">Length:</label>
          <div className="input-group ">
            <input type="number" className="form-control" aria-label="" value={formData.length}
              onChange={(e) =>
                setformData({ ...formData, length: e.target.value })
              }/>
            <span className="input-group-text">in</span>
          </div>
        </div>
        <div className="form-column ">
          <label className="centered-label">Width:</label>
          <div className="input-group ">
            <input type="number" className="form-control" aria-label="" value={formData.width}
              onChange={(e) =>
                setformData({ ...formData, width: e.target.value })
              }/>
            <span className="input-group-text">in</span>
          </div>
        </div>
        <div className="form-column ">
          <label className="centered-label">Height:</label>
          <div className="input-group ">
            <input type="number" className="form-control" aria-label="" value={formData.height}
              onChange={(e) =>
                setformData({ ...formData, height: e.target.value })
              }/>
            <span className="input-group-text">in</span>
          </div>
        </div>
        <div className="form-column ">
          <label className="centered-label">Volumetric Weight:</label>
          <div className="input-group ">
            <input type="number" className="form-control" aria-label="" value={formData.volumetricWeight} readOnly/>
            <span className="input-group-text">in3</span>
          </div>
        </div>
        <div className="form-column ">
          <label className="centered-label">Charged Weight:</label>
          <div className="input-group ">
            <input type="number" className="form-control" aria-label="" value={formData.ratedWeight}
              onChange={(e) =>
                setformData({ ...formData, ratedWeight: e.target.value })
              }/>
            <span className="input-group-text">lb</span>
          </div>
          <div className="form-row" style={{ marginTop: "20px" }}>
            <div className="form-column">
              <button
                className="generic-button btn btn-primary"
                style={{ marginRight: "10px" }}
                type="button"
                onClick={addCommodity}
              >
                <i className="fas fa-check-circle"></i>
              </button>
              <button
                className="generic-button btn btn-primary"
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
