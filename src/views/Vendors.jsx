import { useState, useEffect } from "react";
import Table from "./shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "./shared/components/ModalForm";
import VendorsCreationForm from "./forms/VendorCreationForm";
import { useModal } from "../hooks/useModal"; // Import the useModal hook
import VendorService from "../services/VendorService";
import Sidebar from "./shared/components/SideBar";

const Vendors = () => {
  const [vendors, setvendors] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedVendor, setselectedVendor] = useState(null);
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
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",

    "System ID",
  ];

  const fetchvendorsData = () => {
    VendorService.getVendors()
      .then((response) => {
        setvendors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchvendorsData();
  }, []);

  const handleVendorsDataChange = () => {
    fetchvendorsData();
  };

  const handleEditVendor = () => {
    if (selectedVendor) {
      openModal();
    } else {
      alert("Please select a Vendor to edit.");
    }
  };

  const handleSelectVendor = (wp) => {
    setselectedVendor(wp);
  };

  const handleAddVendor = () => {
    openModal();
  };

  const handleDeleteVendor = () => {
    if (selectedVendor) {
      VendorService.deleteVendor(selectedVendor.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            fetchvendorsData();
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
      alert("Please select a Vendor to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isWPButton && !isTableRow) {
        setselectedVendor(null);
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
          data={vendors}
          columns={columns}
          onSelect={handleSelectVendor} // Make sure this line is correct
          selectedRow={selectedVendor}
          onDelete={handleDeleteVendor}
          onEdit={handleEditVendor}
          onAdd={handleAddVendor}
          title="Vendors"
        />

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Vendor deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Vendor. Please try again</strong>
          </Alert>
        )}
        {selectedVendor !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <VendorsCreationForm
              vendor={selectedVendor}
              closeModal={closeModal}
              creating={false}
              onvendorDataChange={handleVendorsDataChange}
            />
          </ModalForm>
        )}
        {selectedVendor === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <VendorsCreationForm
              vendor={null}
              closeModal={closeModal}
              creating={true}
              onvendorDataChange={handleVendorsDataChange}
            />
          </ModalForm>
        )}
      </div>
    </>
  );
};

export default Vendors;
