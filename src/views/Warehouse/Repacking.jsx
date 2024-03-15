import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";
import PickupService from "../../services/PickupService";
import ReceiptService from "../../services/ReceiptService";
import ModalForm from "../shared/components/ModalForm";
import { useModal } from "../../hooks/useModal";
const Repacking = () => {
  const { hideShowSlider } = useContext(GlobalContext);
  const [pickups, setPickups] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [repackedCommodities, setRepackedCommodities] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [isOpen, openModal, closeModal] = useModal(false);
  const columns = [
    "Parent Order",
    "Piece Quantity",
    "Description",
    " Length",
    " Height",
    " Width",
    " Weight",
    "Location",
    " Volumetric Weight",
    " Chargeable Weight",
    "Repack Options",
  ];

  const fetchData = async () => {
    try {
      const pickupOrders = (await PickupService.getPickups()).data.results;
      const receiptOrders = (await ReceiptService.getReceipts()).data.results;
      setPickups(pickupOrders);
      setReceipts(receiptOrders);
      const commoditiesExtracted = [];
      let pickIds = 80000;
      let receiptIds = 9000;

      pickupOrders.forEach((pickupOrder) => {
        const { commodities } = pickupOrder;
        const repackedCommodities = commodities.filter(
          (commodity) => commodity.containsCommodities === true
        );

        const commoditiesWithParentId = repackedCommodities.map((commodity) => {
          const updatedCommodity = {
            ...commodity,
            comesFrom: "PickUp Order",
            parentId: pickupOrder.id,
            parent: "PickUp Order No. " + pickupOrder.number,
            commodityAmount: commodity.internalCommodities.length,
            originalId: commodity.id,
            id: pickIds,
          };

          pickIds++;

          return updatedCommodity;
        });
        commoditiesExtracted.push(...commoditiesWithParentId);

        return {
          ...pickupOrder,
          commodities: commoditiesWithParentId,
        };
      });

      receiptOrders.forEach((receiptOrder) => {
        const { commodities } = receiptOrder;
        const repackedCommodities = commodities.filter(
          (commodity) => commodity.containsCommodities === true
        );
        const commoditiesWithParentId = repackedCommodities.map((commodity) => {
          const updatedCommodity = {
            ...commodity,
            comesFrom: "Warehouse Receipt",
            parentId: receiptOrder.id,
            parent: "Warehouse Receipt No. " + receiptOrder.number,
            commodityAmount: commodity.internalCommodities.length,
            originalId: commodity.id,
            id: receiptIds,
          };

          receiptIds++;

          return updatedCommodity;
        });
        commoditiesExtracted.push(...commoditiesWithParentId);

        return {
          ...receiptOrder,
          commodities: commoditiesWithParentId,
        };
      });

      setRepackedCommodities(commoditiesExtracted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectCommodity = (commodity) => {
    setSelectedCommodity(commodity);
  };

  const handleUnpackCommodity = () => {
    if (selectedCommodity) {
      const internalCommodities = selectedCommodity.internalCommodities;
      if (selectedCommodity.comesFrom === "PickUp Order") {
        const order = pickups.find(
          (pickup) => pickup.id == selectedCommodity.parentId
        );
        order.commodities = order.commodities.filter(
          (item) => item.id !== selectedCommodity.originalId
        );
        order.commodities = [...order.commodities, ...internalCommodities];
        let repacked = false;
        order.commodities.forEach((item) => {
          if (item.containsCommodities) {
            repacked = true;
          }
        });
        order.containsCommodities = repacked;
        PickupService.updatePickup(order.id, order);
      }
      if (selectedCommodity.comesFrom === "Warehouse Receipt") {
        const order = receipts.find(
          (pickup) => pickup.id == selectedCommodity.parentId
        );
        order.commodities = order.commodities.filter(
          (item) => item.id !== selectedCommodity.originalId
        );
        order.commodities = [...order.commodities, ...internalCommodities];
        let repacked = false;
        order.commodities.forEach((item) => {
          if (item.containsCommodities) {
            repacked = true;
          }
        });
        order.containsCommodities = repacked;
        ReceiptService.updateReceipt(order.id, order);
      }
      const newCommodities = repackedCommodities.filter(
        (item) => item.id !== selectedCommodity.id
      );
      setRepackedCommodities(newCommodities);
    }
  };

  const handleInspectCommodity = () => {
    if (selectedCommodity !== null) {
      openModal();
    } else {
      alert("Please select a Commodity to inspect");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPickupOrdersButton && !isTableRow) {
        setSelectedCommodity(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <>
      <div className="dashboard__layout">
        <div className="dashboard__sidebar">
          <div>
            <Sidebar />
          </div>

          <div
            className="content-page"
            style={
              !hideShowSlider
                ? { marginLeft: "21rem", width: "calc(100vw - 250px)" }
                : { marginInline: "auto" }
            }
          >
            <Table
              data={repackedCommodities}
              columns={columns}
              onSelect={handleSelectCommodity}
              selectedRow={selectedCommodity}
              onEdit={handleUnpackCommodity}
              onInspect={handleInspectCommodity}
              title="Repacked Commodities"
              setData={setRepackedCommodities}
              importEnabled={false}
            />

            {selectedCommodity !== null && (
             
             <div className="repacking-container">
             <div className="main-commodity">
               <p className="item-description">
                 {selectedCommodity.description}
               </p>
               <p className="item-info">
                 Weight: {selectedCommodity.weight}
               </p>
               <p className="item-info">
                 Height: {selectedCommodity.height}
               </p>
               <p className="item-info">Width: {selectedCommodity.width}</p>
               <p className="item-info">
                 Length: {selectedCommodity.length}
               </p>
               <p className="item-info">
                 Volumetric Weight: {selectedCommodity.volumetricWeight}
               </p>
               <p className="item-info">
                 Chargeable Weight: {selectedCommodity.chargedWeight}
               </p>
               {/* <p className="item-info">Repacked?: {selectedCommodity.containsCommodities ? "Yes" : "No"}</p> */}
             </div>
             {/*  fix the repacking show internalCommodities for edition */}
             {selectedCommodity.internalCommodities &&
               selectedCommodity.internalCommodities.map((com) => (
                <div key={com.id} className="card" style={{ display: 'flex', textAlign: 'left', fontSize: '15px' }}>
                   <p className="item-description">{com.description}</p>
                   <p className="item-info">Weight: {com.weight}</p>
                   <p className="item-info">Height: {com.height}</p>
                   <p className="item-info">Width: {com.width}</p>
                   <p className="item-info">Length: {com.length}</p>
                   <p className="item-info">
                     Volumetric Weight: {com.volumetricWeight}
                   </p>
                   <p className="item-info">
                     Chargeable Weight: {com.chargedWeight}
                   </p>
                   {/* <p className="item-info">Repacked?: {com.containsCommodities ? "Yes" : "No"}</p> */}
                 </div>
               ))}
           </div>
              
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Repacking;

