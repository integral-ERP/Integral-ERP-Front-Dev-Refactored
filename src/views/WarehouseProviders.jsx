import { useState, useEffect } from "react";
import Table from "./shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "./shared/components/ModalForm";
import WarehouseProviderCreationForm from "./forms/WarehouseProviderCreationForm";
import { useModal } from "../hooks/useModal"; // Import the useModal hook
import WarehouseProviderService from "../services/WarehouseProviderService";
import Sidebar from "./shared/components/SideBar";

const WarehouseProviders = () => {
  const [warehouseProviders, setwarehouseProviders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedWarehouseProvider, setselectedWarehouseProvider] =
    useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const columns = [
    "Name",
    "Phone",
    "Mobile Phone",
    "Email",
    "Fax",
    "Website",
    "Reference Number",
    "Contact First Name",
    "Contact Last Name",
    "ID",
    "Type ID",
    "System ID",
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",
  ];

  const fetchWarehouseProvidersData = () => {
    WarehouseProviderService.getWarehouseProviders()
      .then((response) => {
        setwarehouseProviders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchWarehouseProvidersData();
  }, []);

  const handleWarehouseProviderDataChange = () => {
    fetchWarehouseProvidersData();
  };

  const handleEditWarehouseProvider = () => {
    if (selectedWarehouseProvider) {
      openModal();
    } else {
      alert("Please select a warehouse provider to edit.");
    }
  };

  const handleSelectWarehouseProvider = (wp) => {
    setselectedWarehouseProvider(wp);
  };

  const handleAddWarehouseProvider = () => {
    openModal();
  };

  const handleDeleteWarehouseProvider = () => {
    if (selectedWarehouseProvider) {
      WarehouseProviderService.deleteWarehouseProvider(
        selectedWarehouseProvider.id
      )
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            fetchWarehouseProvidersData();
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
      alert("Please select a warehouse provider to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isWPButton && !isTableRow) {
        setselectedWarehouseProvider(null);
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
          data={warehouseProviders}
          columns={columns}
          onSelect={handleSelectWarehouseProvider} // Make sure this line is correct
          selectedRow={selectedWarehouseProvider}
          onDelete={handleDeleteWarehouseProvider}
          onEdit={handleEditWarehouseProvider}
          onAdd={handleAddWarehouseProvider}
          title="Warehouse Providers"
        />

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Warehouse Provider deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Warehouse Provider. Please try again</strong>
          </Alert>
        )}
        {selectedWarehouseProvider !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <WarehouseProviderCreationForm
              warehouseProvider={selectedWarehouseProvider}
              closeModal={closeModal}
              creating={false}
              onWarehouseProviderDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
        {selectedWarehouseProvider === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <WarehouseProviderCreationForm
              warehouseProvider={null}
              closeModal={closeModal}
              creating={true}
              onWarehouseProviderDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
      </div>
    </>
  );
};

export default WarehouseProviders;
