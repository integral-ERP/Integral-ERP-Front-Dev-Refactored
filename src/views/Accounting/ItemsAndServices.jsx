import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import CarrierCreationForm from "../forms/CarrierCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ItemsAndServicesService from "../../services/ItemsAndServices";
import Sidebar from "../shared/components/SideBar";

const ItemsAndServices = () => {
    const [itemsAndServices, setItemsAndServices] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedeItemAndService, setSelectedCarrier] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Code",
    "Description",
    "Account Name",
    "Type",
    "Amount",
    "Currency",
    "IATA Code"
  ];
  const updateItemsAndServices = (url = null) => {
    ItemsAndServicesService.getItemsAndServices(url)
      .then((response) => {
        setItemsAndServices([...itemsAndServices, ...response.data.results].reverse())

        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if(!initialDataFetched){
      updateItemsAndServices();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateItemsAndServices(nextPageURL);
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

  const handleCarrierDataChange = () => {
    updateItemsAndServices();
  };

  const handleSelectCarrier = (carrier) => {
    setSelectedCarrier(carrier);
  };

  const handleEditCarrier = () => {
    if (selectedeItemAndService) {
      openModal();
    } else {
      alert("Please select a carrier to edit.");
    }
  };

  const handleAddCarrier = () => {
    openModal();
  };

  const handleDeleteCarrier = () => {
    if (selectedeItemAndService) {
      ItemsAndServicesService.deleteCarrier(selectedeItemAndService.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updateItemsAndServices();
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
      alert("Please select a carrier to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isCarrierButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isCarrierButton && !isTableRow) {
        setSelectedCarrier(null);
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
          data={itemsAndServices}
          columns={columns}
          onSelect={handleSelectCarrier} // Make sure this line is correct
          selectedRow={selectedeItemAndService}
          onDelete={handleDeleteCarrier}
          onEdit={handleEditCarrier}
          onAdd={handleAddCarrier}
          title="Items & Services"
        />

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Carrier deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Carrier. Please try again</strong>
          </Alert>
        )}

        {selectedeItemAndService !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <CarrierCreationForm
              carrier={selectedeItemAndService}
              closeModal={closeModal}
              creating={false}
              onCarrierDataChange={handleCarrierDataChange}
            />
          </ModalForm>
        )}

        {selectedeItemAndService === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <CarrierCreationForm
              carrier={null}
              closeModal={closeModal}
              creating={true}
              onCarrierDataChange={handleCarrierDataChange}
            />
          </ModalForm>
        )}
      </div>
    </>
  );
}

export default ItemsAndServices;