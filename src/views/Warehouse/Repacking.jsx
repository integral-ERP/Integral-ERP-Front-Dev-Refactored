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
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <div
                  className="repacking-container"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p>
                    {selectedCommodity?.description
                      ? selectedCommodity.description
                      : ""}
                  </p>
                  <p>
                    Weight:{" "}
                    {selectedCommodity?.weight ? selectedCommodity.weight : 0}
                  </p>
                  <p>
                    Height:{" "}
                    {selectedCommodity?.height ? selectedCommodity.height : 0}
                  </p>
                  <p>
                    Width:{" "}
                    {selectedCommodity?.width ? selectedCommodity.width : 0}
                  </p>
                  <p>
                    Length:{" "}
                    {selectedCommodity?.length ? selectedCommodity.length : 0}
                  </p>
                  <p>
                    Volumetric Weight:{" "}
                    {selectedCommodity?.volumetricWeigth
                      ? selectedCommodity.volumetricWeigth
                      : 0}
                  </p>
                  <p>
                    Chargeable Weight:{" "}
                    {selectedCommodity?.chargeableWeight
                      ? selectedCommodity.chargeableWeight
                      : 0}
                  </p>
                  <p>
                    Repacked:{" "}
                    {selectedCommodity?.containsCommodities ? "Yes" : "No"}
                  </p>
                  {selectedCommodity?.internalCommodities.map((com) => {
                    return (
                      <div key={com.id} className="card">
                        <p>{com.description}</p>
                        <p>Weight: {com.weight}</p>
                        <p>Height: {com.height}</p>
                        <p>Width: {com.width}</p>
                        <p>Length: {com.length}</p>
                        <p>Volumetric Weight: {com.volumetricWeight}</p>
                        <p>Chargeable Weight: {com.chargedWeight}</p>

                      </div>
                    );
                  })}
                </div>
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Repacking;
