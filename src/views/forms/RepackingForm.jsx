import { useState, useEffect } from "react";
import PackageTypeService from "../../services/PackageTypeService";

const RepackingForm = ({ commodities, setCommodities }) => {
  const [packTypes, setpackTypes] = useState([]);
  const [internalCommodities, setinternalCommodities] = useState([]);
  const formFormat = {
    package_type_id: "",
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
    PackageTypeService.getContainerTypes()
      .then((response) => {
        setpackTypes(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCommoditySelection = (e) => {
    const selectedCommodityIds = Array.from(e.target.selectedOptions, (option) => option.value);
    const selectedCommodities = commodities.filter((item) => selectedCommodityIds.includes(item.id + ''));
    console.log("LISTA DE IDS", selectedCommodityIds, "LISTA DE OBJETOS", selectedCommodities, "ORIGINALES", commodities);
    setinternalCommodities(selectedCommodities);
    console.log("COMMODITIES INTERNAS:", internalCommodities);
  };

  const handleRepack = () => {
    let internalWeight = 0;
    if(formData.useInternalWeight){
      internalCommodities.forEach(element => {
        internalWeight += Number(element.weight);
      });
    }

    const selectedCommodityIds = internalCommodities.map( com => String(com.id))

    const filteredCommodities = commodities.filter((commodity) => {
      console.log("COMMODITIES SELECCIONADAS", selectedCommodityIds, "COMMODITY ACTUAL", commodity, "CONDICION", selectedCommodityIds.includes(String(commodity.id)));
      return !selectedCommodityIds.includes(String(commodity.id));
    });

  console.log("FILTERED COMMODITIES:", filteredCommodities);

    const newCommodity = {
      ...formData,
      weight: formData.weight + internalWeight, 
      containsCommodities: true,
      internalCommodities: internalCommodities,
    };

    // Add the new commodity to the commodities array.
    setCommodities([...filteredCommodities, newCommodity]);

    // Reset the form to its initial state.
    setformData(formFormat);
    setinternalCommodities([]);
    console.log("NEW COMMODITIES:", commodities);
    // You can also perform any other actions or validations here if needed.
  };
  

  return (
    <div className="income-charge-form">
      <h3>Repacking Form</h3>
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
          <label htmlFor="">use internal commodity weight</label>
          <input type="checkbox" value={formData.useInternalWeight} onChange={(e) => {setformData({...formData, useInternalWeight: e.target.checked})}}/>
      </div>
      <div>
        <select name="commodities" id="commodities" multiple onChange={(e) => handleCommoditySelection(e)}>
            {commodities.map((item) => {
                return <option value={item.id} key={item.id}>{item.description}</option>
            })}
        </select>
      </div>
      <div>
        <button type="button" onClick={handleRepack}>Repack</button>
      </div>
    </div>
  );
};

export default RepackingForm;
