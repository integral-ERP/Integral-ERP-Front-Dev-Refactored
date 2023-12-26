import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ReleaseOrderCreationForm from "../forms/ReleaseOrderCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ReleaseService from "../../services/ReleaseService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global"

const Release = () => {
  const { hideShowSlider } = useContext(GlobalContext)
  const [releaseOrders, setReleaseOrders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedReleaseOrder, setSelectedReleaseOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [currentReleaseNumber, setcurrentReleaseNumber] = useState(0);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const columns = [
    "Status",
    "Number",
    "Release Date",
    "Released to",
    "Pieces",
    "View Release PDF",
  ];

  const updateReleaseOrders = (url = null) => {
    ReleaseService.getReleases(url)
      .then((response) => {
        const newreleises = response.data.results.filter((release) => {
          const pickupOrderId = release.id;
          return !releaseOrders.some((existingPickupOrder) => existingPickupOrder.id === pickupOrderId);
        });
        
        setReleaseOrders([...releaseOrders, ...newreleises].reverse());
        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!initialDataFetched) {
      updateReleaseOrders();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      const number = releaseOrders[0]?.number || 0;
      setcurrentReleaseNumber(number);
    }
  }, [releaseOrders]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateReleaseOrders(nextPageURL);
      }
    });

    const lastRow = document.querySelector(".table-row:last-child");
    if (lastRow) {
      observer.observe(lastRow);
    }

    return () => {
      // Clean up the observer when the component unmounts
      observer.disconnect();
    };
  }, [nextPageURL]);

  const handlereceiptsDataChange = () => {
    updateReleaseOrders();
  };

  const handleSelectPickupOrder = (releaseOrder) => {
    setSelectedReleaseOrder(releaseOrder);
    console.log("Selected Release Order", releaseOrder);
  };

  const handleEditreceipts = () => {
    if (selectedReleaseOrder) {
      openModal();
    } else {
      alert("Please select a Release Order to edit.");
    }
  };

  const handleAddReleaseOrder = () => {
    openModal();
  };

  const handleDeletePickupOrder = () => {
    if (selectedReleaseOrder) {
      ReleaseService.deleteReceipt(selectedReleaseOrder.id)
        .then((response) => {
          if (response.status == 204) {
            const newreceipts = releaseOrders.filter((order) => order.id !== selectedReleaseOrder.id);
            setReleaseOrders(newreceipts);
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            //updatereceipts();
          } else {
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please select a Release Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isreceiptsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isreceiptsButton && !isTableRow) {
        setSelectedReleaseOrder(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const setInTransit = async () => {
    console.log("Changing");
    if(selectedReleaseOrder){
      const updatedPickuporder = {...selectedReleaseOrder, status: 6};
      const response = (await ReleaseService.updateRelease(selectedReleaseOrder.id, updatedPickuporder));
      console.log("RESPUESTA DE CAMBIO DE STATUS", response);
      if (response.status === 200){
        console.log("ACTUALIZANDO PAGINA POR CAMBIO DE STATUS");
        window.location.reload(true);
        // TODO: REFRESH WINDOW 
      }
      console.log(response);
    }else{
      alert("Please select a pickup order to continue.");
    }
  }

  const setDelivered = async () => {
    console.log("Changing");
    if(selectedReleaseOrder){
      const updatedPickuporder = {...selectedReleaseOrder, status: 9};
      const response = (await ReleaseService.updateRelease(selectedReleaseOrder.id, updatedPickuporder));
      console.log("RESPUESTA DE CAMBIO DE STATUS", response);
      if (response.status === 200){
        console.log("ACTUALIZANDO PAGINA POR CAMBIO DE STATUS");
        window.location.reload(true);
        // TODO: REFRESH WINDOW 
      }
      console.log(response);
    }else{
      alert("Please select a pickup order to continue.");
    }
  }

  const contextMenuOptions = [
    {
      label: "Set/Reset In Transit",
      handler: setInTransit,
    },
    {
      label: "Set/Reset Delivered",
      handler: setDelivered,
    },
  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  return (
    <>
      <div className="dashboard__layout">
        <div className="dashboard__sidebar">
          <Sidebar />
          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              data={releaseOrders}
              columns={columns}
              onSelect={handleSelectPickupOrder} // Make sure this line is correct
              selectedRow={selectedReleaseOrder}
              onDelete={handleDeletePickupOrder}
              onEdit={handleEditreceipts}
              onAdd={handleAddReleaseOrder}
              title="Release Orders"
              setData={setReleaseOrders}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              contextMenuPosition={contextMenuPosition}
              setShowContextMenu={setShowContextMenu}
              contextMenuOptions={contextMenuOptions}
              contextService={ReleaseService}

            >
              <ReleaseOrderCreationForm
                  releaseOrder={selectedReleaseOrder}
                  closeModal={closeModal}
                  creating={true}
                  onReleaseOrderDataChange={handlereceiptsDataChange}
                  currentReleaseNumber={currentReleaseNumber}
                  setcurrentReleaseNumber={setcurrentReleaseNumber}
                />
                  </Table>

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Release Order deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Release Order. Please try again</strong>
              </Alert>
            )}

            {/* {selectedReleaseOrder !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ReleaseOrderCreationForm
                  releaseOrder={selectedReleaseOrder}
                  closeModal={closeModal}
                  creating={false}
                  onReleaseOrderDataChange={handlereceiptsDataChange}
                  currentReleaseNumber={currentReleaseNumber}
                  setcurrentReleaseNumber={setcurrentReleaseNumber}
                />
              </ModalForm>
            )}

            {selectedReleaseOrder === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ReleaseOrderCreationForm
                  releaseOrder={null}
                  closeModal={closeModal}
                  creating={true}
                  onReleaseOrderDataChange={handlereceiptsDataChange}
                  currentReleaseNumber={currentReleaseNumber}
                  setcurrentReleaseNumber={setcurrentReleaseNumber}
                />
              </ModalForm>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Release;
