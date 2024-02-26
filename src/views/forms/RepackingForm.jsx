import { useState, useEffect } from "react";
import PackageTypeService from "../../services/PackageTypeService";

const RepackingForm = ({ commodities, setCommodities }) => {
  const [packTypes, setpackTypes] = useState([]);
  const [internalCommodities, setinternalCommodities] = useState([]);
  const [id, setId] = useState(0);
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
  //added unrepack
  const [repackedItems, setRepackedItems] = useState([]);
  const [selectedRepackId, setSelectedRepackId] = useState(null);


  useEffect(() => {
    PackageTypeService.getPackageTypes()
      .then((response) => {
        setpackTypes(response.data.results);
      })
      .catch((error) => {
        
        
      });
  }, []);

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


  const handleCommoditySelection = (e, commodityId) => {
    const isChecked = e.target.checked;

    setinternalCommodities((prevCommodities) => {
      const updatedCommodities = isChecked
        ? [...prevCommodities, getCommodityById(commodityId)]
        : prevCommodities.filter((item) => item.id !== commodityId);

      setSelectedRepackId(isChecked ? commodityId : null); // Almacena el ID del empaquetado seleccionado
      return updatedCommodities;
    });
  };


const getCommodityById = (commodityId) => {
    return commodities.find((item) => item.id === commodityId);
};
//added unrepack
const handleUNRepack = () => {
  if (selectedRepackId) {
    const remainingRepackedItems = repackedItems.filter((item) => item.id !== selectedRepackId);

    const repackedItem = repackedItems.find((item) => item.id === selectedRepackId);

    if (repackedItem) {
      const remainingCommodities = commodities.filter(
        (commodity) => commodity.id !== repackedItem.id
      );
     
      const unpackedCommodities = [...repackedItem.internalCommodities];
    
      setCommodities([...unpackedCommodities, ...remainingCommodities]);

      setRepackedItems(remainingRepackedItems);

      // Limpia el ID del empaquetado seleccionado
      setSelectedRepackId(null);
    }
  }
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
      return !selectedCommodityIds.includes(String(commodity.id));
    });

    const newCommodity = {
      ...formData,
      id: `repacked-${id}`,
      weight: internalWeight, 
      containsCommodities: true,
      internalCommodities: internalCommodities,
    };


    setCommodities([...filteredCommodities, newCommodity]);
    setId(id + 1);


    setformData(formFormat);
    setinternalCommodities([]);

    //added things for repack
    console.log("Repacking successful formdata", formData);
    console.log("Repacking successful commodities",commodities);
    setRepackedItems((prevRepackedItems) => [...prevRepackedItems, { ...newCommodity }]);
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
          
        </div>
        <div className="useinter">
          <table id="tableware" style={{width: '60%', border:'2px solid black'}}>
            <tr>
              <td><label className="textpack" htmlFor="">use internal commodity weight</label></td>
              <td ><input type="checkbox" value={formData.useInternalWeight} onChange={(e) => {setformData({...formData, useInternalWeight: e.target.checked})}}/></td>
            </tr>
          </table>
        </div>
        {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}
      <div  style={{margin: '1rem',}}>
        {commodities.map((item) => (
        <div key={item.id} cl className="position-table">
          <table id="tableware">
            <tr>
              <td className="checkrepack">
                <input
                    type="checkbox"
                    id={`commodity-${item.id}`}
                    value={item.id}
                    checked={internalCommodities.map((com) => com.id).includes(item.id)}
                    onChange={(e) => handleCommoditySelection(e, item.id)}
                />
              </td>
              <td className="textpack">
                <label className="textpack" htmlFor={`commodity-${item.id}`}>{item.description}  -  {item.length}x{item.width}x{item.height}</label>
              </td>
            </tr>
          </table>
        </div>
        ))}
      </div>
      {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}
      <div>
        <button type="button" className="button-save" onClick={handleRepack}>Repack</button>
      </div>
      {/* added unrepack button */}
      <div>
        <button type="button" className="button-save" onClick={handleUNRepack }>UNRepack</button>
      </div>
    </div>
  );
};

export default RepackingForm;
