import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import InvoicesCreationForm from "../forms/InvoicesCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import InvoicesService from "../../services/InvoicesService";
import Sidebar from "../shared/components/SideBar";
 
const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedInvoices, setSelectedInvoices] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Number",
    "Account Name",
    "Transaction Date",
    "Due Date",
    "Apply",
    "Payment Temse",
    "Division",
    "Biling Address",
    "View PDF",
  ];
  const updateInvoices = (url = null) => {
    InvoicesService.getInvoices(url)
      .then((response) => {
        setInvoices(
          [...invoices, ...response.data.results].reverse()
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
      updateInvoices();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateInvoices(nextPageURL);
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

  const handleInvoicesDataChange = () => {
    updateInvoices();
  };

  const handleSelectInvoices = (invoice) => {
    setSelectedInvoices(invoice);
  };

  const handleEditInvoices = () => {
    if (selectedInvoices) {
      openModal();
    } else {
      alert("Please select a Invoice to edit.");
    }
  };

  const handleAddInvoices = () => {
    openModal();
  };

  const handleDeleteInvoices = () => {
    if (selectedInvoices) {
      InvoicesService.deleteInvoice(selectedInvoices.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updateInvoices();
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
      alert("Please select a Invoice to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isInvoicesButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isInvoicesButton && !isTableRow) {
        setSelectedInvoices(null);
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
              data={invoices}
              columns={columns}
              onSelect={handleSelectInvoices} // Make sure this line is correct
              selectedRow={selectedInvoices}
              onDelete={handleDeleteInvoices}
              onEdit={handleEditInvoices}
              onAdd={handleAddInvoices}
              title="Invoices"
            />

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Invoices deleted successfully!</strong>
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
                  Error deleting Invoices. Please try again
                </strong>
              </Alert>
            )}

            {selectedInvoices !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <InvoicesCreationForm
                  invoice={selectedInvoices}
                  closeModal={closeModal}
                  creating={false}
                  onInvoicesDataChange={handleInvoicesDataChange}
                />
              </ModalForm>
            )}

            {selectedInvoices === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <InvoicesCreationForm
                  invoice={null}
                  closeModal={closeModal}
                  creating={true}
                  onInvoicesDataChange={handleInvoicesDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoices;
