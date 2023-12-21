import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm"; import Sidebar
  from "../shared/components/SideBar"; import { useModal }
  from "../../hooks/useModal"; // Import the useModal hook
//----------------------------------------------------
import PaymentsCreationForm from "../forms/PaymentsCreationForm";
import PaymentsService from "../../services/PaymentsService";


const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPayments, setSelectedPayments] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Number",
    "Entipy",
    "Transaction Date",
    "employee",
    "AR Amount",
    "Acount Name",
    "Exported",
    "Is Deposited",
    "Memo",
    "Back Acount",
    "Reconciliation Date",
  ];
  const updatePayment = (url = null) => {
    PaymentsService.getPayments(url)
      .then((response) => {
        setPayments(
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
      updatePayment();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatePayment(nextPageURL);
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

  const handlePaymentsDataChange = () => {
    updatePayment();
  };

  const handleSelectPayments = (payments) => {
    setSelectedPayments(payments);
  };

  const handleEditPayments = () => {
    if (selectedPayments) {
      openModal();
    } else {
      alert("Please select a Payments to edit.");
    }
  };

  const handleAddPayments = () => {
    openModal();
  };

  const handleDeletePayments = () => {
    if (selectedPayments) {
      PaymentsService.deletePayment(selectedPayments.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updatePayment();
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
      alert("Please select a Payments to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isPaymentsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      openModal();

      if (!isPaymentsButton && !isTableRow) {
        setSelectedPayments(null);
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
      <div className="dashboard__sidebar">
        <div className="dashboard__sidebar">
          <Sidebar />
          <div className="content-page">
            <Table
              data={payments}
              columns={columns}
              onSelect={handleSelectPayments} // Make sure this line is correct
              selectedRow={selectedPayments}
              onDelete={handleDeletePayments}
              onEdit={handleEditPayments}
              onAdd={handleAddPayments}
              title="Payments"
            />

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Payments deleted successfully!</strong>
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
                  Error deleting Payments. Please try again
                </strong>
              </Alert>
            )}

            {selectedPayments !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentsCreationForm
                  payments={selectedPayments}
                  closeModal={closeModal}
                  creating={false}
                  onpaymentDataChange={handlePaymentsDataChange}
                />
              </ModalForm>
            )}

            {selectedPayments === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentsCreationForm
                  payments={null}
                  closeModal={closeModal}
                  creating={true}
                  onpaymentDataChange={handlePaymentsDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;