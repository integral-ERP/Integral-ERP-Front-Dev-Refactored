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
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
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

  const fetchCustomersData = (url = null) => {
    CustomerService.getCustomers(url)
      .then((response) => {
        if(customers !== response.data.results){
          setcustomers((prevCustomers) => {
            const newData = [...prevCustomers, ...response.data.results];
            return newData;
          });
          
        }
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
      fetchCustomersData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        console.log("Fetching next page of data...", customers.length);
        fetchCustomersData(nextPageURL);
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

  const handleWarehouseProviderDataChange = () => {
    fetchCustomersData();
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
    <div className="dashboard__layout">
      <div className="dashboard__sidebar">
        <Sidebar />
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
      </div>
      </div>
    </>
  );
};

export default Customers;
