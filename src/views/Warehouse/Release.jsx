import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ReceiptCreationForm from "../forms/ReceiptCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ReleaseService from "../../services/ReleaseService";
import Sidebar from "../shared/components/SideBar";

const Release = () => {
  const [releaseOrders, setReleaseOrders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedReleaseOrder, setSelectedReleaseOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [currentReleaseNumber, setcurrentReleaseNumber] = useState(0);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Status",
    "Number",
    "Release Date",
    "Released to",
    "Pieces",
    "Weight",
    "Volume",
    "View Release PDF",
  ];

  const updateReleaseOrders = (url = null) => {
    ReleaseService.getReleases(url)
      .then((response) => {
        const newreleises = response.data.results.filter((release) => {
          const pickupOrderId = release.id;
          return !releaseOrders.some((existingPickupOrder) => existingPickupOrder.id === pickupOrderId);
        });
        
        setReleaseOrders([...releaseOrders, ...newreleises]);
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
      const number = releaseOrders[releaseOrders.length - 1]?.number || 0;
      setcurrentReleaseNumber(number + 1);
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

  return (
    <>
      <div className="dashboard__layout">
        <div className="dashboard__sidebar">
          <Sidebar />
          <div className="content-page">
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
            />

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

            {selectedReleaseOrder !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ReceiptCreationForm
                  pickupOrder={selectedReleaseOrder}
                  closeModal={closeModal}
                  creating={false}
                  onpickupOrderDataChange={handlereceiptsDataChange}
                  currentPickUpNumber={currentReleaseNumber}
                  setcurrentPickUpNumber={setcurrentReleaseNumber}
                />
              </ModalForm>
            )}

            {selectedReleaseOrder === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ReceiptCreationForm
                  pickupOrder={null}
                  closeModal={closeModal}
                  creating={true}
                  onpickupOrderDataChange={handlereceiptsDataChange}
                  currentPickUpNumber={currentReleaseNumber}
                  setcurrentPickUpNumber={setcurrentReleaseNumber}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Release;
