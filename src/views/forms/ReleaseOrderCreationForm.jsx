import { useState, useEffect, useContext } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import CarrierService from "../../services/CarrierService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ForwardingAgentService from "../../services/ForwardingAgentService";
import CustomerService from "../../services/CustomerService";
import VendorService from "../../services/VendorService";
import EmployeeService from "../../services/EmployeeService";
import Input from "../shared/components/Input";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReceiptService from "../../services/ReceiptService";
import AsyncSelect from "react-select/async";
import ReleaseService from "../../services/ReleaseService";

const ReleaseOrderCreationForm = ({
  releaseOrder,
  closeModal,
  creating,
  onReleaseOrderDataChange,
  currentReleaseNumber,
  setcurrentReleaseNumber,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [allStateUpdatesComplete, setAllStateUpdatesComplete] = useState(false);
  const [issuedByOptions, setIssuedByOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [releasedToOptions, setReleasedToOptions] = useState([]);
  const [clientToBill, setClientToBill] = useState(null);
  const [releasedTo, setReleasedTo] = useState(null);
  const today = dayjs().format("YYYY-MM-DD");
  const pickupNumber = currentReleaseNumber ? currentReleaseNumber + 1 : 1;
  const [canRender, setcanRender] = useState(false);
  const [commodities, setcommodities] = useState([]);
  const [releaseIDs, setreleaseIDs] = useState([]);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [warehouseReceipts, setWarehouseReceipts] = useState([]);
  const formFormat = {
    status: 14,
    number: pickupNumber,
    creation_date: today,
    release_date: today,
    employeeId: "",
    issuedById: "",
    issuedByType: "",
    releasedToId: "",
    releasedToType: "",
    releasedToInfo: "",
    clientToBillId: "",
    clientToBillType: "",
    carrierId: "",
    pro_number: "",
    tracking_number: "",
    purchase_order_number: "",
    warehouseReceiptId: "",
    commodities: [],
  };

  const [formData, setFormData] = useState(formFormat);

  const handleIssuedBySelection = async (event) => {
    const id = event.id;
    const type = event.type;
    const result = await ForwardingAgentService.getForwardingAgentById(id);
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
      }`;
    setFormData({
      ...formData,
      issuedById: id,
      issuedByType: type,
    });
  };

  const handleEmployeeSelection = async (event) => {
    const id = event.id;
    console.log(
      "employee selected:",
      id,
      "employeeid in form",
      formData.employeeId,
      formData
    );
    setFormData({
      ...formData,
      employeeId: id,
    });
  };

  const handleClientToBillSelection = async (event) => {
    console.log(event.target);
    const type = event.target?.value || "";
    if (type === "other") {
      setFormData({ ...formData, clientToBillType: type });
    } else if (type === "releasedTo") {
      setFormData({
        ...formData,
        clientToBillType: formData.releasedToType,
        clientToBillId: formData.releasedToId,
      });
      console.log(
        "CHANGING CLIENT TO BILL TYPE",
        type,
        "RELEASE ID",
        formData.releasedToId,
        "RELEASE TYPE",
        formData.releasedToType
      );
    } else {
      const id = event.id;
      const type = event.type;
      console.log("id", id, "type", type);
      setFormData({ ...formData, clientToBillType: type, clientToBillId: id });
    }
  };

  const handleMainCarrierSelection = async (event) => {
    const id = event.id;
    setFormData({
      ...formData,
      carrierId: id,
    });
  };

  const handleReleasedToSelection = async (event) => {
    const id = event.id;
    const type = event.type;
    let result;
    if (type === "customer") {
      result = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      result = await VendorService.getVendorByID(id);
    }
    if (type === "agent") {
      result = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if (type === "carrier") {
      result = await CarrierService.getCarrierById(id);
    }
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
      }`;
    setFormData({
      ...formData,
      releasedToId: id,
      releasedToInfo: info,
      releasedToType: type,
    });
  };

  const handleReceiptSelection = (receiptNumber) => {
    if (selectedReceipts.includes(receiptNumber)) {
      setSelectedReceipts(
        selectedReceipts.filter((num) => num !== receiptNumber)
      );
    } else {
      setSelectedReceipts([...selectedReceipts, receiptNumber]);
    }
  };

  // Function to handle selecting/unselecting a commodity within a receipt
  const handleCommoditySelection = (receiptNumber, commodityID, id) => {
    // TODO: FIX BUG MULTIPLE COMMODITIES WITH SAME ID
    const commodityList = [];
    const set = new Set(releaseIDs);
    set.add(id);
    setreleaseIDs([...set]);
    warehouseReceipts.forEach((receipt) => {
      commodityList.push(...receipt.commodities);
    });
    const commodity = commodityList.find((com) => com.id == commodityID); // Use === to compare IDs

    setcommodities([...commodities, commodity]);
  };

  useEffect(() => {
    console.log(
      "checking for edit",
      "join:",
      !creating && releaseOrder != null
    );
    if (!creating && releaseOrder != null) {
      setcommodities(releaseOrder.commodities);
      console.log("Selected Release Order:", releaseOrder);
      let updatedFormData = {
        status: releaseOrder.status,
        number: releaseOrder.number,
        creation_date: releaseOrder.creation_date,
        release_date: releaseOrder.release_date,
        employeeId: releaseOrder.employeeId,
        issuedById: releaseOrder.issuedById,
        issuedByType: releaseOrder.issuedByType,
        releasedToId: releaseOrder.releasedToId,
        releasedToType: releaseOrder.releasedToType,
        releasedToInfo: releaseOrder.releasedToInfo,
        clientToBillId: releaseOrder.clientToBillId,
        clientToBillType: releaseOrder.clientToBillType,
        carrierId: releaseOrder.carrierId,
        pro_number: releaseOrder.pro_number,
        tracking_number: releaseOrder.tracking_number,
        purchase_order_number: releaseOrder.purchase_order_number,
        warehouseReceiptId: releaseOrder.warehouseReceiptId,
        commodities: releaseOrder.commodities,
        charges: releaseOrder.charges
      };
      console.log("Form Data to be updated:", updatedFormData);
      setFormData(updatedFormData);
      setcanRender(true);
    }
  }, [creating, releaseOrder]);

  const fetchFormData = async () => {
    const forwardingAgents = (
      await ForwardingAgentService.getForwardingAgents()
    ).data.results;
    const customers = (await CustomerService.getCustomers()).data.results;
    const vendors = (await VendorService.getVendors()).data.results;
    const employees = (await EmployeeService.getEmployees()).data.results;
    const carriers = (await CarrierService.getCarriers()).data.results;

    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));

    const forwardingAgentsWithType = addTypeToObjects(
      forwardingAgents,
      "forwarding-agent"
    );
    const customersWithType = addTypeToObjects(customers, "customer");
    const vendorsWithType = addTypeToObjects(vendors, "vendor");
    const employeesWithType = addTypeToObjects(employees, "employee");
    const carriersWithType = addTypeToObjects(carriers, "carrier");

    const issuedByOptions = [...forwardingAgentsWithType];
    const employeeOptions = [...employeesWithType];
    const releasedToOptions = [
      ...customersWithType,
      ...vendorsWithType,
      ...forwardingAgentsWithType,
      ...carriersWithType,
    ];

    const carrierOptions = [...carriersWithType];
    setReleasedToOptions(releasedToOptions);
    setIssuedByOptions(issuedByOptions);
    setEmployeeOptions(employeeOptions);
    setCarrierOptions(carrierOptions);
  };

  const addTypeToObjects = (arr, type) =>
    arr.map((obj) => ({ ...obj, type }));

  const loadIssuedBySelectOptions = async (inputValue) => {
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    ))];

    return options;
  };

  const loadEmployeeSelectOptions = async (inputValue) => {

    const response = await EmployeeService.search(inputValue);
    const data = response.data.results;

    const options = addTypeToObjects(
      data,
      "employee"
    );

    console.log("SEARCH FOR EMPLOYEE:", data, response, "options", options);
    return options;
  };

  const loadCarrierSelectOptions = async (inputValue) => {
    const responseCarriers = (await CarrierService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(responseCarriers, "carrier"))];

    return options;
  };

  const loadReleasedToOptionsSelectOptions = async (inputValue) => {

    const responseCustomers = (await CustomerService.search(inputValue)).data.results;
    const responseVendors = (await VendorService.search(inputValue)).data.results;
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;
    const responseCarriers = (await CarrierService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseVendors,
      "vendor"
    )), ...(addTypeToObjects(
      responseCustomers,
      "customer"
    )), ...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    )), ...(addTypeToObjects(responseCarriers, "carrier"))];

    return options;
  };

  const fetchReceipts = async () => {
    ReceiptService.getReceipts()
      .then((response) => {
        const newreceipts = response.data.results;
        setWarehouseReceipts([...newreceipts]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (creating) {
      fetchFormData();
    }
    fetchReceipts();
  }, []);

  useEffect(() => {
    if (creating) {
      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  useEffect(() => {

    // this might be with selected receipts instead of commodities
    if (commodities.length > 0) {
      setFormData({ ...formData, status: 1 })
    }

  }, [commodities])


  const sendData = async () => {
    let releasedToName = "";
    if (formData.releasedToType === "customer") {
      releasedToName = "customerid";
    }
    if (formData.releasedToType === "vendor") {
      releasedToName = "vendorid";
    }
    if (formData.releasedToType === "agent") {
      releasedToName = "agentid";
    }
    if (formData.releasedToType === "carrier") {
      releasedToName = "carrierid";
    }

    if (releasedToName !== "") {
      const releasedToC = {
        [releasedToName]: formData.releasedToId,
      };

      const response = await ReleaseService.createReleasedTo(releasedToC);
      if (response.status === 201) {
        console.log("RELEASED TO ID", response.data.id);
        setReleasedTo(response.data.id);
      }
    }
    let clientToBillName = "";

    if (formData.clientToBillType === "releasedTo") {
      switch (formData.releasedToType) {
        case "customer":
          clientToBillName = "customerid";
          break;
        case "vendor":
          clientToBillName = "vendorid";
          break;
        case "agent":
          clientToBillName = "agentid";
          break;
        case "carrier":
          clientToBillName = "carrierid";
          break;
        default:
          break;
      }
    }
    if (formData.clientToBillType === "customer") {
      clientToBillName = "customerid";
    }
    if (formData.clientToBillType === "vendor") {
      clientToBillName = "vendorid";
    }
    if (formData.clientToBillType === "agent") {
      clientToBillName = "agentid";
    }
    if (formData.clientToBillType === "carrier") {
      clientToBillName = "carrierid";
    }
    if (clientToBillName !== "") {
      const clientToBill = {
        [clientToBillName]: formData.clientToBillId,
      };

      const response = await ReleaseService.createClientToBill(clientToBill);
      if (response.status === 201) {
        console.log("CLIENT TO BILL ID", response.data.id);
        setClientToBill(response.data.id);
      }
    }
    console.log(
      "SENDING DATA",
      clientToBillName,
      "type",
      formData.clientToBillType
    );
  };

  const checkUpdatesComplete = () => {
    if (releasedTo !== null && clientToBill !== null) {
      setAllStateUpdatesComplete(true);
    }
  };

  const addSingleCommodity = (commodity) => {
    setcommodities([...commodities, commodity]);
    console.log("COMMODITIES", commodities);
  };

  useEffect(() => {
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {

      let charges = [];

      releaseIDs.forEach((id) => {
        const order = warehouseReceipts.find(receipt => receipt.id == id);
        charges = [...charges, order.charges];
      })

      console.log("CARGOS", charges);
      const createPickUp = async () => {
        let rawData = {
          status: formData.status,
          number: formData.number,
          creation_date: formData.creation_date,
          release_date: formData.release_date,
          employee: formData.employeeId,
          issued_by: formData.issuedById,
          issuedByType: formData.issuedByType,
          released_to: releasedTo,
          releasodToType: formData.releasedToType,
          client_to_bill: clientToBill,
          client_to_bill_type: formData.clientToBillType,
          carrier: formData.carrierId,
          pro_number: formData.pro_number,
          tracking_number: formData.tracking_number,
          purchase_order_number: formData.purchase_order_number,
          warehouse_receipt: formData.warehouseReceiptId,
          commodities: commodities,
        };
        const response = await (creating
          ? ReleaseService.createRelease(rawData)
          : ReleaseService.updateRelease(releaseOrder.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
          console.log(
            "Release Order successfully created/updated:",
            response.data
          );
          setcurrentReleaseNumber(currentReleaseNumber + 1);
          setShowSuccessAlert(true);
          setTimeout(() => {
            closeModal();
            onReleaseOrderDataChange();
            setShowSuccessAlert(false);
            setFormData(formFormat);
            window.location.reload();
          }, 2000);
        } else {
          console.log("Something went wrong:", response);
          setShowErrorAlert(true);
        }
      };
      createPickUp();
    }
  }, [allStateUpdatesComplete, clientToBill]);

  const [colorTab, setcolorTab] = useState(true);
  useEffect(() => {
    const listItems = document.querySelectorAll(".nav-item")
    if (!listItems) return
    for (const item of listItems) {
      item.addEventListener("click", () => {
        setcolorTab(false)
      })
    }
  }, [])
  return (


    <div className="company-form release-order">
      <div className="name">Release creation form </div>
      <div className="form-label_name"><h3>General</h3><span></span></div>
      <div className="creation creation-container w-100">
        <div className="row align-items-center">

          <div className="col-4 text-start">
            <Input
              type="number"
              inputName="number"
              placeholder="Number..."
              value={formData.number}
              readonly={true}
              label="Release Number"
            />
          </div>

          <div className="col-4 text-start">
            <label htmlFor="employee" className="form-label">
              Employee:
            </label>
            <AsyncSelect
              id="employee"
              value={employeeOptions.find(
                (option) => option.id === formData.employeeId
              )}
              onChange={(e) => {
                handleEmployeeSelection(e);
              }}
              isClearable={true}
              defaultOptions={employeeOptions}
              loadOptions={loadEmployeeSelectOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>

          <div className="col-4 text-start">
            <label htmlFor="clientToBill" className="form-label">
              Client to Bill:
            </label>
            <select
              name="clientToBill"
              id="clientToBill"
              onChange={(e) => {
                handleClientToBillSelection(e);
              }}
            >
              <option value="">Select an Option</option>
              <option value="releasedTo">Released To</option>
              <option value="other">Other</option>
            </select>

            <AsyncSelect
              id="releasedToOther"
              isDisabled={formData.clientToBillType !== "other"}
              onChange={(e) => {
                handleClientToBillSelection(e);
              }}
              value={releasedToOptions.find(
                (option) => option.id === formData.releasedToId
              )}
              isClearable={true}
              defaultOptions={releasedToOptions}
              loadOptions={loadReleasedToOptionsSelectOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>

        </div>

        <div className="row align-items-center mb-3">
          <div className="col-4 text-start">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Creation Date and Time"
                className="font-right"
                value={dayjs(formData.createdDateAndTime)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    createdDateAndTime: dayjs(e).format("YYYY-MM-DD"),
                  })
                }
              />
            </LocalizationProvider>
          </div>

          <div className="col-4 text-start">
            <label htmlFor="issuedBy" className="form-label">
              Issued By:
            </label>
            <AsyncSelect
              id="issuedBy"
              value={issuedByOptions.find(
                (option) => option.id === formData.issuedById
              )}
              onChange={(e) => {
                handleIssuedBySelection(e);
              }}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={issuedByOptions}
              loadOptions={loadIssuedBySelectOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>
        </div>

        <div className="row align-items-center mb-3">
          <div className="col-4 text-start">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Release Date and Time"
                className="font-right"
                value={dayjs(formData.createdDateAndTime)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    createdDateAndTime: dayjs(e).format("YYYY-MM-DD"),
                  })
                }
              />
            </LocalizationProvider>
          </div>
          <div className="col-4 text-start">
            <label htmlFor="releasedTo" className="form-label">
              Released To:
            </label>
            {!creating ? (
              canRender && (
                <AsyncSelect
                  id="releasedTo"
                  onChange={(e) => {
                    handleReleasedToSelection(e);
                  }}
                  value={releasedToOptions.find(
                    (option) => option.id === formData.releasedToId
                  )}
                  isClearable={true}
                  defaultOptions={releasedToOptions}
                  loadOptions={loadReleasedToOptionsSelectOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              )
            ) : (
              <AsyncSelect
                id="releasedTo"
                onChange={(e) => {
                  handleReleasedToSelection(e);
                }}
                value={releasedToOptions.find(
                  (option) => option.id === formData.destinationAgentId
                )}
                isClearable={true}
                defaultOptions={releasedToOptions}
                loadOptions={loadReleasedToOptionsSelectOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            )}
          </div>
        </div>
      </div>

      <div className="form-label_name"><h3>Carrier</h3><span></span></div>
      <div className="creation creation-container w-100">
        <div className="row align-items-center mb-3">
          <div className="col-6 text-start">
            <label htmlFor="mainCarrier" className="form-label">
              Carrier:
            </label>
            <AsyncSelect
              id="mainCarrier"
              value={carrierOptions.find(
                (option) => option.id === formData.carrierId
              )}
              onChange={(e) => {
                handleMainCarrierSelection(e);
              }}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={carrierOptions}
              loadOptions={loadCarrierSelectOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>
          <div className="col-6 text-start">
            <Input
              type="text"
              inputName="trackingNumber"
              placeholder="Tracking Number..."
              value={formData.trackingNumber}
              changeHandler={(e) =>
                setFormData({ ...formData, trackingNumber: e.target.value })
              }
              label="Tracking Number"
            />
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-6 text-start">
            <Input
              type="text"
              inputName="proNumber"
              placeholder="PRO Number..."
              value={formData.pro_number}
              changeHandler={(e) =>
                setFormData({ ...formData, pro_number: e.target.value })
              }
              label="PRO Number"
            />
          </div>

          <div className="col-6 text-start">
            <Input
              type="text"
              inputName="purchaseOrderNumber"
              placeholder="Purchase Order Number..."
              value={formData.purchase_order_number}
              changeHandler={(e) =>
                setFormData({
                  ...formData,
                  purchase_order_number: e.target.value,
                })
              }
              label="Purchase Order Number"
            />
          </div>
        </div>
      </div>

      <div className="form-label_name"><h3>Cargo</h3><span></span></div>
      <div className="creation creation-container w-100">
        <div className="row align-items-center">
          <div className="col-6 text-start" style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {warehouseReceipts.map((receipt) => (
              <div key={receipt.number}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedReceipts.includes(receipt.number)}
                    onChange={() => handleReceiptSelection(receipt.number)}
                  />
                  {receipt.number} - {receipt.issued_byObj.name}
                </label>
                {selectedReceipts.includes(receipt.number) &&
                  receipt.commodities.length > 0 && (
                    <select
                      multiple
                      value={selectedCommodities
                        .filter((item) => item.receiptNumber === receipt.number)
                        .map((item) => item.commodities)}
                      onChange={(e) =>
                        handleCommoditySelection(
                          receipt.number,
                          e.target.value,
                          receipt.id
                        )
                      }
                    >
                      {receipt.commodities.map((commodity) => (
                        <option key={commodity.id} value={commodity.id}>
                          {commodity.height}x{commodity.width}x{commodity.length} -{" "}
                          {commodity.description}
                        </option>
                      ))}
                    </select>
                  )}
              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="company-form__options-container">
        <button className="button-save" onClick={sendData}>
          Save
        </button>
        <button className="button-cancel" onClick={closeModal}>
          Cancel
        </button>
      </div>
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Release Order {creating ? "created" : "updated"} successfully!
          </strong>
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
            Error {creating ? "creating" : "updating"} Release Order. Please try
            again
          </strong>
        </Alert>
      )}
    </div>
  );
};

export default ReleaseOrderCreationForm;