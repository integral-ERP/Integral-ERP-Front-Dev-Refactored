import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ForwardingAgentsCreationForm from "../forms/ForwardingAgentCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ForwardingAgentService from "../../services/ForwardingAgentService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const ForwardingAgents = () => {
  const [forwardingAgents, setforwardingAgents] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Name",
    "Phone",
    "Mobile Phone",
    "Email",
    "Fax",
    "Website",
    "Reference Number",
    "Contact First Name",
    "Contact Last Name",
    "ID",
    "Type ID",
    "System ID",
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",
    "Parent Account",
    "Carrier Type",
    "Method Code",
    "Carrier Code",
    "SCAC Number",
    "IATA Code",
    "Airline Code",
    "Airline Prefix",
    "Airway Bill Numbers",
    "Passenger Only Airline",
  ];
  const [selectedForwardingAgent, setselectedForwardingAgent] = useState(null);
  const {hideShowSlider} = useContext(GlobalContext);

  const fetchForwardingAgentsData = (url = null) => {
    ForwardingAgentService.getForwardingAgents(url)
      .then((response) => {
        setforwardingAgents([...forwardingAgents, ...response.data.results].reverse());
        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if(!initialDataFetched){
      fetchForwardingAgentsData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchForwardingAgentsData(nextPageURL);
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

  const handleWarehouseProviderDataChange = () => {
    fetchForwardingAgentsData();
  };

  const handleEditForwardingAgent = () => {
    if (selectedForwardingAgent) {
      openModal();
    } else {
      alert("Please select a Forwarding Agent to edit.");
    }
  };

  const handleSelectForwardingAgent = (wp) => {
    setselectedForwardingAgent(wp);
  };

  const handleAddForwardingAgent = () => {
    openModal();
  };
  const handleDeleteForwardingAgent = () => {
    if (selectedForwardingAgent) {
      ForwardingAgentService.deleteForwardingAgent(selectedForwardingAgent.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            const newreceipts = forwardingAgents.filter((order) => order.id !== selectedForwardingAgent.id);
            setforwardingAgents(newreceipts);
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
      alert("Please select a Forwarding Agent to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isWPButton && !isTableRow) {
        setselectedForwardingAgent(null);
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
          data={forwardingAgents}
          columns={columns}
          onSelect={handleSelectForwardingAgent} // Make sure this line is correct
          selectedRow={selectedForwardingAgent}
          onDelete={handleDeleteForwardingAgent}
          onEdit={handleEditForwardingAgent}
          onAdd={handleAddForwardingAgent}
          contextService={ForwardingAgentService}
          title="Forwarding Agents"
        />

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Forwarding Agent deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Forwarding Agent. Please try again</strong>
          </Alert>
        )}
        {selectedForwardingAgent !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <ForwardingAgentsCreationForm
              forwardingAgent={selectedForwardingAgent}
              closeModal={closeModal}
              creating={false}
              onForwardingAgentDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
        {selectedForwardingAgent === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <ForwardingAgentsCreationForm
              forwardingAgent={null}
              closeModal={closeModal}
              creating={true}
              onForwardingAgentDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
        </div>
        </div>
      </div>
    </>
  );
};

export default ForwardingAgents;
