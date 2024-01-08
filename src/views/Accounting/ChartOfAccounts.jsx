import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ChartOfAccountsCreationForm  from "../forms/ChartOfAccountsCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const ChartOfAccounts   = () => {
  const [chartofAccounts, setChartOfAccounts] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedChartOfAccounts , setSelectedChartOfAccounts] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false);


  const [showContextMenu, setShowContextMenu] = useState(false);

  const columns = [
    "Name",
    "Type Chart",
    "Account Number",
    "Currency",
    "Note",

  ];

  const {hideShowSlider} = useContext(GlobalContext);

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

  const updateChartOfAccounts = (url = null) => {
    ChartOfAccountsService.getChartOfAccounts(url)
      .then((response) => {
        const newChartOfAccounts  = response.data.results.filter((ChartAccounts) => {
          const ChartAccountId  = ChartAccounts.id;
          return !chartofAccounts.some(
            (existingPickupOrder) => existingPickupOrder.id === ChartAccountId 
          );
        });

        setChartOfAccounts([...response.data.results].reverse());
        console.log("NEW ORDERS", [...chartofAccounts, ...newChartOfAccounts ]);
        

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
      updateChartOfAccounts();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateChartOfAccounts(nextPageURL);
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

  const handleChartOfAccountDataChange = () => {
    updateChartOfAccounts();
  };

  const handleSelectChartOfAccounts = (PickupOrder) => {
    setSelectedChartOfAccounts(PickupOrder);
  };

  const handleEditChartOfAccounts = () => {
    if (selectedChartOfAccounts ) {
      openModal();
    } else {
      alert("Please select a ChartOfAccounts   Order to edit.");
    }
  };

  const handleAddChartOfAccounts = () => {
    openModal();
  };

  const handleDeleteChartOfAccounts = () => {
    if (selectedChartOfAccounts ) {
      ChartOfAccountsService.deleteChartOfAccounts(selectedChartOfAccounts .id)
        .then((response) => {
          if (response.status == 200) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            const newChartOfAccounts = chartofAccounts.filter((order) => order.id !== selectedChartOfAccounts.id);
            setChartOfAccounts(newChartOfAccounts);
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
      alert("Please select a ChartOfAccounts   Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPickupOrdersButton && !isTableRow) {
        setSelectedChartOfAccounts(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);
  

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
          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              data={chartofAccounts}
              columns={columns}
              onSelect={handleSelectChartOfAccounts} // Make sure this line is correct
              selectedRow={selectedChartOfAccounts }
              onDelete={handleDeleteChartOfAccounts}
              onEdit={handleEditChartOfAccounts}
              onAdd={handleAddChartOfAccounts}
              title="Chart Of Accounts"
              setData={setChartOfAccounts}
              showContextMenu={showContextMenu}
              setShowContextMenu={setShowContextMenu}
              contextMenuOptions={contextMenuOptions}
            >
              {selectedChartOfAccounts === null && (
                <ChartOfAccountsCreationForm
                  payments={null}
                  closeModal={closeModal}
                  creating={true}
                  onDataChange={handleChartOfAccountDataChange}
                />
              )}

              {selectedChartOfAccounts !== null && (
                <ChartOfAccountsCreationForm
                  ChartAccounts={selectedChartOfAccounts}
                  closeModal={closeModal}
                  creating={false}
                  onDataChange={handleChartOfAccountDataChange}
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
                <strong>Chart Of Account deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Chart Of Account. Please try again</strong>
              </Alert>
            )}

            {selectedChartOfAccounts  !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ChartOfAccountsCreationForm 
                  ChartAccounts={selectedChartOfAccounts }
                  closeModal={closeModal}
                  creating={false}
                  onDataChange={handleChartOfAccountDataChange}
                />
              </ModalForm>
            )}

            {selectedChartOfAccounts  === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ChartOfAccountsCreationForm 
                  ChartAccounts={null}
                  closeModal={closeModal}
                  creating={true}
                  onDataChange={handleChartOfAccountDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartOfAccounts  ;
