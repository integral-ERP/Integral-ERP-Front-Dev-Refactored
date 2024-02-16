import { useState, useEffect, useContext } from "react";

import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PickupOrderCreationForm from "../forms/PickupOrderCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PickupService from "../../services/PickupService";
import Sidebar from "../shared/components/SideBar";
import ReceiptCreationForm from "../forms/ReceiptCreationForm";
import ReleaseService from "../../services/ReleaseService";
import { GlobalContext } from "../../context/global"



const Pickup = () => {
  const { hideShowSlider } = useContext(GlobalContext)
  const [pickupOrders, setpickupOrders] = useState([]);
  const [releaseOrders, setReleaseOrders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [
    isOpenReceiptCreation,
    openModalReceiptCreation,
    closeModalReceiptCreation,
  ] = useModal(false);
  const [selectedPickupOrder, setSelectedPickupOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);

  const columns = [
    "Status",
    "Number",
    "Date",
    "Ship Date",
    "Delivery Date",
    "Pickup Name",
    "Pickup Address",
    "Delivery Name",
    "Delivery Address",
    "Pieces",
    // "Weight",
    "Carrier Name",
    "Carrier Address",
    "PRO Number",
    "Tracking Number",
    "Invoice Number",
    "Purchase Order number",
    "View PDF",
  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {


      const contextMenu = document.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(e.target)) {

        setShowContextMenu(false);
      }
    };


    document.addEventListener("click", handleDocumentClick);


    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showContextMenu]); // Only re-add the event listener when showContextMenu changes
 


  const updatePickupOrders = (url = null) => {
    PickupService.getPickups(url)
      .then((response) => {
        const newPickupOrders = response.data.results.filter((pickupOrder) => {
          const pickupOrderId = pickupOrder.id;
          return !pickupOrders.some(
            (existingPickupOrder) => existingPickupOrder.id === pickupOrderId
          );
        });

        setpickupOrders([...pickupOrders, ...newPickupOrders].reverse());
        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });

      ReleaseService.getReleases(url)
      .then((response) => {
        setReleaseOrders((response.data.results).reverse());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!initialDataFetched) {
      updatePickupOrders();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      const number = pickupOrders[0]?.number || 0;
     setcurrentPickupNumber(number);
    }
  }, [pickupOrders]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatePickupOrders(nextPageURL);
      }
    });

    const lastRow = document.querySelector(".table-row:last-child");
    if (lastRow) {
      observer.observe(lastRow);
    }

    return () => {

      observer.disconnect();
    };
  }, [nextPageURL]);

  const handlePickupOrdersDataChange = () => {
    updatePickupOrders();
  };

  const handleSelectPickupOrder = (PickupOrder) => {
    setSelectedPickupOrder(PickupOrder);
  };

  const handleEditPickupOrders = () => {
    
    if (selectedPickupOrder) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a Pickup Order to edit.");
    }
  };

  useEffect(() => {
    
  }, [selectedPickupOrder])
  

  const handleAddPickupOrder = () => {
    openModal();
  };

  const handleDeletePickupOrder = () => {
    if (selectedPickupOrder) {
      PickupService.deletePickup(selectedPickupOrder.id)
        .then((response) => {
          if (response.status == 204) {
            const newPickupOrders = pickupOrders.filter(
              (order) => order.id !== selectedPickupOrder.id
            );
            setpickupOrders(newPickupOrders);
            setShowSuccessAlert(true);
            releaseOrders.forEach((release) => {
              if (release.warehouse_receipt && String(release.warehouse_receipt) === String(selectedPickupOrder.id)){
                ReleaseService.deleteRelease(release.id);
              }
            })
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);

          } else {
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 3000);
          }
        })
        .catch((error) => {
          
        });
    } else {
      alert("Please select a Pickup Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      if (!isPickupOrdersButton && !isTableRow && !createWarehouseReceipt && !isEdit) {
        
        setSelectedPickupOrder(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  },);

  useEffect(() => {
    if (createWarehouseReceipt) {
      openModalReceiptCreation();
    }
  }, [createWarehouseReceipt]);

  const seteWarehouse = () => {
    if(selectedPickupOrder){
      setCreateWarehouseReceipt(true)
    } else {
     alert("Please select a pickup order to continue.");
    }
  }

  const setInTransit = async () => {
    if(selectedPickupOrder){
      const updatedPickuporder = {...selectedPickupOrder, status: 6};
      const response = (await PickupService.updatePickup(selectedPickupOrder.id, updatedPickuporder));
      if (response.status === 200){
        window.location.reload(true);

      }
    }else{
      alert("Please select a pickup order to continue.");
    }
  }

  const setDelivered = async () => {
    if(selectedPickupOrder){
      const updatedPickuporder = {...selectedPickupOrder, status: 9};
      const response = (await PickupService.updatePickup(selectedPickupOrder.id, updatedPickuporder));
      if (response.status === 200){
        window.location.reload(true);

      }
    }else{
      alert("Please select a pickup order to continue.");
    }
  }

  const handleCancel = () => {
    
  }

  const contextMenuOptions = [
    {
      label: "Create Warehouse Receipt",
      handler: seteWarehouse,
    },
    // {
    //   label: "Set/Reset In Transit",
    //   handler: setInTransit,
    // },
    // {
    //   label: "Set/Reset Delivered",
    //   handler: setDelivered,
    // },
  ];

  return (
    <>
      <div className="dashboard__layout">
        <div className="dashboard__sidebar">
          <div  style={{ pointerEvents: isOpen ? "none" : undefined }}>
            <Sidebar />
          </div>

          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              data={pickupOrders}
              columns={columns}
              onSelect={handleSelectPickupOrder} // Make sure this line is correct
              selectedRow={selectedPickupOrder}
              onDelete={handleDeletePickupOrder}
              onEdit={handleEditPickupOrders}
              onAdd={handleAddPickupOrder}
              title="Pick-up Orders"
              setData={setpickupOrders}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              contextMenuPosition={contextMenuPosition}
              setShowContextMenu={setShowContextMenu}
              contextMenuOptions={contextMenuOptions}
              contextService={PickupService}
              importEnabled={false}
              createWarehouseReceipt={createWarehouseReceipt}
            >
              {selectedPickupOrder !== null && (

                <PickupOrderCreationForm
                  pickupOrder={selectedPickupOrder}
                  closeModal={handleCancel}
                  creating={false}
                  onpickupOrderDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />
             
            )}

            {selectedPickupOrder === null && (
              
                <PickupOrderCreationForm
                  pickupOrder={null}
                  closeModal={handleCancel}
                  creating={true}
                  onpickupOrderDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />
             
            )}
              </Table>

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Pick-up Order deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Pick-up Order. Please try again</strong>
              </Alert>
            )}

            {/* {selectedPickupOrder !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PickupOrderCreationForm
                  pickupOrder={selectedPickupOrder}
                  closeModal={closeModal}
                  creating={false}
                  onpickupOrderDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />
              </ModalForm>
            )}

            {selectedPickupOrder === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PickupOrderCreationForm
                  pickupOrder={null}
                  closeModal={closeModal}
                  creating={true}
                  onpickupOrderDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />
              </ModalForm>
            )} */}

            {selectedPickupOrder !== null && createWarehouseReceipt && (
               <div className="layout-fluid">
                <ReceiptCreationForm
                  pickupOrder={selectedPickupOrder}
                  closeModal={closeModalReceiptCreation}
                  creating={true}
                  onpickupOrderDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                  fromPickUp={true}
                />
            </div>
            )}
          </div>
        </div>


      </div>
    </>
  );
};

export default Pickup;