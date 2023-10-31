import { useState, useEffect } from "react";
import PackageTypeService from "../../services/PackageTypeService";

const RepackingForm = ({ commodities }) => {
  const [packTypes, setpackTypes] = useState([]);
  const formFormat = {
    package_type_id: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    volumetricWeight: 0,
    chargedWeight: 0,
    description: ""
  };
  const [formData, setformData] = useState(formFormat);

  useEffect(() => {
    PackageTypeService.getContainerTypes()
      .then((response) => {
        setpackTypes(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div>
        <label htmlFor="containerType">Container Type:</label>
        <select name="containerType" id="containerType" onChange={(e) => {setformData({...formData, package_type_id: e.target.value})}}>
          <option value="">Select an option</option>
          {packTypes.map((type) => {
            return (
              <option value={type.id} key={type.id}>
                {type.description}
              </option>
            );
          })}
        </select>
      </div>
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
            style={{width: '100%'}}
          />
      </div>
      <div>
        <select name="commodities" id="commodities" multiple>
            {commodities.map((item) => {
                return <option value={item.id} key={item.id}>{item.description}</option>
            })}
        </select>
      </div>
    </>
  );
};

export default RepackingForm;
