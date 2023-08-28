import { useState, useEffect } from "react";
import Table from "./shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "./shared/components/ModalForm";
import LocationsCreationForm from "./forms/LocationCreationForm";
import { useModal } from "../hooks/useModal"; // Import the useModal hook
import LocationService from "../services/LocationService";
import Sidebar from "./shared/components/SideBar";

const Locations = () => {
  const [locations, setlocations] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedLocation, setselectedLocation] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const columns = [
    "Status",
    "Code",
    "Description",
    "Empty",
    "Type",
    "Zone",
    "Length",
    "Width",
    "Height",
    "Volume",
    "Weight",
    "Max. Weight",
    "Disable",
  ];
  const fetchlocationsData = () => {
    LocationService.getLocations()
      .then((response) => {
        setlocations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchlocationsData();
  }, []);

  const handlelocationsDataChange = () => {
    fetchlocationsData();
  };

  const handleAddLocation = () => {
    openModal();
  };

  const handleEditLocation = () => {
    if (selectedLocation) {
      openModal();
    } else {
      alert("Please select a Location to edit.");
    }
  };

  const handleSelectLocation = (wp) => {
    setselectedLocation(wp);
  };

  const handleDeleteLocation = () => {
    if (selectedLocation) {
      LocationService.deleteLocation(selectedLocation.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 3000);
            fetchlocationsData();
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
      alert("Please select a Location to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      // Check if the click is inside the table or not
      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".locations-table__row");

      if (!isWPButton && !isTableRow) {
        setselectedLocation(null);
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
        <Sidebar />
      </div>
      <div className="content-page">
        <Table
          data={locations}
          columns={columns}
          onSelect={handleSelectLocation} // Make sure this line is correct
          selectedRow={selectedLocation}
          onDelete={handleDeleteLocation}
          onEdit={handleEditLocation}
          onAdd={handleAddLocation}
          title="Locations"
        />

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Location deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Location. Please try again</strong>
          </Alert>
        )}
        {selectedLocation !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <LocationsCreationForm
              location={selectedLocation}
              closeModal={closeModal}
              creating={false}
              onlocationDataChange={handlelocationsDataChange}
            />
          </ModalForm>
        )}
        {selectedLocation === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <LocationsCreationForm
              location={null}
              closeModal={closeModal}
              creating={true}
              onlocationDataChange={handlelocationsDataChange}
            />
          </ModalForm>
        )}
      </div>
    </>
  );
};

export default Locations;
