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
import PickupService from "../../services/PickupService";
import IncomeChargeForm from "./IncomeChargeForm";
import CommodityCreationForm from "./CommodityCreationForm";
import AsyncSelect from "react-select/async";
import ExpenseChargeForm from "./ExpenseChargeForm";
import RepackingForm from "./RepackingForm";
import ReleaseService from "../../services/ReleaseService";
import "../../styles/components/PickupOrderCreationForm.scss";
const PickupOrderCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
  currentPickUpNumber,
  setcurrentPickUpNumber,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [allStateUpdatesComplete, setAllStateUpdatesComplete] = useState(false);
  const [showIncomeForm, setshowIncomeForm] = useState(false);
  const [showExpenseForm, setshowExpenseForm] = useState(false);
  const [consignee, setconsignee] = useState(null);
  const [agent, setagent] = useState(null);
  const [shipper, setshipper] = useState(null);
  const [pickuplocation, setpickuplocation] = useState(null);
  const [deliverylocation, setdeliverylocation] = useState(null);
  const [consigneeRequest, setconsigneeRequest] = useState(null);
  const [shipperRequest, setshipperRequest] = useState(null);
  const [releasedToOptions, setReleasedToOptions] = useState([]);
  const [showCommodityCreationForm, setshowCommodityCreationForm] =
    useState(false);
  const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
  const [showCommodityInspect, setshowCommodityInspect] = useState(false);
  const [showRepackingForm, setshowRepackingForm] = useState(false);
  const [commodities, setcommodities] = useState([]);
  const [charges, setcharges] = useState([]);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [issuedByOptions, setIssuedByOptions] = useState([]);
  const [destinationAgentOptions, setDestinationAgentOptions] = useState([]);
  const [shipperOptions, setShipperOptions] = useState([]);
  const [pickupLocationOptions, setPickupLocationOptions] = useState([]);
  const [deliveryLocationOptions, setDeliveryLocationOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const today = dayjs().format("YYYY-MM-DD");
  const pickupNumber = currentPickUpNumber + 1;
  const [defaultValueShipper, setdefaultValueShipper] = useState(null);
  const [defaultValueConsignee, setdefaultValueConsignee] = useState(null);
  const [canRender, setcanRender] = useState(false);
  const [selectedCommodity, setselectedCommodity] = useState(null);

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
    client_to_bill: "",
    client_to_bill_type: "",
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

  const handlePickUpSelection = async (event) => {
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
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setFormData({
      ...formData,
      pickupLocationId: id,
      pickupInfo: info,
      pickupLocationType: type,
    });
  };

  const handleSelectCommodity = (commodity) => {
    setselectedCommodity(commodity);
  };

  const handleDeliveryLocationSelection = async (event) => {
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
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setFormData({
      ...formData,
      deliveryLocationId: id,
      deliveryLocationInfo: info,
      deliveryLocationType: type,
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
    const info = `${result.data.street_and_number || ""} - ${
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

  const handleShipperSelection = async (event) => {
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
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setshipper(result.data);
    setFormData({
      ...formData,
      shipperId: id,
      shipperType: type,
      shipperInfo: info,
    });
  };

  const handleCommodityDelete = () => {
    const newCommodities = commodities.filter(
      (com) => com.id != selectedCommodity.id
    );
    setcommodities(newCommodities);
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

  const handleClientToBillSelection = async (event) => {
    const type = event.target?.value || "";
    if (type === "other") {
      setFormData({ ...formData, client_to_bill_type: type });
    } else if (type === "shipper" || type === "consignee") {
      const id =
        type === "shipper"
          ? formData.shipperId
          : type === "consignee"
          ? formData.consigneeId
          : "";
      setFormData({
        ...formData,
        client_to_bill: id,
        client_to_bill_type: type,
      });
    } else {
      const id = event.id;
      const type = event.type;
      console.log("id", id, "type", type);
      setFormData({
        ...formData,
        client_to_bill_type: type,
        client_to_bill: id,
      });
    }
  };

  useEffect(() => {
    console.log("checking for edit", "join:", !creating && pickupOrder != null);
    if (!creating && pickupOrder != null) {
      console.log("Selected Pickup:", pickupOrder);
      setcommodities(pickupOrder.commodities);
      setcharges(pickupOrder.charges);
      console.log("CALLING LOAD SHIPPER OPTION");
      loadShipperOption(
        pickupOrder.shipperObj?.data?.obj?.id,
        pickupOrder.shipperObj?.data?.obj?.type_person
      );
      loadConsigneeOption(
        pickupOrder.consigneeObj?.data?.obj?.id,
        pickupOrder.consigneeObj?.data?.obj?.type_person
      );
      let updatedFormData = {
        status: pickupOrder.status,
        number: pickupOrder.number,
        createdDateAndTime: pickupOrder.creation_date,
        pickupDateAndTime: pickupOrder.pick_up_date,
        deliveryDateAndTime: pickupOrder.delivery_date,
        issuedById: pickupOrder.issued_by,
        issuedByType: pickupOrder.issued_byObj?.type,
        issuedByInfo: `${pickupOrder.issued_byObj?.street_and_number || ""} - ${
          pickupOrder.issued_byObj?.city || ""
        } - ${pickupOrder.issued_byObj?.state || ""} - ${
          pickupOrder.issued_byObj?.country || ""
        } - ${pickupOrder.issued_byObj?.zip_code || ""}`,
        destinationAgentId: pickupOrder.destination_agent,
        employeeId: pickupOrder.employee,
        // PICKUP TAB
        shipperId: pickupOrder.shipper,
        shipperInfo: `${
          pickupOrder.shipperObj?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.city || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.state || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.country || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.zip_code || ""
        }`,
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
        consigneeInfo: `${
          pickupOrder.consigneeObj?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.consigneeObj?.data?.obj?.city || ""} - ${
          pickupOrder.consigneeObj?.data?.obj?.state || ""
        } - ${pickupOrder.consigneeObj?.data?.obj?.country || ""} - ${
          pickupOrder.consigneeObj?.data?.obj?.zip_code || ""
        }`,
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
        charges: pickupOrder.charges,
      };
      console.log("Form Data to be updated:", updatedFormData);
      setFormData(updatedFormData);
      setcanRender(true);
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
    const pickupLocationOptions = [
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
    const deliveryLocationOptions = [
      ...customersWithType,
      ...vendorsWithType,
      ...forwardingAgentsWithType,
      ...carriersWithType,
    ];

    const carrierOptions = [...carriersWithType];

    const clientToBillOptions = [
      ...customersWithType,
      forwardingAgentsWithType,
    ];
    console.log("Setting Released to options:", clientToBillOptions);

    // Set the state with the updated arrays
    setIssuedByOptions(issuedByOptions);
    setDestinationAgentOptions(destinationAgentOptions);
    setEmployeeOptions(employeeOptions);
    setShipperOptions(shipperOptions);
    setPickupLocationOptions(pickupLocationOptions);
    setConsigneeOptions(consigneeOptions);
    setDeliveryLocationOptions(deliveryLocationOptions);
    setCarrierOptions(carrierOptions);
    setReleasedToOptions(clientToBillOptions);
  };

  const loadShipperOption = async (id, type) => {
    let option = null;
    if (type === "customer") {
      option = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      option = await VendorService.getVendorByID(id);
    }
    if (type === "agent") {
      option = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if (type === "carrier") {
      option = await CarrierService.getCarrierById(id);
    }
    setdefaultValueConsignee(option.data);
  };

  const loadConsigneeOption = async (id, type) => {
    console.log("CALLING LOAD SHIPPER OPTION FROM INTERNAL FUNCTION");
    let option = null;
    if (type === "customer") {
      option = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      option = await VendorService.getVendorByID(id);
    }
    if (type === "agent") {
      option = await ForwardingAgentService.getForwardingAgentById(id);
    }
    console.log("SHIPPER FOUND:", option.data);
    setdefaultValueShipper(option.data);
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => {
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
    console.log("Updated form data:", formData);
  }, [formData]);

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

      const response = await PickupService.createConsignee(consignee);
      if (response.status === 201) {
        console.log("CONSIGNEE ID", response.data.id);
        setconsigneeRequest(response.data.id);
      }
    }

    let deliveryLocationName = "";
    if (formData.deliveryLocationType === "customer") {
      console.log("its a customer");
      deliveryLocationName = "customerid";
    }
    if (formData.deliveryLocationType === "vendor") {
      deliveryLocationName = "vendorid";
    }
    if (formData.deliveryLocationType === "forwarding-agent") {
      deliveryLocationName = "agentid";
    }
    if (formData.deliveryLocationType === "carrier") {
      deliveryLocationName = "carrierid";
    }
    if (deliveryLocationName !== "") {
      const consignee = {
        [deliveryLocationName]: formData.deliveryLocationId,
      };

      const response = await PickupService.createDeliveryLocation(consignee);
      if (response.status === 201) {
        console.log("DELIVERY LOCATION ID", response.data.id);
        setdeliverylocation(response.data.id);
      }
    }

    let pickUpLocationName = "";
    if (formData.pickupLocationType === "customer") {
      pickUpLocationName = "customerid";
    }
    if (formData.pickupLocationType === "vendor") {
      pickUpLocationName = "vendorid";
    }
    if (formData.pickupLocationType === "forwarding-agent") {
      pickUpLocationName = "agentid";
    }
    if (formData.pickupLocationType === "carrier") {
      pickUpLocationName = "carrierid";
    }
    if (pickUpLocationName !== "") {
      const consignee = {
        [pickUpLocationName]: formData.deliveryLocationId,
      };

      const response = await PickupService.createPickUpLocation(consignee);
      if (response.status === 201) {
        console.log("PICKUP LOCATION ID", response.data.id);
        setpickuplocation(response.data.id);
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

      const response = await PickupService.createShipper(consignee);
      if (response.status === 201) {
        console.log("SHIPPER ID", response.data.id);
        setshipperRequest(response.data.id);
      }
    }

    let clientToBillName = "";

    if (formData.releasedToType === "releasedTo") {
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
    if (formData.client_to_bill_type === "customer") {
      clientToBillName = "customerid";
    }
    if (formData.client_to_bill_type === "vendor") {
      clientToBillName = "vendorid";
    }
    if (formData.client_to_bill_type === "agent") {
      clientToBillName = "agentid";
    }
    if (formData.client_to_bill_type === "carrier") {
      clientToBillName = "carrierid";
    }
    if (clientToBillName !== "") {
      const clientToBill = {
        [clientToBillName]: formData.clientToBillId,
      };

      const response = await ReleaseService.createClientToBill(clientToBill);
      if (response.status === 201) {
        console.log("CLIENT TO BILL ID", response.data.id);
        setFormData({ ...formData, client_to_bill: response.data.id });
      }
    }
  };

  const checkUpdatesComplete = () => {
    console.log("Checking for updates");
    if (
      shipperRequest !== null &&
      deliverylocation !== null &&
      pickuplocation !== null &&
      consigneeRequest !== null &&
      formData.client_to_bill !== null
    ) {
      setAllStateUpdatesComplete(true);
    }
  };

  const updateSelectedCommodity = (updatedInternalCommodities) => {
    const updatedCommodity = { ...selectedCommodity };
    updatedCommodity.internalCommodities = updatedInternalCommodities;
    setselectedCommodity(updatedCommodity);

    const index = commodities.findIndex(
      (com) => com.id == selectedCommodity.id
    );

    if (index != -1) {
      const commoditiesCopy = [...commodities];
      commoditiesCopy[index] = updatedCommodity;
      setcommodities(commoditiesCopy);
    }
  };

  useEffect(() => {
    const handleModalClick = (event) => {
      // Check if the click is inside your modal content
      const clickedElement = event.target;
      const isForm = clickedElement.closest(".income-charge-form")
      console.log("CLOSEST", isForm);
      console.log("HANDLE MODAL CLICK EVENT");
      if (!isForm) {
        // Click is outside the modal content, close the modal
        setselectedCommodity(null);
        setshowCommodityEditForm(false);
        console.log("HANDLE MODAL CLICK EVENT INSIDE IF", selectedCommodity);
      }
    };

    // Add the event listener when the component mounts
    document.querySelector(".pickup").addEventListener("click", handleModalClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.querySelector(".pickup")?.removeEventListener("click", handleModalClick);
    };
  }, []);

  useEffect(() => {
    console.log("TRYING TO CHANGE STATUS");
    if (commodities.length > 0) {
      console.log("CHANGING STATUS");
      setFormData({ ...formData, status: 5 });
    }
  }, [commodities]);

  useEffect(() => {
    // Check if updates are complete initially
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      const createPickUp = async () => {
        let rawData = {
          // GENERAL TAB
          status: formData.status,
          number: formData.number,
          creation_date: formData.createdDateAndTime,
          pick_up_date: formData.pickupDateAndTime,
          delivery_date: formData.deliveryDateAndTime,
          issued_by: formData.issuedById,
          destination_agent: formData.destinationAgentId,
          employee: formData.employeeId,
          // PICKUP TAB
          shipper: shipperRequest,
          shipperType: "",
          pick_up_location: pickuplocation,
          // DELIVERY TAB
          consignee: consigneeRequest,
          delivery_location: deliverylocation,
          client_to_bill_type: formData.client_to_bill_type,
          client_to_bill: formData.client_to_bill,
          // CARRIER TAB
          pro_number: formData.proNumber,
          tracking_number: formData.trackingNumber,
          inland_carrier: formData.mainCarrierdId,
          main_carrier: formData.mainCarrierdId,
          // SUPPLIER TAB
          invoice_number: formData.invoiceNumber,
          purchase_order_number: formData.purchaseOrderNumber,
          // CHARGES TAB
          // COMMODITIES TAB
          commodities: commodities,
          charges: charges,
          supplier: formData.shipperId,
        };
        const response = await (creating
          ? PickupService.createPickup(rawData)
          : PickupService.updatePickup(pickupOrder.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
          console.log(
            "Pickup Order successfully created/updated:",
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
    deliverylocation,
    pickuplocation,
    consigneeRequest,
    allStateUpdatesComplete,
  ]);

  return (
    <div className="company-form pickup">
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
            href="#pickup"
            aria-selected={activeTab === "pickup"}
            onClick={() => setActiveTab("pickup")}
            tabIndex="-1"
            role="tab"
          >
            Pick-up Information
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#delivery"
            aria-selected={activeTab === "delivery"}
            onClick={() => setActiveTab("delivery")}
            tabIndex="-1"
            role="tab"
          >
            Delivery Information
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
            Carrier Information
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
              <label htmlFor="issuedby" className="form-label">
                Issued By:
              </label>
              <AsyncSelect
                className="select_field"
                id="issuedby"
                value={issuedByOptions.find(
                  (option) => option.id === formData.issuedById
                )}
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
              <Input
                type="textarea"
                inputName="issuedbyinfo"
                placeholder="Issued By..."
                value={formData.issuedByInfo}
                readonly={true}
                label=""
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
                    isClearable={true}
                    defaultOptions={destinationAgentOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={destinationAgentOptions.find(
                      (option) => option.id === formData.destinationAgentId
                    )}
                  />
                )
              ) : (
                <AsyncSelect
                  id="destinationAgent"
                  onChange={(e) => {
                    handleDestinationAgentSelection(e);
                  }}
                  isClearable={true}
                  defaultOptions={destinationAgentOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              )}
            </div>
            {/* <div className="company-form__section">
              <Input
                type="number"
                inputName="pickupnumber"
                placeholder="Pickup Order Number..."
                value={formData.number}
                readonly={true}
                label="Number"
              />
            </div>  */}
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          {/* --------------------------- INIT TWO -------------------- */}
          <div className="cont-two__space">
            <div className="company-form__section">
              <Input
                type="number"
                inputName="pickupnumber"
                placeholder="Pickup Order Number..."
                value={formData.number}
                readonly={true}
                label="Number"
              />

              <div className="company-form__section"></div>
              <label htmlFor="employee" className="form-label">
                Employee:
              </label>
              <AsyncSelect
                id="employee"
                defaultValue={formData.employeeId}
                onChange={(e) => {
                  handleEmployeeSelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={employeeOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
          </div>

          <div className="cont-three__space">
            {/* --------------------------- END TWO -------------------- */}
            <div className="company-form__section">
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
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Pick-up Date and Time"
                  value={dayjs(formData.pickupDateAndTime)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupDateAndTime: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Delivery Date and Time"
                  value={dayjs(formData.deliveryDateAndTime)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryDateAndTime: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>
          </div>
          {/* ----------------------------END TWO---------------------------------- */}
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "pickup" ? "show active" : ""
        } company-form__general-form`}
        id="pickup"
        style={{ display: activeTab === "pickup" ? "block" : "none" }}
      >
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="shipper" className="form-label">
                Shipper:
              </label>
              <AsyncSelect
                id="shipper"
                onChange={(e) => {
                  handleShipperSelection(e);
                }}
                value={shipperOptions.find(
                  (option) => option.id === formData.shipperId
                )}
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
          </div>
          {/* ----------------------------END ONE---------------------------------- */}
          <div className="cont-two">
            <div className="company-form__section">
              <label htmlFor="pickup" className="form-label">
                Pick-up Location:
              </label>
              <AsyncSelect
                id="pickup"
                onChange={(e) => {
                  handlePickUpSelection(e);
                }}
                value={pickupLocationOptions.find(
                  (option) => option.id === formData.pickupLocationId
                )}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={pickupLocationOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="pickupinfo"
                placeholder="Pick-up Location..."
                readonly={true}
                value={formData.pickupInfo}
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
          activeTab === "delivery" ? "show active" : ""
        } company-form__general-form`}
        id="delivery"
        style={{ display: activeTab === "delivery" ? "block" : "none" }}
      >
        <div>
          <div>
            <div className="company-form__section">
              <label htmlFor="consignee" className="form-label">
                Consignee:
              </label>
              <div className="custom-select">
                <AsyncSelect
                  id="consignee"
                  onChange={(e) => handleConsigneeSelection(e)}
                  value={consigneeOptions.find(
                    (option) => option.id === formData.consigneeId
                  )}
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
            <div className="company-form__section">
              <label htmlFor="language">Client to Bill:</label>
              <select
                name="clientToBill"
                id="clientToBill"
                className="form-input"
                onChange={(e) => {
                  handleClientToBillSelection(e);
                }}
              >
                <option value="">Select an option</option>
                <option value="shipper">Shipper</option>
                <option value="consignee">Ultimate Consignee</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <div className="company-form__section">
              <label htmlFor="delivery" className="form-label">
                Delivery Location:
              </label>
              <AsyncSelect
                id="delivery"
                onChange={(e) => {
                  handleDeliveryLocationSelection(e);
                }}
                value={deliveryLocationOptions.find(
                  (option) => option.id === formData.deliveryLocationId
                )}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={deliveryLocationOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="deliveryInfo"
                placeholder="Delivery Info..."
                value={formData.deliveryLocationInfo}
                readonly={true}
                label=""
              />
            </div>
            <div className="company-form__section">
              <AsyncSelect
                id="releasedToOther"
                isDisabled={formData.client_to_bill_type !== "other"}
                onChange={(e) => {
                  handleClientToBillSelection(e);
                }}
                value={releasedToOptions.find(
                  (option) => option.id === formData.client_to_bill
                )}
                isClearable={true}
                defaultOptions={releasedToOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
          </div>
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "carrier" ? "show active" : ""
        } company-form__general-form`}
        id="carrier"
        style={{ display: activeTab === "carrier" ? "block" : "none" }}
      >
        <div>
          <div>
            <div className="company-form__section">
              <label htmlFor="mainCarrier" className="form-label">
                Carrier:
              </label>
              <AsyncSelect
                id="mainCarrier"
                onChange={(e) => {
                  handleMainCarrierSelection(e);
                }}
                value={carrierOptions.find(
                  (option) => option.id === formData.mainCarrierdId
                )}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={carrierOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="issuedbydata"
                placeholder="Main Carrier Address..."
                value={formData.mainCarrierInfo}
                readonly={true}
                label="Return Address"
              />
            </div>
          </div>

          <div>
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
          {showRepackingForm && (
            <RepackingForm
              commodities={commodities}
              setCommodities={setcommodities}
            ></RepackingForm>
          )}
          {showCommodityCreationForm && (
            <CommodityCreationForm
              onCancel={setshowCommodityCreationForm}
              commodities={commodities}
              setCommodities={setcommodities}
            ></CommodityCreationForm>
          )}
          {showCommodityEditForm && (
            <CommodityCreationForm
              onCancel={setshowCommodityEditForm}
              commodities={commodities}
              setCommodities={setcommodities}
              commodity={selectedCommodity}
              editing={true}
            ></CommodityCreationForm>
          )}
          {showCommodityEditForm &&
            selectedCommodity?.containsCommodities &&
            selectedCommodity.internalCommodities.map(
              (internalCommodity, index) => (
                <CommodityCreationForm
                  key={index}
                  onCancel={() => {}}
                  commodities={selectedCommodity.internalCommodities}
                  setCommodities={updateSelectedCommodity}
                  commodity={internalCommodity}
                  editing={true}
                ></CommodityCreationForm>
              )
            )}
        </div>
        <Table
          data={commodities}
          columns={[
            "Description",
            " Length",
            " Height",
            " Width",
            " Weight",
            "Location",
            " Volumetric Weight",
            " Chargeable Weight",
            "Options",
          ]}
          onSelect={handleSelectCommodity} // Make sure this line is correct
          selectedRow={selectedCommodity}
          onDelete={handleCommodityDelete}
          onEdit={() => {
            setshowCommodityEditForm(!showCommodityEditForm);
          }}
          onInspect={() => {
            setshowCommodityInspect(!showCommodityInspect);
          }}
          onAdd={() => {}}
          showOptions={false}
        />
        <button
          type="button"
          onClick={() => {
            setshowRepackingForm(!showRepackingForm);
          }}
          className="button-save"
        >
          Repacking
        </button>
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
            Pick up Order {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Pick up Order. Please try
            again
          </strong>
        </Alert>
      )}
      {showCommodityInspect && (
        <div className="repacking-container" onClick={(event) => event.stopPropagation()}>
          <p>
            {selectedCommodity?.description
              ? selectedCommodity.description
              : ""}
          </p>
          <p>
            Weight: {selectedCommodity?.weight ? selectedCommodity.weight : 0}
          </p>
          <p>
            Height: {selectedCommodity?.height ? selectedCommodity.height : 0}
          </p>
          <p>Width: {selectedCommodity?.width ? selectedCommodity.width : 0}</p>
          <p>
            Length: {selectedCommodity?.length ? selectedCommodity.length : 0}
          </p>
          <p>
            Volumetric Weight:{" "}
            {selectedCommodity?.volumetricWeigth
              ? selectedCommodity.volumetricWeigth
              : 0}
          </p>
          <p>
            Chargeable Weight:{" "}
            {selectedCommodity?.chargeableWeight
              ? selectedCommodity.chargeableWeight
              : 0}
          </p>
          <p>
            Repacked?: {selectedCommodity?.containsCommodities ? "Yes" : "No"}
          </p>
          {selectedCommodity?.internalCommodities.map((com) => {
            return (
              <div key={com.id} className="card">
                <p>{com.description}</p>
                <p>Weight: {com.weight}</p>
                <p>Height: {com.height}</p>
                <p>Width: {com.width}</p>
                <p>Length: {com.length}</p>
                <p>Volumetric Weight: {com.volumetricWeight}</p>
                <p>Chargeable Weight: {com.chargedWeight}</p>
                <p>Repacked?: {com.containsCommodities ? "Yes" : "No"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

PickupOrderCreationForm.propTypes = {
  pickupOrder: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool,
  onpickupOrderDataChange: propTypes.func,
};

PickupOrderCreationForm.defaultProps = {
  pickupOrder: {},
  closeModal: null,
  creating: false,
  onpickupOrderDataChange: null,
};

export default PickupOrderCreationForm;
