import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";import Sidebar
 from "../shared/components/SideBar";import { useModal } 
 from "../../hooks/useModal"; // Import the useModal hook
 //----------------------------------------------------
// import PaymentTermsCreationForms from "../forms/PaymentTermsCreationForm";

// import PaymentTermsService from "../../services/PaymentTermsService";

// import ReceiptCreationForm from "../forms/ReceiptCreationForm";


const Payments  = () => {
  const [paymentOfTerms, setpaymentOfTerms] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [isOpenReceiptCreation, openModalReceiptCreation, closeModalReceiptCreation] = useModal(false);
  const [selectedPaymentOfTerm, setSelectedPaymentOfTerm] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false);

  // const [contextMenuPosition, setContextMenuPosition] = useState({
  //   x: 0,
  //   y: 0,
  // });
  const [showContextMenu, setShowContextMenu] = useState(false);

  const columns = [
    "Prueba",
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

  // const updatePaymentTerms = (url = null) => {
  //   PaymentTermsService.getPaymentTerms(url)
  //     .then((response) => {
  //       const newPickupOrders = response.data.results.filter((paymentTerms) => {
  //         const paymentTermId = paymentTerms.id;
  //         return !paymentOfTerms.some(
  //           (existingPickupOrder) => existingPickupOrder.id === paymentTermId
  //         );
  //       });

  //       setpaymentOfTerms([...response.data.results].reverse());
  //       console.log("NEW ORDERS", [...paymentOfTerms, ...newPickupOrders]);
  //       // setpaymentOfTerms([...paymentOfTerms, ...response.data.results].reverse());

  //       if (response.data.next) {
  //         setNextPageURL(response.data.next);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  // useEffect(() => {
  //   if (!initialDataFetched) {
  //     updatePaymentTerms();
  //     setInitialDataFetched(true);
  //   }
  // }, []);

  useEffect(() => {
    if (initialDataFetched) {
      const number = paymentOfTerms[paymentOfTerms.length - 1]?.number || 0;
      setcurrentPickupNumber(number + 1);
    }
  }, [paymentOfTerms]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatePaymentTerms(nextPageURL);
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

  const handlePickupOrdersDataChange = () => {
    updatePaymentTerms();
  };

  const handleSelectPaymentOfTerms = (PickupOrder) => {
    setSelectedPaymentOfTerm(PickupOrder);
  };

  const handleEditPaymentOfTerms = () => {
    if (selectedPaymentOfTerm) {
      openModal();
    } else {
      alert("Please select a Payments  Order to edit.");
    }
  };

  const handleAddPaymentOfTerm = () => {
    openModal();
  };

  const handleDeletePaymentOfTerm = () => {
    if (selectedPaymentOfTerm) {
      PaymentTermsService.deletePaymentTerm(selectedPaymentOfTerm.id)
        .then((response) => {
          if (response.status == 204) {
            const newPickupOrders = paymentOfTerms.filter(
              (order) => order.id !== selectedPaymentOfTerm.id
            );
            setpaymentOfTerms(newPickupOrders);
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updatePaymentTerms();
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
      alert("Please select a Payments  Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPickupOrdersButton && !isTableRow) {
        setSelectedPaymentOfTerm(null);
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
              data={paymentOfTerms}
              columns={columns}
              onSelect={handleSelectPaymentOfTerms} // Make sure this line is correct
              selectedRow={selectedPaymentOfTerm}
              onDelete={handleDeletePaymentOfTerm}
              onEdit={handleEditPaymentOfTerms}
              onAdd={handleAddPaymentOfTerm}
              title="Payments"
              setData={setpaymentOfTerms}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              // contextMenuPosition={contextMenuPosition}
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
                <strong>Error deleting Payment Terms. Please try again</strong>
              </Alert>
            )}

            {/* {selectedPaymentOfTerm !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForms
                  paymentTerms={selectedPaymentOfTerm}
                  closeModal={closeModal}
                  creating={false}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                />
              </ModalForm>
            )} */}

            {/* {selectedPaymentOfTerm === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForms
                  paymentTerms={null}
                  closeModal={closeModal}
                  creating={true}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                />
              </ModalForm>
            )} */}

            {selectedPaymentOfTerm !== null && createWarehouseReceipt && (
              <ModalForm isOpen={isOpenReceiptCreation} closeModal={closeModalReceiptCreation}>
                <ReceiptCreationForm
                  paymentTerms={selectedPaymentOfTerm}
                  closeModal={closeModalReceiptCreation}
                  creating={true}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                  fromPickUp={true}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments ;
