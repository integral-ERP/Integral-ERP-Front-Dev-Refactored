import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";import Sidebar
from "../shared/components/SideBar";import { useModal } 
from "../../hooks/useModal"; // Import the useModal hook
 //----------------------------------------------------
import DepositsCreationForm from "../forms/DepositsCreationForm";
import DepositsService from "../../services/DepositsService";


const Deposits = () => {
  const [deposit, setDeposits] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedDeposits, setSelectedDeposits] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Date",
    "Employee",
    "Account Name",
    "Amount",
    "Memo",
    "Reconciliation Date",    
  ];
  const updateDeposit = (url = null) => {
    DepositsService.getDeposits(url)
      .then((response) => {
        setDeposits(
          [...response.data.results].reverse()
        );

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
      updateDeposit();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateDeposit(nextPageURL);
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

  const handleDepositsDataChange = () => {
    updateDeposit();
  };

  const handleSelectDeposits = (deposit) => {
    setSelectedDeposits(deposit);
  };

  const handleEditDeposits = () => {
    if (selectedDeposits) {
      openModal();
    } else {
      alert("Please select a Deposits to edit.");
    }
  };

  const handleAddDeposits = () => {
    openModal();
  };

  const handleDeleteDeposits = () => {
    if (selectedDeposits) {
      DepositsService.deleteDeposit(selectedDeposits.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updateDeposit();
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
      alert("Please select a Deposits to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isDepositsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isDepositsButton && !isTableRow) {
        setSelectedDeposits(null);
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
        <div className="dashboard__sidebar">
          <Sidebar />
          <div className="content-page">
            <Table
              data={deposit}
              columns={columns}
              onSelect={handleSelectDeposits} // Make sure this line is correct
              selectedRow={selectedDeposits}
              onDelete={handleDeleteDeposits}
              onEdit={handleEditDeposits}
              onAdd={handleAddDeposits}
              title="Deposits"
            >
               {selectedDeposits !== null && (
             
                <DepositsCreationForm
                  deposit={selectedDeposits}
                  closeModal={closeModal}
                  creating={false}
                  ondepositDataChange={handleDepositsDataChange}
                />
            
            )}

            {selectedDeposits === null && (
             
                <DepositsCreationForm
                  deposit={selectedDeposits}
                  closeModal={closeModal}
                  creating={true}
                  ondepositDataChange={handleDepositsDataChange}
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
                <strong>Deposits deleted successfully!</strong>
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
                  Error deleting Deposits. Please try again
                </strong>
              </Alert>
            )}

            {/* {selectedDeposits !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <DepositsCreationForm
                  deposit={selectedDeposits}
                  closeModal={closeModal}
                  creating={false}
                  ondepositDataChange={handleDepositsDataChange}
                />
              </ModalForm>
            )}

            {selectedDeposits === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <DepositsCreationForm
                  deposit={null}
                  closeModal={closeModal}
                  creating={true}
                  ondepositDataChange={handleDepositsDataChange}
                />
              </ModalForm>
            )} */}

          </div>
        </div>
      </div>
    </>
  );
};

export default Deposits;