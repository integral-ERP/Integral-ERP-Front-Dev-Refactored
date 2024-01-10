import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ItemAndServiceCreationForm from "../forms/ItemAndServiceCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const ItemsAndServices = () => {
  const [itemsAndServices, setItemsAndServices] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedeItemAndService, setSelectedItemAndService] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Code",
    "Description",
    "Type",
    "Amount",
    "Currency",
    "IATA Code",
  ];

  const updateItemsAndServices = (url = null) => {
    ItemsAndServicesService.getItemsAndServices(url)
      .then((response) => {
        setItemsAndServices([...response.data.results].reverse());

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

  const handleItemAndServiceDataChange = () => {
    updateItemsAndServices();
  };

  const handleSelectItemAndService = (itemAndService) => {
    setSelectedItemAndService(itemAndService);
  };

  const handleEditItemAndService = () => {
    if (selectedeItemAndService) {
      openModal();
    } else {
      alert("Please select an Item and Service to edit.");
    }
  };

  const handleAddItemAndService = () => {
    openModal();
  };

  const handleDeleteItemAndService = () => {
    if (selectedeItemAndService) {
      ItemsAndServicesService.deleteItemAndService(selectedeItemAndService.id)
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
      alert("Please select an Item and Service to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isItemAndServiceButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isItemAndServiceButton && !isTableRow) {
        setSelectedItemAndService(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleClose = () => {
    window.location.reload();
  }

  const {hideShowSlider} = useContext(GlobalContext);

  return (
    <>
      <div className="dashboard__sidebar">
        <div className="dashboard__sidebar">
          <Sidebar />
          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              data={itemsAndServices}
              columns={columns}
              onSelect={handleSelectItemAndService} // Make sure this line is correct
              selectedRow={selectedeItemAndService}
              onDelete={handleDeleteItemAndService}
              onEdit={handleEditItemAndService}
              onAdd={handleAddItemAndService}
              title="Items & Services"
            >
              {selectedeItemAndService === null && (
                <ItemAndServiceCreationForm
                itemAndService={null}
                  closeModal={handleClose}
                  creating={true}
                  onitemAndServiceDataChange={handleItemAndServiceDataChange}
                />
              )}

              {selectedeItemAndService !== null && (
                <ItemAndServiceCreationForm
                itemAndService={selectedeItemAndService}
                  closeModal={handleClose}
                  creating={false}
                  onitemAndServiceDataChange={handleItemAndServiceDataChange}
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
                <strong>Item and Service deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>
                  Error deleting Item and Service. Please try again
                </strong>
              </Alert>
            )}

            
            {selectedeItemAndService !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ItemAndServiceCreationForm
                  itemAndService={selectedeItemAndService}
                  closeModal={closeModal}
                  creating={false}
                  // onpaymentTermDataChange={handlePickupOrdersDataChange}
                />
              </ModalForm>
            )}

            {selectedeItemAndService === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ItemAndServiceCreationForm
                  itemAndService={null}
                  closeModal={closeModal}
                  creating={true}
                  // onpaymentTermDataChange={handlePickupOrdersDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemsAndServices;
