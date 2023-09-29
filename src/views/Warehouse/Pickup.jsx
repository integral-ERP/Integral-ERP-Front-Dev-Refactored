import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PickupOrderCreationForm from "../forms/PickupOrderCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PickupService from "../../services/PickupService";
import Sidebar from "../shared/components/SideBar";

const Pickup = () => {
  const [pickupOrders, setpickupOrders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPickupOrder, setSelectedPickupOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
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
    "Weight",
    "Volume",
    "Carrier Name",
    "Carrier Address",
    "PRO Number",
    "Tracking Number",
    "Invoice Number",
    "Purchase Order number",
    "View PDF",
  ];

  const updatePickupOrders = (url = null) => {
    PickupService.getPickups(url)
      .then((response) => {
        const newPickupOrders = response.data.results.filter((pickupOrder) => {
          const pickupOrderId = pickupOrder.id;
          return !pickupOrders.some((existingPickupOrder) => existingPickupOrder.id === pickupOrderId);
        });
        
        setpickupOrders([...pickupOrders, ...newPickupOrders]);
        console.log("NEW ORDERS", [...pickupOrders, ...newPickupOrders]);
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
      updatePickupOrders();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      setcurrentPickupNumber(pickupOrders[0].number);
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
      // Clean up the observer when the component unmounts
      observer.disconnect();
    };
  }, [nextPageURL]);

  const handlePickupOrdersDataChange = () => {
    updatePickupOrders();
  };

  const handleSelectPickupOrder = (PickupOrder) => {
    setSelectedPickupOrder(PickupOrder);
    console.log("Selected PickupOrder", selectedPickupOrder);
  };

  const handleEditPickupOrders = () => {
    if (selectedPickupOrder) {
      openModal();
    } else {
      alert("Please select a Pickup Order to edit.");
    }
  };

  const handleAddPickupOrder = () => {
    openModal();
  };

  const handleDeletePickupOrder = () => {
    if (selectedPickupOrder) {
      PickupService.deletePickup(selectedPickupOrder.id)
        .then((response) => {
          if (response.status == 204) {
            const newPickupOrders = pickupOrders.filter((order) => order.id !== selectedPickupOrder.id);
            setpickupOrders(newPickupOrders);
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            //updatePickupOrders();
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
      alert("Please select a Pickup Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPickupOrdersButton && !isTableRow) {
        setSelectedPickupOrder(null);
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
              data={pickupOrders}
              columns={columns}
              onSelect={handleSelectPickupOrder} // Make sure this line is correct
              selectedRow={selectedPickupOrder}
              onDelete={handleDeletePickupOrder}
              onEdit={handleEditPickupOrders}
              onAdd={handleAddPickupOrder}
              title="Pick-up Orders"
              setData={setpickupOrders}
            />

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

            {selectedPickupOrder !== null && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pickup;
