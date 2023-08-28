import { useState, useEffect } from "react";
import Table from "./shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "./shared/components/ModalForm";
import EmployeeCreationForm from "./forms/EmployeeCreationForm";
import { useModal } from "../hooks/useModal"; // Import the useModal hook
import EmployeeService from "../services/EmployeeService";
import Sidebar from "./shared/components/SideBar";

const Employees = () => {
  const [employees, setemployees] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedEmployee, setselectedEmployee] =
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

  const fetchemployeesData = () => {
    EmployeeService.getEmployees()
    .then((response) => {
        setemployees(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchemployeesData();
  }, []);

  const handleEmployeesDataChange = () => {
    fetchemployeesData();
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
          fetchemployeesData();
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
      const isTableRow = clickedElement.closest(
        ".table-row"
      );

      if (!isWPButton && !isTableRow) {
        setselectedEmployee(null);
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
    </>
  );
};

export default Employees;