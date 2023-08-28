import { useState, useEffect } from "react";
import ModalForm from "./shared/components/ModalForm";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useModal } from "../hooks/useModal"; // Import the useModal hook
import CustomersCreationForm from "./forms/CustomerCreationForm";
import CustomerService from "../services/CustomerService";
import Table from "./shared/components/Table";
import Sidebar from "./shared/components/SideBar";

const Customers = () => {
  const [customers, setcustomers] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedCustomer, setselectedCustomer] = useState(null);
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

  const fetchcustomersData = () => {
    CustomerService.getCustomers()
      .then((response) => {
        setcustomers(response.data);
      })
      .catch((error) => {
        console.err(error);
      });
  };

  useEffect(() => {
    fetchcustomersData();
  }, []);

  const handleWarehouseProviderDataChange = () => {
    fetchcustomersData();
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      openModal();
    } else {
      alert("Please select a Customer to edit.");
    }
  };

  const handleSelectCustomer = (wp) => {
    setselectedCustomer(wp);
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      CustomerService.deleteCustomer(selectedCustomer.id);
    } else {
      alert("Please select a Customer to delete.");
    }
  };

  const handleAddCustomer = () => {
    openModal();
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isWPButton && !isTableRow) {
        setselectedCustomer(null);
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
          data={customers}
          columns={columns}
          onSelect={handleSelectCustomer} // Make sure this line is correct
          selectedRow={selectedCustomer}
          onDelete={handleDeleteCustomer}
          onEdit={handleEditCustomer}
          onAdd={handleAddCustomer}
          title="Customers"
        />

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Customer deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Customer. Please try again</strong>
          </Alert>
        )}
        {selectedCustomer !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <CustomersCreationForm
              customer={selectedCustomer}
              closeModal={closeModal}
              creating={false}
              onCustomerDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
        {selectedCustomer === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <CustomersCreationForm
              customer={null}
              closeModal={closeModal}
              creating={true}
              onCustomerDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
      </div>
    </>
  );
};

export default Customers;
