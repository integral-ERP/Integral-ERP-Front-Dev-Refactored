import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ChartOfAccountsCreationForm from "../forms/ChartOfAccountsCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import Sidebar from "../shared/components/SideBar";

const ChartOfAccounts = () => {
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedChartOfAccounts, setSelectedChartOfAccounts] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Name",
    "Type",
    "Account Number",
    // "Parent Account",
    "Currency",
    "Note",
  ];
  const updateChartOfAccounts = (url = null) => {
    ChartOfAccountsService.getChartOfAccounts(url)
      .then((response) => {
        setChartOfAccounts(
          [...chartOfAccounts, ...response.data.results].reverse()
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

  const handleChartOfAccountsDataChange = () => {
    updateChartOfAccounts();
  };

  const handleSelectChartOfAccounts = (chartOfAccount) => {
    setSelectedChartOfAccounts(chartOfAccount);
  };

  const handleEditChartOfAccounts = () => {
    if (selectedChartOfAccounts) {
      openModal();
    } else {
      alert("Please select a Chart Of Accounts to edit.");
    }
  };

  const handleAddChartOfAccounts = () => {
    openModal();
  };

  const handleDeleteChartOfAccounts = () => {
    if (selectedChartOfAccounts) {
      ChartOfAccountsService.deleteChartOfAccounts(selectedChartOfAccounts.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            updateChartOfAccounts();
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
      alert("Please select a Chart Of Accounts to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isChartOfAccountsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isChartOfAccountsButton && !isTableRow) {
        setSelectedChartOfAccounts(null);
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
              data={chartOfAccounts}
              columns={columns}
              onSelect={handleSelectChartOfAccounts} // Make sure this line is correct
              selectedRow={selectedChartOfAccounts}
              onDelete={handleDeleteChartOfAccounts}
              onEdit={handleEditChartOfAccounts}
              onAdd={handleAddChartOfAccounts}
              title="Chart Of Accounts"
            />

            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>Chart Of Accounts deleted successfully!</strong>
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
                  Error deleting Chart Of Accounts. Please try again
                </strong>
              </Alert>
            )}

            {selectedChartOfAccounts !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ChartOfAccountsCreationForm
                  chartOfAccount={selectedChartOfAccounts}
                  closeModal={closeModal}
                  creating={false}
                  onChartOfAccountsDataChange={handleChartOfAccountsDataChange}
                />
              </ModalForm>
            )}

            {selectedChartOfAccounts === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <ChartOfAccountsCreationForm
                  chartOfAccount={null}
                  closeModal={closeModal}
                  creating={true}
                  onChartOfAccountsDataChange={handleChartOfAccountsDataChange}
                />
              </ModalForm>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartOfAccounts;
