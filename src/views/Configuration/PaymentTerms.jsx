import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PaymentTermsCreationForm from "../forms/PaymentTermsCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import Sidebar from "../shared/components/SideBar";
import ReceiptCreationForm from "../forms/ReceiptCreationForm";

import PaymentTermsService from "../../services/PaymentTermsService";

const PaymentTerms = () => {
  const [paymentTerms, setpaymentTerms] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [isOpenReceiptCreation, openModalReceiptCreation, closeModalReceiptCreation] = useModal(false);
  const [selectedpaymentTerms, setSelectedpaymentTerms] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  // const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false);

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);




  const columns = [
    "Description",
    "Due Days",
    "Discount Percentage",
    "Discount Days",
    "Inactive",
  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Check if the click is inside the context menu or a table row
      const contextMenu = document.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(e.target)) {
        // Click is outside the context menu, close it
        setShowContextMenu(false);
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleDocumentClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showContextMenu]); // Only re-add the event listener when showContextMenu changes

  const updatepaymentTerms = (url = null) => {
    PaymentTermsService.getPaymentTerms(url)
      .then((response) => {
        const newPaymentTerms = response.data.results.filter((PaymentTerms) => {
          const paymentTermId = PaymentTerms.id;
          return !paymentTerms.some(
            (existingPaymentTerm) => existingPaymentTerm.id === paymentTermId
          );
        });

        setpaymentTerms([...paymentTerms, ...newPaymentTerms]);
        console.log("NEW ORDERS", [...paymentTerms, ...newPaymentTerms]);
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

  // useEffect(() => {
  //   if (initialDataFetched) {
  //     const number = paymentTerms[paymentTerms.length - 1]?.number || 0;
  //     setcurrentPickupNumber(number + 1);
  //   }
  // }, [paymentTerms]);

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

  const handlePaymentTermDataChange = () => {
    updatepaymentTerms();
  };

  const handleSelectpaymentTerms = (PaymentTerms) => {
    setSelectedpaymentTerms(PaymentTerms);
  };

  const handleEditpaymentTerms = () => {
    if (selectedpaymentTerms) {
      openModal();
    } else {
      alert("Please select a PaymentTerms Order to edit.");
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
            // const newPaymentTerms = paymentTerms.filter(
            //   (order) => order.id !== selectedpaymentTerms.id
            // );
            // setpaymentTerms(newPaymentTerms);
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
      alert("Please select a PaymentTerms Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isPaymentTermsButto = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPaymentTermsButto && !isTableRow) {
        setSelectedpaymentTerms(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  useEffect(() => {
    if(createWarehouseReceipt){
      console.log("OPENING UP NEW MODAL FOR RECEIPTS");
      openModalReceiptCreation();
    }
  }, [createWarehouseReceipt])
  

  const contextMenuOptions = [
    {
      label: "Create Warehouse Receipt",
      handler: () => setCreateWarehouseReceipt(true)
    },
    {
      label: "Option 2",
      handler: () => {
        // Handle Option 2
      },
    },
    {
      label: "Option 3",
      handler: () => {
        // Handle Option 3
      },
    },
  ];

  return (
    <>
      <div className="dashboard__layout">
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
              title="Payment Term"
              setData={setpaymentTerms}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              contextMenuPosition={contextMenuPosition}
              setShowContextMenu={setShowContextMenu}
              contextMenuOptions={contextMenuOptions}
            />

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Payment Term Order deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Payment Term. Please try again</strong>
              </Alert>
            )}

            {selectedpaymentTerms !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForm
                  PaymentTerms={selectedpaymentTerms}
                  closeModal={closeModal}
                  creating={false}
                  onpaymentTermsDataChange={handlePaymentTermDataChange}
                  // currentPickUpNumber={currentPickupNumber}
                  // setcurrentPickUpNumber={setcurrentPickupNumber}
                />
              </ModalForm>
            )}

            {selectedpaymentTerms === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForm
                  PaymentTerms={selectedpaymentTerms}
                  closeModal={closeModal}
                  creating={true}
                  onpaymentTermsDataChange={handlePaymentTermDataChange}
                  // currentPickUpNumber={currentPickupNumber}
                  // setcurrentPickUpNumber={setcurrentPickupNumber}
                />
              </ModalForm>
            )}

            {selectedpaymentTerms !== null && createWarehouseReceipt && (
              <ModalForm isOpen={isOpenReceiptCreation} closeModal={closeModalReceiptCreation}>
                <ReceiptCreationForm
                  PaymentTerms={null}
                  closeModal={closeModalReceiptCreation}
                  creating={true}
                  onpaymentTermsDataChange={handlePaymentTermDataChange}
                  // currentPickUpNumber={currentPickupNumber}
                  // setcurrentPickUpNumber={setcurrentPickupNumber}
                  fromPaymentTerms={true}
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
