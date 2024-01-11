import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PreAlertService from "../../services/PreAlertService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";
import PreAlertCreationForm from "../forms/PreAlertCreationForm";

const PreAlerts = () => {
  const { hideShowSlider } = useContext(GlobalContext);
  const [preAlerts, setpreAlerts] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPreAlert, setselectedPreAlert] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [currentReleaseNumber, setcurrentReleaseNumber] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [createReleaseOrder, setCreatePreAlert] = useState(true);
  const columns = [
    " Date",
    "Client",
    "Tracking Number",
    "Store",
    "Transport Company",
    "Packages",
  ];

  const updatePreAlerts = (url = null) => {
    PreAlertService.getPreAlerts(url)
      .then((response) => {
        const newreleises = response.data.results.filter((release) => {
          const pickupOrderId = release.id;
          return !preAlerts.some(
            (existingPickupOrder) => existingPickupOrder.id === pickupOrderId
          );
        });

        setpreAlerts([...preAlerts, ...newreleises].reverse());
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
      updatePreAlerts();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      const number = preAlerts[0]?.number || 0;
      setcurrentReleaseNumber(number);
    }
  }, [preAlerts]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatePreAlerts(nextPageURL);
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

  const handlePreAlertsDataChange = () => {
    updatePreAlerts();
  };

  const handleSelectPreAlert = (releaseOrder) => {
    setselectedPreAlert(releaseOrder);
  };

  const handleEditPreAlerts = () => {
    if (selectedPreAlert) {
      setIsEdit(true);
      openModal();
      setCreatePreAlert(false);
    } else {
      alert("Please select a Pre Alert to edit.");
    }
  };

  const handleAddPreAlert = () => {
    setCreatePreAlert(true);
    openModal();
  };

  const handleDeletePreAlert = () => {
    if (selectedPreAlert) {
      PreAlertService.deletePreAlert(selectedPreAlert.id)
        .then((response) => {
          if (response.status == 204) {
            const newreceipts = preAlerts.filter(
              (order) => order.id !== selectedPreAlert.id
            );
            setpreAlerts(newreceipts);
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
      alert("Please select a Pre Alert to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isreceiptsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      const isInsideCompanyFormPickup = clickedElement.closest(".company-form");
      const isSelectMenu = event.target.id.includes("react-select");

      if (
        !isreceiptsButton &&
        !isTableRow &&
        !isEdit &&
        !isInsideCompanyFormPickup &&
        !isSelectMenu
      ) {
        setselectedPreAlert(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="dashboard__layout">
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
              data={preAlerts}
              columns={columns}
              onSelect={handleSelectPreAlert} // Make sure this line is correct
              selectedRow={selectedPreAlert}
              onDelete={handleDeletePreAlert}
              onEdit={handleEditPreAlerts}
              onAdd={handleAddPreAlert}
              title="Pre Alerts"
              setData={setpreAlerts}
              contextService={PreAlertService}
              importEnabled={false}
            >
              {selectedPreAlert !== null && (
                <PreAlertCreationForm
                  preAlert={selectedPreAlert}
                  closeModal={handleCancel}
                  creating={false}
                  onPreAlertDataChange={handlePreAlertsDataChange}
                />
              )}

              {selectedPreAlert === null && (
                <PreAlertCreationForm
                  preAlert={null}
                  closeModal={handleCancel}
                  creating={createReleaseOrder}
                  onPreAlertDataChange={handlePreAlertsDataChange}
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
                <strong>Pre Alert deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Pre Alert. Please try again</strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PreAlerts;
