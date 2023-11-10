import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PaymentTermsCreationForm from "../forms/PaymentTermsCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PaymentTermsService from "../../services/PaymentTermsService";
import Sidebar from "../shared/components/SideBar";

const PaymentTerms = () => {
  const [paymentTerms, setpaymentTerms] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedpaymentTerms, setSelectedpaymentTerms] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Description",
    "Due Days",
    "Discount Percentage",
    "Discount Days",
    "Inactive",
  ];
  const updatepaymentTerms = (url = null) => {
    PaymentTermsService.getPaymentTerms(url)
      .then((response) => {
        setpaymentTerms(
          [...paymentTerms, ...response.data.results].reverse()
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
      updatepaymentTerms();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatepaymentTerms(nextPageURL);
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

  const handlepaymentTermsDataChange = () => {
    updatepaymentTerms();
  };

  const handleSelectpaymentTerms = (paymentTerm) => {
    setSelectedpaymentTerms(paymentTerm);
  };

  const handleEditpaymentTerms = () => {
    if (selectedpaymentTerms) {
      openModal();
    } else {
      alert("Please select a Payment Terms to edit.");
    }
  };

  const handleAddpaymentTerms = () => {
    openModal();
  };

  const handleDeletepaymentTerms = () => {
    if (selectedpaymentTerms) {
      PaymentTermsService.deletePaymentTerm(selectedpaymentTerms.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updatepaymentTerms();
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
      alert("Please select a Payment Terms to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const ispaymentTermsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!ispaymentTermsButton && !isTableRow) {
        setSelectedpaymentTerms(null);
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
              data={paymentTerms}
              columns={columns}
              onSelect={handleSelectpaymentTerms} // Make sure this line is correct
              selectedRow={selectedpaymentTerms}
              onDelete={handleDeletepaymentTerms}
              onEdit={handleEditpaymentTerms}
              onAdd={handleAddpaymentTerms}
              title="Payment Terms"
            />

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Payment Terms deleted successfully!</strong>
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
                  Error deleting Payment Terms. Please try again
                </strong>
              </Alert>
            )}

            {selectedpaymentTerms !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForm
                  paymentTerm={selectedpaymentTerms}
                  closeModal={closeModal}
                  creating={false}
                  onpaymentTermsDataChange={handlepaymentTermsDataChange}
                />
              </ModalForm>
            )}

            {selectedpaymentTerms === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForm
                  paymentTerm={null}
                  closeModal={closeModal}
                  creating={true}
                  onpaymentTermsDataChange={handlepaymentTermsDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentTerms;
