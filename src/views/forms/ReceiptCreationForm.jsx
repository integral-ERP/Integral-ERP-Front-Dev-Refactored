import { useState, useEffect } from "react";
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
import Table from "../shared/components/Table";
import ReceiptService from "../../services/ReceiptService";
import IncomeChargeForm from "./IncomeChargeForm";
import CommodityCreationForm from "./CommodityCreationForm";
import AsyncSelect from "react-select/async";
import ExpenseChargeForm from "./ExpenseChargeForm";
import EventCreationForm from "./EventCreationForm";
import ShipperService from "../../services/ShipperService";
import ConsigneeService from "../../services/ConsigneeService";
import "../../styles/components/ReceipCreationForm.scss";

const ReceiptCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
  currentPickUpNumber,
  setcurrentPickUpNumber,
  fromPickUp
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [note, setNote] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [allStateUpdatesComplete, setAllStateUpdatesComplete] = useState(false);
  const [showIncomeForm, setshowIncomeForm] = useState(false);
  const [showExpenseForm, setshowExpenseForm] = useState(false);
  const [showEventForm, setshowEventForm] = useState(false);
  const [consignee, setconsignee] = useState(null);
  const [agent, setagent] = useState(null);
  const [shipper, setshipper] = useState(null);
  const [consigneeRequest, setconsigneeRequest] = useState(null);
  const [shipperRequest, setshipperRequest] = useState(null);
  const [clientToBillRequest, setclientToBillRequest] = useState(null);
  const [showCommodityCreationForm, setshowCommodityCreationForm] =
    useState(false);
  const [commodities, setcommodities] = useState([]);
  const [charges, setcharges] = useState([]);
  const [events, setEvents] = useState([]);
  const [attachments, setattachments] = useState([]);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [issuedByOptions, setIssuedByOptions] = useState([]);
  const [destinationAgentOptions, setDestinationAgentOptions] = useState([]);
  const [shipperOptions, setShipperOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const today = dayjs().format("YYYY-MM-DD");
  const pickupNumber = currentPickUpNumber + 1;
  const [defaultValueDestinationAgent, setdefaultValueDestinationAgent] =
    useState(null);
  const [canRender, setcanRender] = useState(false);

  const formFormat = {
    // GENERAL TAB
    status: "",
    number: pickupNumber,
    createdDateAndTime: today,
    pickupDateAndTime: today,
    deliveryDateAndTime: today,
    issuedById: "",
    issuedByType: "",
    issuedByInfo: "",
    destinationAgentId: "",
    employeeId: "",
    // PICKUP TAB
    shipperId: "",
    shipperType: "",
    shipperInfo: "",
    pickupLocationId: "",
    pickupLocationType: "",
    pickupLocationInfo: "",
    // DELIVERY TAB
    consigneeId: "",
    consigneeType: "",
    consigneeInfo: "",
    deliveryLocationId: "",
    deliveryLocationType: "",
    deliveryLocationInfo: "",
    // CARRIER TAB
    proNumber: "",
    trackingNumber: "",
    mainCarrierdId: "",
    mainCarrierInfo: "",
    invoiceNumber: "",
    purchaseOrderNumber: "",
    // CHARGES TAB
    // COMMODITIES TAB
    commodities: [],
    notes: [],
    charges: [],
    events: [],
    pro_number: "",
    tracking_number: "",
    invoice_number: "",
    purchase_order_number: "",
  };
  const [formData, setFormData] = useState(formFormat);

  const handleIssuedBySelection = async (event) => {
    console.log(event);
    const id = event.id;
    const type = event.type;
    const result = await ForwardingAgentService.getForwardingAgentById(id);
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setFormData({
      ...formData,
      issuedById: id,
      issuedByType: type,
      issuedByInfo: info,
    });
  };

  const handleDestinationAgentSelection = async (event) => {
    const id = event.id;
    setFormData({
      ...formData,
      destinationAgentId: id,
    });
    const result = await ForwardingAgentService.getForwardingAgentById(id);
    setagent(result.data);
  };

  const handleEmployeeSelection = async (event) => {
    const id = event.id;
    setFormData({
      ...formData,
      employeeId: id,
    });
  };

  const handleConsigneeSelection = async (event) => {
    const id = event.id;
    const type = event.type;

    let result;
    if (type === "forwarding-agent") {
      result = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if (type === "customer") {
      result = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      result = await VendorService.getVendorByID(id);
    }
    if (type === "carrier") {
      result = await CarrierService.getCarrierById(id);
    }
    console.log("RESULTADO", result.data);
    const info = `${result.data?.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setconsignee(result.data);
    setFormData({
      ...formData,
      consigneeId: id,
      consigneeType: type,
      consigneeInfo: info,
    });
  };

  const handleClientToBillSelection = async (event) => {
    const type = event.target.value;
    const id = type === "shipper" ? formData.shipperId : type === 'consignee' ?formData.consigneeId : '';
    setFormData({
      ...formData,
      clientToBillId: id,
      clientToBillType: type,
    });
  };

  const handleShipperSelection = async (event) => {
    const id = event.id || formData.shipperId;
    const type = event.type || formData.shipperType;
    console.log("CHANGING SHIPPER", id, type);
    let result;
    if (type === "forwarding-agent") {
      result = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if (type === "customer") {
      result = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      result = await VendorService.getVendorByID(id);
    }
    const info = result?.data ? `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }` : formData.shipperInfo;
    setshipper(result?.data || shipper);
    setFormData({
      ...formData,
      shipperId: id,
      shipperType: type,
      shipperInfo: info,
    });
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
  
    // Add the uploaded files to the state variable
    setattachments([...attachments, ...files]);
  
    // Transform the files into base64 strings
    files.forEach((file) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        // Set the file base64 string in the state variable
        setattachments((prevAttachments) => {
          return prevAttachments.map((prevAttachment) => {
            if (prevAttachment.name === file.name) {
              return {
                ...prevAttachment,
                base64: reader.result,
              };
            } else {
              return prevAttachment;
            }
          });
        });
      };
  
      reader.readAsDataURL(file);
    });
  };

  const handleMainCarrierSelection = async (event) => {
    const id = event.id;
    const result = await CarrierService.getCarrierById(id);
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setFormData({
      ...formData,
      mainCarrierdId: id,
      mainCarrierInfo: info,
    });
  };

  const addNotes = () => {
    const updatedNotes = [...formData.notes, note];

    setFormData({ ...formData, notes: updatedNotes });
  };

  useEffect(() => {
    console.log("checking for edit", "join:", !creating && pickupOrder != null);
    if (!creating && pickupOrder != null) {
      console.log("Selected Pickup:", pickupOrder);
      let updatedFormData = {
        // GENERAL TAB
        status: pickupOrder.status,
        number: pickupOrder.number,
        createdDateAndTime: pickupOrder.creation_date,
        pickupDateAndTime: pickupOrder.pick_up_date,
        deliveryDateAndTime: pickupOrder.delivery_date,
        issuedById: pickupOrder.issued_by,
        issuedByType: pickupOrder.issued_by?.type,
        issuedByInfo: `${pickupOrder.issued_by?.street_and_number || ""} - ${
          pickupOrder.issuedBy?.city || ""
        } - ${pickupOrder.issuedBy?.state || ""} - ${
          pickupOrder.issuedBy?.country || ""
        } - ${pickupOrder.issued_by?.zip_code || ""}`,
        destinationAgentId: pickupOrder.destination_agent,
        employeeId: pickupOrder.employee,
        // PICKUP TAB
        shipperId: pickupOrder.shipper,
        shipperInfo: `${pickupOrder.shipperObj?.data?.obj?.street_and_number || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.city || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.state || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.country || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.zip_code || ""}`,
        pickupLocationId: pickupOrder.pick_up_location,
        pickupLocationInfo: `${
          pickupOrder.pick_up_location?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.pick_up_location?.data?.obj?.city || ""} - ${
          pickupOrder.pick_up_location?.data?.obj?.state || ""
        } - ${pickupOrder.pick_up_location?.data?.obj?.country || ""} - ${
          pickupOrder.pick_up_location?.data?.obj?.zip_code || ""
        }`,
        // DELIVERY TAB
        consigneeId: pickupOrder.consignee,
        consigneeInfo: `${pickupOrder.consigneeObj?.data?.obj?.street_and_number || ""} - ${
          pickupOrder.consigneeObj?.data?.obj?.city || ""
        } - ${pickupOrder.consigneeObj?.data?.obj?.state || ""} - ${
          pickupOrder.consigneeObj?.data?.obj?.country || ""
        } - ${pickupOrder.consigneeObj?.data?.obj?.zip_code || ""}`,
        deliveryLocationId: pickupOrder.delivery_location,
        deliveryLocationInfo: `${
          pickupOrder.deliveryLocationObj?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.deliveryLocationObj?.data?.obj?.city || ""} - ${
          pickupOrder.deliveryLocationObj?.data?.obj?.state || ""
        } - ${pickupOrder.deliveryLocationObj?.data?.obj?.country || ""} - ${
          pickupOrder.deliveryLocationObj?.data?.obj?.zip_code || ""
        }`,
        // CARRIER TAB
        proNumber: pickupOrder.pro_number,
        trackingNumber: pickupOrder.tracking_number,
        mainCarrierdId: pickupOrder.main_carrier,
        mainCarrierInfo: `${
          pickupOrder.main_carrierObj?.street_and_number || ""
        } - ${pickupOrder.main_carrierObj?.city || ""} - ${
          pickupOrder.main_carrierObj?.state || ""
        } - ${pickupOrder.main_carrierObj?.country || ""} - ${
          pickupOrder.main_carrierObj?.zip_code || ""
        }`,
        // SUPPLIER TAB
        invoiceNumber: pickupOrder.invoice_number,
        purchaseOrderNumber: pickupOrder.purchase_order_number,
        // CHARGES TAB
        // COMMODITIES TAB
        commodities: pickupOrder.commodities,
      };
      console.log("Form Data to be updated:", updatedFormData);
      setFormData(updatedFormData);
      const value = destinationAgentOptions.find(
        (option) => updatedFormData.destinationAgentId == option.id
      );
      console.log("OPTION:", value);
      setdefaultValueDestinationAgent(value);
      setcanRender(true);
      console.log(value, canRender);
    }
  }, [creating, pickupOrder]);

  const fetchFormData = async () => {
    const forwardingAgents = (
      await ForwardingAgentService.getForwardingAgents()
    ).data.results;
    const customers = (await CustomerService.getCustomers()).data.results;
    const vendors = (await VendorService.getVendors()).data.results;
    const employees = (await EmployeeService.getEmployees()).data.results;
    const carriers = (await CarrierService.getCarriers()).data.results;

    // Function to add 'type' property to an array of objects
    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));

    // Add 'type' property to each array
    const forwardingAgentsWithType = addTypeToObjects(
      forwardingAgents,
      "forwarding-agent"
    );
    const customersWithType = addTypeToObjects(customers, "customer");
    const vendorsWithType = addTypeToObjects(vendors, "vendor");
    const employeesWithType = addTypeToObjects(employees, "employee");
    const carriersWithType = addTypeToObjects(carriers, "carrier");

    // Merge the arrays
    const issuedByOptions = [...forwardingAgentsWithType];
    const destinationAgentOptions = [...forwardingAgentsWithType];
    const employeeOptions = [...employeesWithType];
    const shipperOptions = [
      ...customersWithType,
      ...vendorsWithType,
      ...forwardingAgentsWithType,
    ];

    const consigneeOptions = [
      ...customersWithType,
      ...vendorsWithType,
      ...forwardingAgentsWithType,
      ...carriersWithType,
    ];

    const carrierOptions = [...carriersWithType];
    // Set the state with the updated arrays
    setIssuedByOptions(issuedByOptions);
    setDestinationAgentOptions(destinationAgentOptions);
    setEmployeeOptions(employeeOptions);
    setShipperOptions(shipperOptions);
    setConsigneeOptions(consigneeOptions);
    setCarrierOptions(carrierOptions);
    setSupplierOptions(carrierOptions);
  };

  useEffect(() => {
    if(!fromPickUp){

      fetchFormData();
    }
  }, []);

  useEffect(() => {
    console.log("PICKUP NUMBER", currentPickUpNumber, pickupNumber);
    if (creating) {
      console.log(
        "Setting new pickup number:",
        pickupNumber,
        "old pickup number:",
        currentPickUpNumber
      );
      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  useEffect(() => {
    if(fromPickUp){
      console.log("This receipt will be created from the order:", pickupOrder);
      
      setEmployeeOptions([pickupOrder.employeeObj]);
      setIssuedByOptions([pickupOrder.issued_byObj]);
      setDestinationAgentOptions([pickupOrder.destination_agentObj]);
      setShipperOptions([pickupOrder.shipperObj?.data?.obj]);
      setConsigneeOptions([pickupOrder.consigneeObj?.data?.obj]);
      setCarrierOptions([pickupOrder.main_carrierObj]);
      setSupplierOptions([pickupOrder.supplierObj]);
      
      setconsigneeRequest(pickupOrder.consignee);
      setshipperRequest(pickupOrder.shipper);
      handleConsigneeSelection({id: pickupOrder.consigneeObj?.data?.obj?.id, type: pickupOrder.consigneeObj?.data?.obj?.type_person});
      handleShipperSelection({id: pickupOrder.shipperObj?.data?.obj?.id, type: pickupOrder.shipperObj?.data?.obj?.type_person});
      handleDestinationAgentSelection({id: pickupOrder.destination_agentObj?.id});
      let updatedFormData = {
        // GENERAL TAB
        status: pickupOrder.status,
        number: pickupOrder.number,
        createdDateAndTime: pickupOrder.creation_date,
        pickupDateAndTime: pickupOrder.pick_up_date,
        deliveryDateAndTime: pickupOrder.delivery_date,
        issuedById: pickupOrder.issued_by,
        issuedByType: pickupOrder.issued_by?.type,
        issuedByInfo: `${pickupOrder.issued_by?.street_and_number || ""} - ${
          pickupOrder.issuedBy?.city || ""
        } - ${pickupOrder.issuedBy?.state || ""} - ${
          pickupOrder.issuedBy?.country || ""
        } - ${pickupOrder.issued_by?.zip_code || ""}`,
        destinationAgentId: pickupOrder.destination_agent,
        employeeId: pickupOrder.employee,
        // PICKUP TAB
        shipperId: pickupOrder.shipper,
        shipper: pickupOrder.shipper,
        shipperObjId: pickupOrder.shipperObj.data?.obj?.id,
        shipperInfo: `${pickupOrder.shipperObj?.data?.obj?.street_and_number || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.city || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.state || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.country || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.zip_code || ""}`,
        pickupLocationId: pickupOrder.pick_up_location,
        pickupLocationInfo: `${
          pickupOrder.pick_up_location?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.pick_up_location?.data?.obj?.city || ""} - ${
          pickupOrder.pick_up_location?.data?.obj?.state || ""
        } - ${pickupOrder.pick_up_location?.data?.obj?.country || ""} - ${
          pickupOrder.pick_up_location?.data?.obj?.zip_code || ""
        }`,
        // DELIVERY TAB
        consigneeId: pickupOrder.consignee,
        consignee:  pickupOrder.consignee,
        consigneeObjId: pickupOrder.consigneeObj.data?.obj?.id,
        consigneeInfo: `${pickupOrder.consigneeObj?.data?.obj?.street_and_number || ""} - ${
          pickupOrder.consigneeObj?.data?.obj?.city || ""
        } - ${pickupOrder.consigneeObj?.data?.obj?.state || ""} - ${
          pickupOrder.consigneeObj?.data?.obj?.country || ""
        } - ${pickupOrder.consigneeObj?.data?.obj?.zip_code || ""}`,
        deliveryLocationId: pickupOrder.delivery_location,
        deliveryLocationInfo: `${
          pickupOrder.deliveryLocationObj?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.deliveryLocationObj?.data?.obj?.city || ""} - ${
          pickupOrder.deliveryLocationObj?.data?.obj?.state || ""
        } - ${pickupOrder.deliveryLocationObj?.data?.obj?.country || ""} - ${
          pickupOrder.deliveryLocationObj?.data?.obj?.zip_code || ""
        }`,
        // CARRIER TAB
        proNumber: pickupOrder.pro_number,
        trackingNumber: pickupOrder.tracking_number,
        mainCarrierdId: pickupOrder.main_carrier,
        mainCarrierInfo: `${
          pickupOrder.main_carrierObj?.street_and_number || ""
        } - ${pickupOrder.main_carrierObj?.city || ""} - ${
          pickupOrder.main_carrierObj?.state || ""
        } - ${pickupOrder.main_carrierObj?.country || ""} - ${
          pickupOrder.main_carrierObj?.zip_code || ""
        }`,
        // SUPPLIER TAB
        supplierId: pickupOrder.supplier,
        supplierInfo: `${pickupOrder.supplierObj?.street_and_number || ""} - ${
          pickupOrder.supplierObj?.city || ""
        } - ${pickupOrder.supplierObj?.state || ""} - ${
          pickupOrder.supplierObj?.country || ""
        } - ${pickupOrder.supplierObj?.zip_code || ""}`,
        //
        invoiceNumber: pickupOrder.invoice_number,
        purchaseOrderNumber: pickupOrder.purchase_order_number,
        // CHARGES TAB
        // COMMODITIES TAB
        commodities: pickupOrder.commodities,
      };
      console.log("Form Data to be updated for the new receipt:", updatedFormData);
      setFormData(updatedFormData);
    }
  }, [fromPickUp, pickupOrder]);

  useEffect(() => {
    //setIssuedByOptions(issuedByOptions);
    //setDestinationAgentOptions(destinationAgentOptions);
      console.log("NEW OPTIONS:", employeeOptions, carrierOptions, shipperOptions, consigneeOptions, supplierOptions, formData.supplierId);
      console.log("employee id", formData.employeeId);
    
  }, [employeeOptions, carrierOptions])
  

  const sendData = async () => {
    let consigneeName = "";
    if (formData.consigneeType === "customer") {
      consigneeName = "customerid";
    }
    if (formData.consigneeType === "vendor") {
      consigneeName = "vendorid";
    }
    if (formData.consigneeType === "forwarding-agent") {
      consigneeName = "agentid";
    }
    if (formData.consigneeType === "carrier") {
      consigneeName = "carrierid";
    }
    if (consigneeName !== "") {
      const consignee = {
        [consigneeName]: formData.consigneeId,
      };

      const response = await ReceiptService.createConsignee(consignee);
      if (response.status === 201) {
        console.log("CONSIGNEE ID", response.data.id);
        setconsigneeRequest(response.data.id);
      }
    }

    let shipperName = "";
    if (formData.shipperType === "customer") {
      shipperName = "customerid";
    }
    if (formData.shipperType === "vendor") {
      shipperName = "vendorid";
    }
    if (formData.shipperType === "forwarding-agent") {
      shipperName = "agentid";
    }
    if (formData.shipperType === "carrier") {
      shipperName = "carrierid";
    }
    if (shipperName !== "") {
      const consignee = {
        [shipperName]: formData.shipperId,
      };

      const response = await ReceiptService.createShipper(consignee);
      if (response.status === 201) {
        console.log("SHIPPER ID", response.data.id);
        setshipperRequest(response.data.id);
      }
    }

    let clientToBillName = "";
    if (formData.clientToBillType === "shipper") {
      clientToBillName = "shipperid";
    }
    if (formData.clientToBillType === "consignee") {
      clientToBillName = "consigneeid";
    }
    if (clientToBillName !== "") {
      const clientToBill = {
        [clientToBillName]: formData.clientToBillId,
      };

      const response = await ReceiptService.createClientToBill(clientToBill);
      if (response.status === 201) {
        console.log("CLIENT TO BILL ID", response.data.id);
        setclientToBillRequest(response.data.id);
      }
    }
  };

  const checkUpdatesComplete = () => {
    console.log("Checking for updates");
    if (
      shipperRequest !== null &&
      consigneeRequest !== null &&
      clientToBillRequest !== null
    ) {
      setAllStateUpdatesComplete(true);
    }

    if(fromPickUp && clientToBillRequest !== null){
      setAllStateUpdatesComplete(true);
    }
  };

  useEffect(() => {
    console.log("SHIPPER:", shipperRequest);
    console.log("CONSIGNEE REQUEST:", consigneeRequest);
    console.log("CLIENT TO BILL REQUEST:", clientToBillRequest);
    console.log("ATTACHMNETS", attachments);
    // Check if updates are complete initially
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      const createPickUp = async () => {
        console.log("ATTACHMENTS:", attachments);
        console.log("EVENTS", events);
        console.log("PIECES:", commodities);
        console.log("CARGOS:", charges);
        let rawData = {
          status: 2,
          number: formData.number,
          creation_date: formData.createdDateAndTime,
          issued_by: formData.issuedById,
          destination_agent: formData.destinationAgentId,
          employee: formData.employeeId,
          shipper: shipperRequest,
          consignee: consigneeRequest,
          client_to_bill: clientToBillRequest,
          main_carrier: formData.mainCarrierdId,
          commodities: commodities,
          charges: charges,
          events: events,
          attachments: attachments.map((attachment) => {
            return {
              name: attachment.name,
              type: attachment.type,
              base64: attachment.base64,
            };
          }),
          notes: formData.notes,
          pro_number: formData.proNumber,
          tracking_number: formData.trackingNumber,
          invoice_number: formData.invoiceNumber,
          purchase_order_number: formData.purchaseOrderNumber,
        };
        const response = await (creating
          ? ReceiptService.createReceipt(rawData)
          : ReceiptService.updateReceipt(pickupOrder.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
          console.log(
            "Warehouse Recipt successfully created/updated:",
            response.data
          );
          setcurrentPickUpNumber(currentPickUpNumber + 1);
          setShowSuccessAlert(true);
          setTimeout(() => {
            closeModal();
            onpickupOrderDataChange();
            setShowSuccessAlert(false);
            setFormData(formFormat);
          }, 5000);
        } else {
          console.log("Something went wrong:", response);
          setShowErrorAlert(true);
        }
      };
      createPickUp();
    }
  }, [
    shipperRequest,
    consigneeRequest,
    allStateUpdatesComplete,
    clientToBillRequest,
  ]);

  return (
    <div className="company-form">
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#general"
            aria-selected={activeTab === "general"}
            onClick={() => setActiveTab("general")}
            role="tab"
          >
            General
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#shipper/consignee"
            aria-selected={activeTab === "shipper/consignee"}
            onClick={() => setActiveTab("shipper/consignee")}
            tabIndex="-1"
            role="tab"
          >
            Shipper/Consignee
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#supplier"
            aria-selected={activeTab === "supplier"}
            onClick={() => setActiveTab("supplier")}
            tabIndex="-1"
            role="tab"
          >
            Supplier
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#carrier"
            aria-selected={activeTab === "carrier"}
            onClick={() => setActiveTab("carrier")}
            tabIndex="-1"
            role="tab"
          >
            Carrier
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#commodities"
            aria-selected={activeTab === "commodities"}
            onClick={() => setActiveTab("commodities")}
            tabIndex="-1"
            role="tab"
          >
            Commodities
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#charges"
            aria-selected={activeTab === "charges"}
            onClick={() => setActiveTab("charges")}
            tabIndex="-1"
            role="tab"
          >
            Charges
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#events"
            aria-selected={activeTab === "events"}
            onClick={() => setActiveTab("events")}
            tabIndex="-1"
            role="tab"
          >
            Events
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#attachments"
            aria-selected={activeTab === "attachments"}
            onClick={() => setActiveTab("attachments")}
            tabIndex="-1"
            role="tab"
          >
            Attachments
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#notes"
            aria-selected={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
            tabIndex="-1"
            role="tab"
          >
            Notes
          </a>
        </li>
      </ul>
      <form
        className={`tab-pane fade ${
          activeTab === "general" ? "show active" : ""
        } company-form__general-form`}
        id="general"
        style={{ display: activeTab === "general" ? "block" : "none" }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <Input
                type="number"
                inputName="number"
                placeholder="Number..."
                value={formData.number}
                readonly={true}
                label="Number"
              />
            </div>
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Entry Date and Time"
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
            <div className="company-form__section">
              <label htmlFor="employee" className="form-label">
                Employee:
              </label>
              <AsyncSelect
                id="employee"
                value={employeeOptions.find((option) => option.id === formData.employeeId)}
                onChange={(e) => {
                  handleEmployeeSelection(e);
                }}
                isClearable={true}
                defaultOptions={employeeOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <label htmlFor="issuedBy" className="form-label">
                Issued By:
              </label>
              <AsyncSelect
                id="issuedBy"
                value={issuedByOptions.find((option) => option.id === formData.issuedById)}
                onChange={(e) => {
                  handleIssuedBySelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={issuedByOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <label htmlFor="destinationAgent" className="form-label">
                Destination Agent:
              </label>
              {!creating ? (
                canRender && (
                  <AsyncSelect
                    id="destinationAgent"
                    onChange={(e) => {
                      handleDestinationAgentSelection(e);
                    }}
                    value={destinationAgentOptions.find((option) => option.id === formData.destinationAgentId)}
                    isClearable={true}
                    defaultOptions={destinationAgentOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                )
              ) : (
                <AsyncSelect
                  id="destinationAgent"
                  onChange={(e) => {
                    handleDestinationAgentSelection(e);
                  }}
                  value={destinationAgentOptions.find((option) => option.id === formData.destinationAgentId)}
                  isClearable={true}
                  defaultOptions={destinationAgentOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              )}
            </div>
            <div className="company-form__section">
              <Input
                type="number"
                inputName="entryNumber"
                placeholder="Entry Number..."
                value={formData.entryNumber}
                label="Entry Number"
              />
            </div>
          </div>
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "shipper/consignee" ? "show active" : ""
        } company-form__general-form`}
        id="shipper/consignee"
        style={{
          display: activeTab === "shipper/consignee" ? "block" : "none",
        }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="shipper" className="form-label">
                Shipper:
              </label>
              <AsyncSelect
                id="shipper"
                value={shipperOptions.find((option) => option.id === formData.shipperObjId)}
                onChange={(e) => {
                  handleShipperSelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={shipperOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="shipperinfo"
                placeholder="Shipper Location..."
                value={formData.shipperInfo}
                readonly={true}
              />
            </div>
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
              <label htmlFor="consignee" className="form-label">
                Consignee:
              </label>
              <div className="custom-select">
                <AsyncSelect
                  id="consignee"
                  value={consigneeOptions.find((option) => option.id === formData.consigneeObjId)}
                  onChange={(e) => handleConsigneeSelection(e)}
                  isClearable={true}
                  placeholder="Search and select..."
                  defaultOptions={consigneeOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>
            </div>

            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="consigneeInfo"
                placeholder="Consignee Info..."
                value={formData.consigneeInfo}
                readonly={true}
                label=""
              />
            </div>
          </div>
          {/* ----------------------------END TWO---------------------------------- */}
        </div>
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="clientToBill" className="form-label">
                Client to Bill:
              </label>
              <select
                name="clientToBill"
                id="clientToBill"
                onChange={(e) => handleClientToBillSelection(e)}
              >
                <option value="">Select an option</option>
                <option value="consignee">Consignee</option>
                <option value="shipper">Shipper</option>
              </select>
            </div>
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
            </div>
          </div>
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "supplier" ? "show active" : ""
        } company-form__general-form`}
        id="supplier"
        style={{ display: activeTab === "supplier" ? "block" : "none" }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="shipper" className="form-label">
                Name:
              </label>
              <AsyncSelect
                id="shipper"
                value={supplierOptions.find((option) => option.id === formData.supplierId)}
                onChange={(e) => {
                  console.log(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={supplierOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="shipperinfo"
                placeholder="Shipper Location..."
                value={formData.shipperInfo}
                readonly={true}
              />
            </div>
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="invoiceNumber"
                placeholder="Invoice Number..."
                value={formData.invoiceNumber}
                changeHandler={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                label="Invoice Number"
              />
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="purchaseOrderNumber"
                placeholder="Purchase Order Number..."
                value={formData.purchaseOrderNumber}
                changeHandler={(e) =>
                  setFormData({
                    ...formData,
                    purchaseOrderNumber: e.target.value,
                  })
                }
                label="Purchase Order Number"
              />
            </div>
          </div>
          {/* ----------------------------END TWO---------------------------------- */}
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "carrier" ? "show active" : ""
        } company-form__general-form`}
        id="carrier"
        style={{ display: activeTab === "carrier" ? "block" : "none" }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="mainCarrier" className="form-label">
                Carrier:
              </label>
              <AsyncSelect
                id="mainCarrier"
                value={carrierOptions.find((option) => option.id === formData.mainCarrierdId)}
                onChange={(e) => {
                  handleMainCarrierSelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={carrierOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="proNumber"
                placeholder="PRO Number..."
                value={formData.proNumber}
                changeHandler={(e) =>
                  setFormData({ ...formData, proNumber: e.target.value })
                }
                label="PRO Number"
              />
            </div>
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
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
          {/* ----------------------------END TWO---------------------------------- */}
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "charges" ? "show active" : ""
        } company-form__general-form`}
        id="charges"
        style={{ display: activeTab === "charges" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <button
            type="button"
            className="btn btn-primary btn-lg charge-buttons"
            onClick={() => {
              setshowIncomeForm(!showIncomeForm);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M19.1426 23.6543C17.8477 24.123 16.4531 24.375 15 24.375C13.5469 24.375 12.1465 24.1172 10.8574 23.6543C10.8398 23.6484 10.8281 23.6426 10.8105 23.6367C9.05273 22.9922 7.48242 21.9551 6.20508 20.625C4.10156 18.4336 2.8125 15.4629 2.8125 12.1875C2.8125 5.45508 8.26758 0 15 0C21.7324 0 27.1875 5.45508 27.1875 12.1875C27.1875 15.4629 25.8984 18.4336 23.7949 20.625C23.7363 20.6836 23.6777 20.748 23.6191 20.8066C22.3652 22.0605 20.8418 23.0391 19.1484 23.6543H19.1426ZM15 5.38477C14.3496 5.38477 13.8223 5.91211 13.8223 6.5625V6.91406C13.4941 6.98438 13.1836 7.08398 12.8906 7.21289C12.0117 7.61133 11.2559 8.34961 11.0684 9.42188C10.9629 10.0195 11.0215 10.5938 11.2676 11.1211C11.5137 11.6367 11.8945 12 12.2812 12.2637C12.9609 12.7266 13.8574 12.9961 14.543 13.2012L14.6719 13.2422C15.4863 13.4883 16.043 13.6758 16.3887 13.9277C16.5352 14.0332 16.5879 14.1152 16.6055 14.1621C16.623 14.209 16.6582 14.3145 16.6172 14.5547C16.582 14.7598 16.4707 14.9297 16.1484 15.0703C15.791 15.2227 15.2109 15.2988 14.4609 15.1816C14.1094 15.123 13.4824 14.9121 12.9258 14.7188C12.7969 14.6777 12.6738 14.6309 12.5508 14.5957C11.9355 14.3906 11.2734 14.7246 11.0684 15.3398C10.8633 15.9551 11.1973 16.6172 11.8125 16.8223C11.8828 16.8457 11.9707 16.875 12.0703 16.9102C12.5332 17.0684 13.2598 17.3145 13.8164 17.4434V17.8125C13.8164 18.4629 14.3438 18.9902 14.9941 18.9902C15.6445 18.9902 16.1719 18.4629 16.1719 17.8125V17.4902C16.4824 17.4316 16.7871 17.3438 17.0742 17.2207C17.9941 16.8281 18.7383 16.0664 18.9258 14.9531C19.0312 14.3438 18.9844 13.7637 18.75 13.2305C18.5215 12.7031 18.1523 12.3164 17.7598 12.0293C17.0449 11.5137 16.1016 11.2266 15.3926 11.0098L15.3457 10.998C14.5137 10.7461 13.9512 10.5703 13.5938 10.3301C13.4414 10.2246 13.3945 10.1543 13.3828 10.125C13.3711 10.1074 13.3418 10.0312 13.377 9.83203C13.3945 9.7207 13.4883 9.52734 13.8574 9.35742C14.2324 9.1875 14.8184 9.09375 15.5332 9.20508C15.7852 9.24609 16.582 9.39844 16.8047 9.45703C17.4316 9.62109 18.0703 9.25195 18.2402 8.625C18.4102 7.99805 18.0352 7.35938 17.4082 7.18945C17.1504 7.11914 16.5645 7.00195 16.1777 6.93164V6.5625C16.1777 5.91211 15.6504 5.38477 15 5.38477ZM2.8125 20.625H3.75C4.89258 22.1426 6.32812 23.4199 7.98047 24.375H3.75V26.25H15H26.25V24.375H22.0195C23.6719 23.4199 25.1133 22.1426 26.25 20.625H27.1875C28.7402 20.625 30 21.8848 30 23.4375V27.1875C30 28.7402 28.7402 30 27.1875 30H2.8125C1.25977 30 0 28.7402 0 27.1875V23.4375C0 21.8848 1.25977 20.625 2.8125 20.625Z"
                fill="#24AF0D"
              />
            </svg>
            Add Income Charge
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg charge-buttons"
            onClick={() => {
              setshowExpenseForm(!showExpenseForm);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M19.1426 23.6543C17.8477 24.123 16.4531 24.375 15 24.375C13.5469 24.375 12.1465 24.1172 10.8574 23.6543C10.8398 23.6484 10.8281 23.6426 10.8105 23.6367C9.05273 22.9922 7.48242 21.9551 6.20508 20.625C4.10156 18.4336 2.8125 15.4629 2.8125 12.1875C2.8125 5.45508 8.26758 0 15 0C21.7324 0 27.1875 5.45508 27.1875 12.1875C27.1875 15.4629 25.8984 18.4336 23.7949 20.625C23.7363 20.6836 23.6777 20.748 23.6191 20.8066C22.3652 22.0605 20.8418 23.0391 19.1484 23.6543H19.1426ZM15 5.38477C14.3496 5.38477 13.8223 5.91211 13.8223 6.5625V6.91406C13.4941 6.98438 13.1836 7.08398 12.8906 7.21289C12.0117 7.61133 11.2559 8.34961 11.0684 9.42188C10.9629 10.0195 11.0215 10.5938 11.2676 11.1211C11.5137 11.6367 11.8945 12 12.2812 12.2637C12.9609 12.7266 13.8574 12.9961 14.543 13.2012L14.6719 13.2422C15.4863 13.4883 16.043 13.6758 16.3887 13.9277C16.5352 14.0332 16.5879 14.1152 16.6055 14.1621C16.623 14.209 16.6582 14.3145 16.6172 14.5547C16.582 14.7598 16.4707 14.9297 16.1484 15.0703C15.791 15.2227 15.2109 15.2988 14.4609 15.1816C14.1094 15.123 13.4824 14.9121 12.9258 14.7188C12.7969 14.6777 12.6738 14.6309 12.5508 14.5957C11.9355 14.3906 11.2734 14.7246 11.0684 15.3398C10.8633 15.9551 11.1973 16.6172 11.8125 16.8223C11.8828 16.8457 11.9707 16.875 12.0703 16.9102C12.5332 17.0684 13.2598 17.3145 13.8164 17.4434V17.8125C13.8164 18.4629 14.3438 18.9902 14.9941 18.9902C15.6445 18.9902 16.1719 18.4629 16.1719 17.8125V17.4902C16.4824 17.4316 16.7871 17.3438 17.0742 17.2207C17.9941 16.8281 18.7383 16.0664 18.9258 14.9531C19.0312 14.3438 18.9844 13.7637 18.75 13.2305C18.5215 12.7031 18.1523 12.3164 17.7598 12.0293C17.0449 11.5137 16.1016 11.2266 15.3926 11.0098L15.3457 10.998C14.5137 10.7461 13.9512 10.5703 13.5938 10.3301C13.4414 10.2246 13.3945 10.1543 13.3828 10.125C13.3711 10.1074 13.3418 10.0312 13.377 9.83203C13.3945 9.7207 13.4883 9.52734 13.8574 9.35742C14.2324 9.1875 14.8184 9.09375 15.5332 9.20508C15.7852 9.24609 16.582 9.39844 16.8047 9.45703C17.4316 9.62109 18.0703 9.25195 18.2402 8.625C18.4102 7.99805 18.0352 7.35938 17.4082 7.18945C17.1504 7.11914 16.5645 7.00195 16.1777 6.93164V6.5625C16.1777 5.91211 15.6504 5.38477 15 5.38477ZM2.8125 20.625H3.75C4.89258 22.1426 6.32812 23.4199 7.98047 24.375H3.75V26.25H15H26.25V24.375H22.0195C23.6719 23.4199 25.1133 22.1426 26.25 20.625H27.1875C28.7402 20.625 30 21.8848 30 23.4375V27.1875C30 28.7402 28.7402 30 27.1875 30H2.8125C1.25977 30 0 28.7402 0 27.1875V23.4375C0 21.8848 1.25977 20.625 2.8125 20.625Z"
                fill="red"
              />
            </svg>
            Add Expense Charge
          </button>
          {showIncomeForm && (
            <IncomeChargeForm
              onCancel={setshowIncomeForm}
              charges={charges}
              setcharges={setcharges}
              commodities={commodities}
              agent={agent}
              consignee={consignee}
              shipper={shipper}
            ></IncomeChargeForm>
          )}
          {showExpenseForm && (
            <ExpenseChargeForm
              onCancel={setshowIncomeForm}
              charges={charges}
              setcharges={setcharges}
              commodities={commodities}
              agent={agent}
              consignee={consignee}
              shipper={shipper}
            ></ExpenseChargeForm>
          )}
        </div>
        <Table
          data={charges}
          columns={[
            "Status",
            "Type",
            "Description",
            "Quantity",
            "Price",
            "Currency",
          ]}
          onSelect={() => {}} // Make sure this line is correct
          selectedRow={{}}
          onDelete={() => {}}
          onEdit={() => {}}
          onAdd={() => {}}
          showOptions={false}
        />
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "commodities" ? "show active" : ""
        } company-form__general-form`}
        id="commodities"
        style={{ display: activeTab === "commodities" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <button
            type="button"
            className="button-addpiece"
            onClick={() =>
              setshowCommodityCreationForm(!showCommodityCreationForm)
            }
          >
            Add Piece
          </button>
          {showCommodityCreationForm && (
            <CommodityCreationForm
              onCancel={setshowCommodityCreationForm}
              commodities={commodities}
              setCommodities={setcommodities}
            ></CommodityCreationForm>
          )}
        </div>
        <Table
          data={commodities}
          columns={[
            " Length",
            " Height",
            " Width",
            " Weight",
            " Volumetric Weight",
            " Chargeable Weight",
            " Delete",
          ]}
          onSelect={() => {}} // Make sure this line is correct
          selectedRow={{}}
          onDelete={() => {}}
          onEdit={() => {}}
          onAdd={() => {}}
          showOptions={false}
        />
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "events" ? "show active" : ""
        } company-form__general-form`}
        id="events"
        style={{ display: activeTab === "events" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <button
            type="button"
            className="btn btn-primary btn-lg charge-buttons"
            onClick={() => {
              setshowEventForm(!showEventForm);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                fill="white"
              />
            </svg>
            Add Event
          </button>
          {showEventForm && (
            <EventCreationForm
              onCancel={setshowEventForm}
              events={events}
              setevents={setEvents}
            ></EventCreationForm>
          )}
        </div>
        <Table
          data={events}
          columns={[
            "Date",
            "Name",
            "Location",
            "Details",
            "Include In Tracking",
            "Created In",
            "Created By",
            "Created On",
            "Last Modified By",
            "Last Modified On",
          ]}
          onSelect={() => {}} // Make sure this line is correct
          selectedRow={{}}
          onDelete={() => {}}
          onEdit={() => {}}
          onAdd={() => {}}
          showOptions={false}
        />
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "attachments" ? "show active" : ""
        } company-form__general-form`}
        id="attachments"
        style={{ display: activeTab === "attachments" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <input type="file" multiple onChange={handleFileUpload} />
          <ul>
            {attachments.map((attachment) => (
              <li key={attachment.name}>{attachment.name}</li>
            ))}
          </ul>
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "notes" ? "show active" : ""
        } company-form__general-form`}
        id="notes"
        style={{ display: activeTab === "notes" ? "block" : "none" }}
      >
        <input
          name="notes"
          type="text"
          className="form-input"
          placeholder="Notes..."
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "100%" }}
        />
        <button type="button" onClick={addNotes}>
          Add
        </button>
        <Input value={formData.notes} readonly type="text" inputName="notes"></Input>
      </form>
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
            Warehouse Receipt {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Warehouse Receipt. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

ReceiptCreationForm.propTypes = {
  pickupOrder: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool,
  onpickupOrderDataChange: propTypes.func,
};

ReceiptCreationForm.defaultProps = {
  pickupOrder: {},
  closeModal: null,
  creating: false,
  onpickupOrderDataChange: null,
};

export default ReceiptCreationForm;
