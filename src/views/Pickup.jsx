import { useState, useEffect } from "react";
import Table from "./shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "./shared/components/ModalForm";
import PickupOrderCreationForm from "./forms/PickupOrderCreationForm";
import { useModal } from "../hooks/useModal"; // Import the useModal hook
import PickupService from "../services/PickupService";
import Sidebar from "./shared/components/SideBar";

const Pickup = () => {
  const [pickupOrders, setpickupOrders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPickupOrder, setSelectedPickupOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
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
    "Pickup Orders",
    "Weight",
    "Volume",
    "Carrier Name",
    "Carrier Address",
    "PRO Number",
    "Tracking Number",
    "Invoice Number",
    "Purchase Order number"
  ];

  const updatePickupOrders = () => {
    PickupService.getPickups()
      .then((response) => {
        const modified = response.data.map((po) => {
          // Check if the status is 1, if yes, set it to "loaded"
          if (po.status === "1") {
            po.status = "loaded";
          }
          // Return the modified object
          return po;
        });
        console.log(modified);
        setpickupOrders(modified);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  useEffect(() => {
    updatePickupOrders();
  }, []);

  const handlePickupOrdersDataChange = () => {
    updatePickupOrders();
  };

  const handleSelectPickupOrder = (PickupOrder) => {
    setSelectedPickupOrder(PickupOrder);
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
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updatePickupOrders();
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
      <div className="dashboard__sidebar">
        <Sidebar />
      </div>
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
            />
          </ModalForm>
        )}
      </div>
    </>
  );
};

export default Pickup;
