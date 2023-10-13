import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ItemAndServiceCreationForm from "../forms/ItemAndServiceCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import Sidebar from "../shared/components/SideBar";

const ChartOfAccounts = () => {

  return (
    <>
    <div className="dashboard__sidebar">
      <div className="dashboard__sidebar">
        <Sidebar />
      <div className="content-page">
        <Table
        //   data={itemsAndServices}
        //   columns={columns}
        //   onSelect={handleSelectItemAndService} // Make sure this line is correct
        //   selectedRow={selectedeItemAndService}
        //   onDelete={handleDeleteItemAndService}
        //   onEdit={handleEditItemAndService}
        //   onAdd={handleAddItemAndService}
        //   title="Items & Services"
        />

        {/* {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Item and Service deleted successfully!</strong>
          </Alert>
        )} */}
        {/* {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Item and Service. Please try again</strong>
          </Alert>
        )} */}

        {/* {selectedeItemAndService !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <ItemAndServiceCreationForm
              itemAndService={selectedeItemAndService}
              closeModal={closeModal}
              creating={false}
              onitemAndServiceDataChange={handleItemAndServiceDataChange}
            />
          </ModalForm>
        )} */}

        {/* {selectedeItemAndService === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <ItemAndServiceCreationForm
              itemAndService={null}
              closeModal={closeModal}
              creating={true}
              onitemAndServiceDataChange={handleItemAndServiceDataChange}
            />
          </ModalForm>
        )} */}
        </div>
      </div>
    </div>
    </>
  );
}

export default ChartOfAccounts;