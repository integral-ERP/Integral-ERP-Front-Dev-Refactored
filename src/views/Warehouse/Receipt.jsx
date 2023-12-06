import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ReceiptCreationForm from "../forms/ReceiptCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ReceiptService from "../../services/ReceiptService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const Receipt = () => {
  const {hideShowSlider } = useContext(GlobalContext)
  const [receipts, setreceipts] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPickupOrder, setSelectedPickupOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Status",
    "Number",
    "Date",
    "Shipper",
    "Consignee",
    "Carrier",
    "Pieces",
    "Weight",
    "Volume",
    "View Receipt PDF",
  ];

  const updatereceipts = (url = null) => {
    ReceiptService.getReceipts(url)
      .then((response) => {
        const newreceipts = response.data.results.filter((pickupOrder) => {
          const pickupOrderId = pickupOrder.id;
          return !receipts.some((existingPickupOrder) => existingPickupOrder.id === pickupOrderId);
        });
        
        setreceipts([...receipts, ...newreceipts]);
        console.log("NEW ORDERS", [...receipts, ...newreceipts]);
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
      updatereceipts();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      console.log("recibo:", receipts[0]);
      const number = receipts[receipts.length - 1]?.number || 0;
      console.log("NUMERO", number);
      setcurrentPickupNumber(number + 1);
    }
  }, [receipts]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatereceipts(nextPageURL);
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

  const handlereceiptsDataChange = () => {
    updatereceipts();
  };

  const handleSelectPickupOrder = (PickupOrder) => {
    setSelectedPickupOrder(PickupOrder);
    console.log("Selected PickupOrder", selectedPickupOrder);
  };

  const handleEditreceipts = () => {
    if (selectedPickupOrder) {
      openModal();
    } else {
      alert("Please select a Pickup Order to edit.");
    }
  };

  const handleAddPickupOrder = () => {
    openModal();
  };

  const handleDeletePickupOrder = () => {
    if (selectedPickupOrder) {
      ReceiptService.deleteReceipt(selectedPickupOrder.id)
        .then((response) => {
          if (response.status == 204) {
            const newreceipts = receipts.filter((order) => order.id !== selectedPickupOrder.id);
            setreceipts(newreceipts);
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            //updatereceipts();
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
      alert("Please select a Pickup Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isreceiptsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isreceiptsButton && !isTableRow) {
        setSelectedPickupOrder(null);
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
          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              data={receipts}
              columns={columns}
              onSelect={handleSelectPickupOrder} // Make sure this line is correct
              selectedRow={selectedPickupOrder}
              onDelete={handleDeletePickupOrder}
              onEdit={handleEditreceipts}
              onAdd={handleAddPickupOrder}
              title="Warehouse Receipts"
              setData={setreceipts}
            />

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Receipt Order deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Receipt. Please try again</strong>
              </Alert>
            )}

            {selectedPickupOrder !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ReceiptCreationForm
                  pickupOrder={selectedPickupOrder}
                  closeModal={closeModal}
                  creating={false}
                  onpickupOrderDataChange={handlereceiptsDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />
              </ModalForm>
            )}

            {selectedPickupOrder === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ReceiptCreationForm
                  pickupOrder={null}
                  closeModal={closeModal}
                  creating={true}
                  onpickupOrderDataChange={handlereceiptsDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
