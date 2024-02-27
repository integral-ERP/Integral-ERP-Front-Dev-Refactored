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
  const { hideShowSlider } = useContext(GlobalContext)
  const [receipts, setreceipts] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPickupOrder, setSelectedPickupOrder] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [createReceiptOrder, setCreateReceiptOrder] = useState(true);
  const columns = [
    "Status",
    "Number",
    "Date",
    "Shipper Name",
    "Consignee Name",
    "Carrier Name",
    "Pieces",
    "Weight",
    "View Receipt PDF",
  ];

  const updatereceipts = (url = null) => {
    ReceiptService.getReceipts(url)
      .then((response) => {
        const newreceipts = response.data.results.filter((pickupOrder) => {
          const pickupOrderId = pickupOrder.id;
          return !receipts.some((existingPickupOrder) => existingPickupOrder.id === pickupOrderId);
        });

        setreceipts([...receipts, ...newreceipts].reverse());

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

      const number = receipts[0]?.number || 0;

      setcurrentPickupNumber(number);
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

      observer.disconnect();
    };
  }, [nextPageURL]);

  const handlereceiptsDataChange = () => {
    updatereceipts();
  };

  const handleSelectPickupOrder = (PickupOrder) => {
    setSelectedPickupOrder(PickupOrder);

  };

  const handleEditreceipts = () => {
    if (selectedPickupOrder) {
      setIsEdit(true);
      setCreateReceiptOrder(false);
      openModal();
    } else {
      alert("Please select a Pickup Order to edit.");
    }
  };

  const handleAddPickupOrder = () => {
    setCreateReceiptOrder(true);
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

          } else {
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 3000);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Please select a Pickup Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isreceiptsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      const isInsideCompanyFormPickup = clickedElement.closest(".company-form");
      const isSelectMenu = event.target.id.includes("react-select");

      if (!isreceiptsButton && !isTableRow && !isEdit && !isInsideCompanyFormPickup && !isSelectMenu) {
        setSelectedPickupOrder(null);

      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  },);

  const handleCancel = () => {
    window.location.reload();
  }

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
              contextService={ReceiptService}
              importEnabled={false}
            >
              {selectedPickupOrder !== null && (

                <ReceiptCreationForm
                  pickupOrder={selectedPickupOrder}
                  closeModal={handleCancel}
                  creating={false}
                  onpickupOrderDataChange={handlereceiptsDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                />

              )}

              {selectedPickupOrder === null && (

                <ReceiptCreationForm
                  pickupOrder={null}
                  closeModal={handleCancel}
                  creating={createReceiptOrder}
                  onpickupOrderDataChange={handlereceiptsDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
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

            {/* {selectedPickupOrder !== null && (
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
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
