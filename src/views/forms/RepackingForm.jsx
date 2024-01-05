import { useState, useEffect } from "react";
import PackageTypeService from "../../services/PackageTypeService";

const RepackingForm = ({ commodities, setCommodities }) => {
  const [packTypes, setpackTypes] = useState([]);
  const [internalCommodities, setinternalCommodities] = useState([]);
  const formFormat = {
    package_type_id: "",
    package_type_description: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    volumetricWeight: 0,
    chargedWeight: 0,
    description: "",
    useInternalWeight: false
  };
  const [formData, setformData] = useState(formFormat);

  useEffect(() => {
    PackageTypeService.getPackageTypes()
      .then((response) => {
        setpackTypes(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (formData.height && formData.width && formData.length) {
      const volWeight = (
        (formData.height * formData.width * formData.length) /
        166
      );
  
      setformData(prevFormData => ({
        ...prevFormData,
        volumetricWeight: volWeight,
        chargedWeight: Math.max(volWeight, prevFormData.weight),
      }));
    }
  }, [formData.height, formData.length, formData.width, formData.weight]);


  const handleCommoditySelection = (e, commodityId) => {
    const isChecked = e.target.checked;

    // Update the selectedCommodities based on the checkbox change
    setinternalCommodities((prevCommodities) => {
        if (isChecked) {
            // If the checkbox is checked, add the commodity to the list
            console.log("ADDING COMMODITY: "  , [...prevCommodities, getCommodityById(commodityId)]);
            return [...prevCommodities, getCommodityById(commodityId)];
        } else {
            // If the checkbox is unchecked, remove the commodity from the list
            return prevCommodities.filter((item) => item.id !== commodityId);
        }
    });
};

// Helper function to get a commodity by its ID
const getCommodityById = (commodityId) => {
    return commodities.find((item) => item.id === commodityId);
};

const isAdded = (e) => {
  const id = e;
  const ids = internalCommodities.map((com) => String(com.id))
  console.log("IS CONTAINED: ", ids.includes(id));
  return ids.includes(id);
}

  const handleRepack = () => {
    let internalWeight = 0;
    if(formData.useInternalWeight){
      internalCommodities.forEach(element => {
        internalWeight += Number(element.weight);
      });
    }
    const selectedCommodityIds = internalCommodities.map( com => String(com.id))
    const filteredCommodities = commodities.filter((commodity) => {
      return !selectedCommodityIds.includes(String(commodity.id));
    });

    const newCommodity = {
      ...formData,
      weight: internalWeight, 
      containsCommodities: true,
      internalCommodities: internalCommodities,
    };

    // Add the new commodity to the commodities array.
    setCommodities([...filteredCommodities, newCommodity]);

    // Reset the form to its initial state.
    setformData(formFormat);
    setinternalCommodities([]);
    // You can also perform any other actions or validations here if needed.
  };
  

  return (
    <div className="income-charge-form">
      <h3>Repacking Form</h3>
      <div>
        <label htmlFor="containerType">Container Type:</label>
        <select name="containerType" id="containerType" onChange={(e) => {setformData({...formData, package_type_id: e.target.value, package_type_description: e.target.options[e.target.selectedIndex].text})}}>
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
              disabled={formData.useInternalWeight}
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
          <label htmlFor="">use internal commodity weight</label>
          <input type="checkbox" value={formData.useInternalWeight} onChange={(e) => {setformData({...formData, useInternalWeight: e.target.checked})}}/>
      </div>
      <div>
      {commodities.map((item) => (
    <div key={item.id}>
        <input
            type="checkbox"
            id={`commodity-${item.id}`}
            value={item.id}
            checked={internalCommodities.map((com) => com.id).includes(item.id)}
            onChange={(e) => handleCommoditySelection(e, item.id)}
        />
        <label htmlFor={`commodity-${item.id}`}>{item.description}</label>
    </div>
))}
      </div>
      <div>
        <button type="button" className="button-save" onClick={handleRepack}>Repack</button>
      </div>
    </div>
  );
};

export default RepackingForm;
