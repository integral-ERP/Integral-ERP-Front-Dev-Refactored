import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import EmployeeCreationForm from "../forms/EmployeeCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import EmployeeService from "../../services/EmployeeService";
import Sidebar from "../shared/components/SideBar";

const Employees = () => {
  const [employees, setemployees] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedEmployee, setselectedEmployee] =
    useState(null);
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
    "Parent Account",
    "Carrier Type",
    "Method Code",
    "Carrier Code",
    "SCAC Number",
    "IATA Code",
    "Airline Code",
    "Airline Prefix",
    "Airway Bill Numbers",
    "Passenger Only Airline",
  ];

  const fetchEmployeesData = (url = null) => {
    console.log("url", url);
    EmployeeService.getEmployees(url)
      .then((response) => {
        const newEmployees = response.data.results.filter((pickupOrder) => {
          const pickupOrderId = pickupOrder.id;
          return !employees.some((existingPickupOrder) => existingPickupOrder.id === pickupOrderId);
        });
        console.log("NEW EMPLOYEES", newEmployees);
        setemployees([...employees, ...newEmployees].reverse());
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
      fetchEmployeesData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchEmployeesData(nextPageURL);
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

  const handleEmployeesDataChange = () => {
    fetchEmployeesData();
  };

  const handleEditEmployee = () => {
    if (selectedEmployee) {
      openModal();
    } else {
      alert("Please select a Employee to edit.");
    }
  };

  const handleSelectEmployee = (wp) => {
    setselectedEmployee(wp);
  };

  const handleAddEmployee = () => {
    openModal();
  }

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      EmployeeService.deleteEmployee(selectedEmployee.id).then((response) => {
        if (response.status == 204) {
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 3000);
          const newreceipts = employees.filter((order) => order.id !== selectedEmployee.id);
          setemployees(newreceipts);
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
      alert("Please select a Employee to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      openModal();

      if (!isWPButton && !isTableRow) {
        setselectedEmployee(null);
      }
    };

    window.addEventListener("dblclick", handleWindowClick);

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
              data={employees}
              columns={columns}
              onSelect={handleSelectEmployee} // Make sure this line is correct
              selectedRow={selectedEmployee}
              onDelete={handleDeleteEmployee}
              onEdit={handleEditEmployee}
              onAdd={handleAddEmployee}
              title="Employees"
            />

            {showSuccessAlert && (
              <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
                <AlertTitle>Success</AlertTitle>
                <strong>
                  Employee deleted successfully!
                </strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
                <AlertTitle>Error</AlertTitle>
                <strong>
                  Error deleting Employee. Please try again
                </strong>
              </Alert>
            )}
            {selectedEmployee !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <EmployeeCreationForm
                  employee={selectedEmployee}
                  closeModal={closeModal}
                  creating={false}
                  onEmployeeDataChange={handleEmployeesDataChange}
                />
              </ModalForm>
            )}
            {selectedEmployee === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <EmployeeCreationForm
                  employee={null}
                  closeModal={closeModal}
                  creating={true}
                  onEmployeeDataChange={handleEmployeesDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Employees;