import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import Sidebar from "../shared/components/SideBar";
import { useModal } from "../../hooks/useModal";
import { GlobalContext } from "../../context/global";

import BillsCreationForm from "../forms/BillsCreationForm";
import BillsService from "../../services/BillsService";

import BillsPayForm from "../forms/BillsPayForm";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedBills, setSelectedBills] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const {hideShowSlider} = useContext(GlobalContext);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false); /////////
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [
    isOpenReceiptCreation,
    openModalReceiptCreation,
    closeModalReceiptCreation,
  ] = useModal(false);

  const columns = [
    // "Status",
    "Number",
    "Payment Terms",
    "Type",
    "Applied to",
    "Transaction Date",
    "Due Date",
    "Employee",
    "Account Type",
    "Exported",
    "Amt. Paid(USD)",
    "Amt. Due(USD)",
    "Currency",
    "Bill PDF",
  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  const updateBill = (url = null) => {
    BillsService.getBills(url)
      .then((response) => {
        const newBill = response.data.results.filter((bill) => {
          const BillId = bill.id;
          return !bills.some(
            (existingPickupOrder) => existingPickupOrder.id === BillId
          );
        });

        setBills([...response.data.results].reverse());
        console.log("NEW ORDERS", [...bills, ...newBill]);

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
      updateBill();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateBill(nextPageURL);
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

  const handleBillsDataChange = () => {
    updateBill();
  };

  const handleSelectBills = (bill) => {
    setSelectedBills(bill);
  };

  const handleEditBills = () => {
    if (selectedBills) {
      openModal();
    } else {
      alert("Please select a Bills to edit.");
    }
  };

  const handleAddBills = () => {
    openModal();
  };

  const handleDeleteBills = () => {
    if (selectedBills) {
      BillsService.deleteBill(selectedBills.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            // updateBill();
            const newBill = bills.filter(
              (order) => order.id !== selectedBills.id
            );
            setBills(newBill);
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
      alert("Please select a Bills to delete.");
    }
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
  }, [showContextMenu]);

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isBillsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isBillsButton && !isTableRow) {
        setSelectedBills(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handlePayBills = () => {
    if (selectedBills) {
      openModal();
    } else {
      alert("Please select a Bills to edit.");
    }
  };

  //-------------------------------------------------------------------------------------
  useEffect(() => {
    if (createWarehouseReceipt) {
      console.log("OPENING UP NEW MODAL FOR RECEIPTS");
      openModalReceiptCreation();
    }
  }, [createWarehouseReceipt]);

  // const setInTransit = async () => {
  //   console.log("PROBANDO");
  //   // openModal();
  // }
  // const setprueba = async () => {
  //   console.log("Pr0b4nd0");
  //   handlePayBills();
  // }

  const contextMenuOptions = [
    {
      label: "Pay Bill",
      handler: () => setCreateWarehouseReceipt(true),
    },
    // {
    //   label: "Prueba-1",
    //   handler: setInTransit,
    // },
    // {
    //   label: "Prueba-2",
    //   handler: setprueba,
    // },
  ];

  const handleClose = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="dashboard__sidebar">
        <div className="dashboard__sidebar">
          <Sidebar />
          <div
            className="content-page"
            style={
              !hideShowSlider
                ? { marginLeft: "22rem", width: "calc(100vw - 250px)" }
                : { marginInline: "auto" }
            }
          >
            <Table
              data={bills}
              columns={columns}
              onSelect={handleSelectBills} // Make sure this line is correct
              selectedRow={selectedBills}
              onDelete={handleDeleteBills}
              onEdit={handleEditBills}
              onAdd={handleAddBills}
              contextMenuPosition={contextMenuPosition}
              contextMenuOptions={contextMenuOptions}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              setShowContextMenu={setShowContextMenu}
              title="Bills"
            >
              {selectedBills === null && (
                <BillsCreationForm
                  bill={null}
                  closeModal={handleClose}
                  creating={true}
                  onbillDataChange={handleBillsDataChange}
                />
              )}

              {selectedBills !== null && (
                <BillsCreationForm
                  bill={selectedBills}
                  closeModal={handleClose}
                  creating={false}
                  onbillDataChange={handleBillsDataChange}
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
                <strong>Bills deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Bills. Please try again</strong>
              </Alert>
            )}

            {selectedBills !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <BillsCreationForm
                  bill={selectedBills}
                  closeModal={closeModal}
                  creating={false}
                  onbillDataChange={handleBillsDataChange}
                />
              </ModalForm>
            )}

            {selectedBills === null && createWarehouseReceipt && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <BillsCreationForm
                  bill={null}
                  closeModal={closeModal}
                  creating={true}
                  onbillDataChange={handleBillsDataChange}
                />
              </ModalForm>
            )}
            {/* //---------------------------------------------------------- */}
            {selectedBills !== null && createWarehouseReceipt && (
              <ModalForm
                isOpen={isOpenReceiptCreation}
                closeModal={closeModalReceiptCreation}
              >
                <BillsPayForm
                  pickupOrder={selectedBills}
                  closeModal={closeModalReceiptCreation}
                  creating={true}
                  onpickupOrderDataChange={handleBillsDataChange}
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

export default Bills;
