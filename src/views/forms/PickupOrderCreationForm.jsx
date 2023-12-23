import { useState, useEffect, useContext, useForm } from "react";
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
import "../../styles/components/CreationForm.scss"
// import "../../styles/components/PickupOrderForm.scss";
const PickupOrderCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
  currentPickUpNumber,
  setcurrentPickUpNumber,
}) => {
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
  const [clientToBillRequest, setclientToBillRequest] = useState(null);
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
    status: 14,
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
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
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
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
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
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
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
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
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
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
      }`;
    setFormData({
      ...formData,
      mainCarrierdId: id,
      mainCarrierInfo: info,
    });
  };

  const handleClientToBillSelection = async (event) => {
    const type = event.target?.value || "";
    console.log("selecting client to bill", event);
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
        client_to_bill_type: type,
      });
    } else {
      const id = event.id;
      const type = event.type;

      setFormData({
        ...formData,
        client_to_bill_type: type,
        client_to_bill: id,
      });
    }

  };

  useEffect(() => {

    if (!creating && pickupOrder != null) {

      setcommodities(pickupOrder.commodities);
      setcharges(pickupOrder.charges);

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
        issuedByInfo: `${pickupOrder.issued_byObj?.street_and_number || ""} - ${pickupOrder.issued_byObj?.city || ""
          } - ${pickupOrder.issued_byObj?.state || ""} - ${pickupOrder.issued_byObj?.country || ""
          } - ${pickupOrder.issued_byObj?.zip_code || ""}`,
        destinationAgentId: pickupOrder.destination_agent,
        employeeId: pickupOrder.employee,
        // PICKUP TAB
        shipperId: pickupOrder.shipper,
        shipperInfo: `${pickupOrder.shipperObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.shipperObj?.data?.obj?.city || ""} - ${pickupOrder.shipperObj?.data?.obj?.state || ""
          } - ${pickupOrder.shipperObj?.data?.obj?.country || ""} - ${pickupOrder.shipperObj?.data?.obj?.zip_code || ""
          }`,
        pickupLocationId: pickupOrder.pick_up_location,
        pickupLocationInfo: `${pickupOrder.pick_up_location?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.pick_up_location?.data?.obj?.city || ""} - ${pickupOrder.pick_up_location?.data?.obj?.state || ""
          } - ${pickupOrder.pick_up_location?.data?.obj?.country || ""} - ${pickupOrder.pick_up_location?.data?.obj?.zip_code || ""
          }`,
        // DELIVERY TAB
        consigneeId: pickupOrder.consignee,
        consigneeInfo: `${pickupOrder.consigneeObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.consigneeObj?.data?.obj?.city || ""} - ${pickupOrder.consigneeObj?.data?.obj?.state || ""
          } - ${pickupOrder.consigneeObj?.data?.obj?.country || ""} - ${pickupOrder.consigneeObj?.data?.obj?.zip_code || ""
          }`,
        deliveryLocationId: pickupOrder.delivery_location,
        deliveryLocationInfo: `${pickupOrder.deliveryLocationObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.deliveryLocationObj?.data?.obj?.city || ""} - ${pickupOrder.deliveryLocationObj?.data?.obj?.state || ""
          } - ${pickupOrder.deliveryLocationObj?.data?.obj?.country || ""} - ${pickupOrder.deliveryLocationObj?.data?.obj?.zip_code || ""
          }`,
        // CARRIER TAB
        proNumber: pickupOrder.pro_number,
        trackingNumber: pickupOrder.tracking_number,
        mainCarrierdId: pickupOrder.main_carrier,
        mainCarrierInfo: `${pickupOrder.main_carrierObj?.street_and_number || ""
          } - ${pickupOrder.main_carrierObj?.city || ""} - ${pickupOrder.main_carrierObj?.state || ""
          } - ${pickupOrder.main_carrierObj?.country || ""} - ${pickupOrder.main_carrierObj?.zip_code || ""
          }`,
        // SUPPLIER TAB
        invoiceNumber: pickupOrder.invoice_number,
        purchaseOrderNumber: pickupOrder.purchase_order_number,
        // CHARGES TAB
        // COMMODITIES TAB
        commodities: pickupOrder.commodities,
        charges: pickupOrder.charges,
      };

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

  const addTypeToObjects = (arr, type) =>
    arr.map((obj) => ({ ...obj, type }));

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

  const loadIssuedBySelectOptions = async (inputValue) => {
    const responseCustomers = (await CustomerService.search(inputValue)).data.results;
    const responseVendors = (await VendorService.search(inputValue)).data.results;
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseVendors,
      "vendor"
    )), ...(addTypeToObjects(
      responseCustomers,
      "customer"
    )), ...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    ))];

    return options;
  };

  const loadDestinationAgentsSelectOptions = async (inputValue) => {

    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    ))];

    return options;
  };

  const loadShipperSelectOptions = async (inputValue) => {

    const responseCustomers = (await CustomerService.search(inputValue)).data.results;
    const responseVendors = (await VendorService.search(inputValue)).data.results;
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseVendors,
      "vendor"
    )), ...(addTypeToObjects(
      responseCustomers,
      "customer"
    )), ...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    ))];

    return options;
  };

  const loadConsigneeSelectOptions = async (inputValue) => {

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

  const loadPickUpLocationSelectOptions = async (inputValue) => {

    const responseCustomers = (await CustomerService.search(inputValue)).data.results;
    const responseVendors = (await VendorService.search(inputValue)).data.results;
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseVendors,
      "vendor"
    )), ...(addTypeToObjects(
      responseCustomers,
      "customer"
    )), ...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    ))];

    return options;
  };

  const loadDeliveryLocationSelectOptions = async (inputValue) => {

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

  const loadCarrierSelectOptions = async (inputValue) => {
    const responseCarriers = (await CarrierService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(responseCarriers, "carrier"))];

    return options;
  };

  const loadClientToBillSelectOptions = async (inputValue) => {

    const responseCustomers = (await CustomerService.search(inputValue)).data.results;
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseCustomers,
      "customer"
    )), ...(addTypeToObjects(
      responseAgents,
      "forwarding-agent"
    ))];

    return options;
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

    setdefaultValueShipper(option.data);
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => {
    if (creating) {

      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  const listId = [{ "selectedId": "#pickupnumber", "asociatedId": "#pickupnumber" }, { "selectedId": "#issuedById > div", "asociatedId": "#issuedById > div" }, { "selectedId": "#employeeId  > div", "asociatedId": "#employeeId > div" }, { "selectedId": "#creationdateandtime", "asociatedId": "#creationdateandtime" }, { "selectedId": "#pickupdateandtime", "asociatedId": "#pickupdateandtime" }, { "selectedId": "#deliverydateandtime", "asociatedId": "#deliverydateandtime" }, { "selectedId": "#shipper > div", "asociatedId": "#shipperinfo" }, { "selectedId": "#pickupLocation > div", "asociatedId": "#pickupinfo" }, { "selectedId": "#consignee > div", "asociatedId": "#consigneeInfo" }, { "selectedId": "#deliveryLocation > div", "asociatedId": "#deliveryInfo" }, { "selectedId": "#destinationAgentId > div", "asociatedId": "#destinationAgentId > div" }, { "selectedId": "#mainCarrier > div", "asociatedId": "#issuedbydata" }, { "selectedId": "#invoiceNumber", "asociatedId": "#invoiceNumber" }, { "selectedId": "#trackingNumber", "asociatedId": "#trackingNumber" }, { "selectedId": "#proNumber", "asociatedId": "#proNumber" }, { "selectedId": "#purchaseOrderNumber", "asociatedId": "#purchaseOrderNumber" }]

  useEffect(() => {
    if (commodities && commodities.length >= 1) {
      setFormData({ ...formData, status: 5 });
    }
  }, [commodities])


  const [inputStyle, setinputStyle] = useState({});
  const sendData = async () => {
    for (const inputs of listId) {
      const inputSelected = document.querySelector(inputs.selectedId)
      const inputAsociated = document.querySelector(inputs.asociatedId)
      const isValid = true;//inputSelected && inputAsociated && !(inputAsociated.value === "" || inputAsociated.value === null || inputAsociated.value === undefined)

      if (inputSelected && formData[inputSelected.id]) {
        inputSelected.style.border = "1px solid green"

        continue
      }
      else {
        if (inputSelected) inputSelected.style.border = "1px solid red"

        if (!isValid && inputSelected?.style) {
          inputSelected.style.border = "1px solid red"

        }
        else { if (inputSelected) inputSelected.style.border = "1px solid green" }
      }
    }
    //return;

    let auxVar;
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
        setconsigneeRequest(response.data.id);
        formData.client_to_bill_type === "consignee" ? auxVar = response.data.id : "";
      }
    }

    let deliveryLocationName = "";
    if (formData.deliveryLocationType === "customer") {

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
        formData.client_to_bill_type === "shipper" ? auxVar = response.data.id : "";
        setshipperRequest(response.data.id);
      }
    }

    let clientToBillName = "";

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
    if (formData.client_to_bill_type === "shipper") {
      clientToBillName = "shipperid";
      console.log("The client to bill is a shipper", auxVar);
    }
    if (formData.client_to_bill_type === "consignee") {
      console.log("The client to bill is a consignee", auxVar);
      clientToBillName = "consigneeid";
    }

    if (clientToBillName !== "") {
      const clientToBill = {
        [clientToBillName]: (formData.client_to_bill_type === "shipper" || formData.client_to_bill_type === "consignee") ? auxVar : formData.client_to_bill,
      };

      const response = await ReleaseService.createClientToBill(clientToBill);
      if (response.status === 201) {
        console.log("RESPONSE CLIENT TO BILL", response.data.id);
        setclientToBillRequest(response.data.id);
        setFormData({ ...formData, client_to_bill: response.data.id });
      }
    }
  };

  const checkUpdatesComplete = () => {

    if (
      shipperRequest !== null &&
      deliverylocation !== null &&
      pickuplocation !== null &&
      consigneeRequest !== null &&
      clientToBillRequest !== null
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
      const isForm = clickedElement.closest(".pickup")

      if (!isForm) {
        // Click is outside the modal content, close the modal
        setselectedCommodity(null);
        setshowCommodityEditForm(false);

      }
    };

    // Add the event listener when the component mounts
    document.querySelector(".pickup")?.addEventListener("click", handleModalClick);
    // Remove the event listener when the component unmounts
    return () => {
      document.querySelector(".pickup")?.removeEventListener("click", handleModalClick);
    };
  }, []);

  useEffect(() => {

    if (commodities.length > 0) {

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
            window.location.reload();
          }, 2000);
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
    clientToBillRequest
  ]);
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

    <form className="company-form pickup">
      <div className="row w-100">
        {/* General Form */}
        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name"><h3>General</h3><span></span></div>
            <div className="row align-items-center mb-3">
              <div className="col-3 text-start text-start">
                <Input id="pickupnumber"
                  type="number"
                  inputName="pickupnumber"
                  placeholder="Pickup Order Number..."
                  value={formData.number}
                  readonly={true}
                  label="Number"
                />
              </div>
              <div className="col-3 text-start">
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
              <div className="col-6 text-start">
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
                      loadOptions={loadDestinationAgentsSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      value={destinationAgentOptions.find(
                        (option) => option.id === formData.destinationAgentId
                      )}
                    />
                  )
                ) : (
                  <AsyncSelect
                    id="destinationAgentId"
                    onChange={(e) => {
                      handleDestinationAgentSelection(e);
                    }}
                    isClearable={true}
                    defaultOptions={destinationAgentOptions}
                    loadOptions={loadDestinationAgentsSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-center mb-3">
              <div className="col-3 text-start">
                <label htmlFor="employee" className="form-label">
                  Employee:
                </label>
                <AsyncSelect
                  id="employeeId"
                  defaultValue={formData.employeeId}
                  onChange={(e) => {
                    handleEmployeeSelection(e);
                  }}
                  isClearable={true}
                  placeholder="Search and select..."
                  defaultOptions={employeeOptions}
                  loadOptions={loadEmployeeSelectOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>
              <div className="col-3 text-start">
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
                    className="creation creation-label"
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-3 text-start">
                <label htmlFor="issuedby" className="form-label issuedBy">
                  Issued By:
                </label>
                <AsyncSelect
                  id="issuedById"
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

              <div className="col-3 text-start">
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
          </div>
        </div>
        {/* Pickup Form */}
        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name"><h3>Pickup Information</h3><span></span></div>
            <div className="row align-items-center mb-3">

              <div className="col-3 text-start">
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
                  loadOptions={loadShipperSelectOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>

              <div className="col-3 text-start">
                <Input
                  type="text"
                  inputName="invoiceNumber"
                  value={formData.invoiceNumber}
                  changeHandler={(e) =>
                    setFormData({ ...formData, invoiceNumber: e.target.value })
                  }
                  label="Purchase Order"
                />
              </div>

              <div className="col-3 text-start">
                <label htmlFor="pickup" className="form-label">
                  Pick-up Location:
                </label>
                <AsyncSelect
                  id="pickupLocation"
                  onChange={(e) => {
                    handlePickUpSelection(e);
                  }}
                  value={pickupLocationOptions.find(
                    (option) => option.id === formData.pickupLocationId
                  )}
                  isClearable={true}
                  placeholder="Search and select..."
                  defaultOptions={pickupLocationOptions}
                  loadOptions={loadPickUpLocationSelectOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>


              <div className="col-3 text-start">

                <Input
                  type="text"
                  inputName="purchaseOrderNumber"
                  value={formData.purchaseOrderNumber}
                  changeHandler={(e) =>
                    setFormData({
                      ...formData,
                      purchaseOrderNumber: e.target.value,
                    })
                  }
                  label="Invoice Number"
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-6 text-start">
                <Input
                  id="TextShipperLocation"
                  type="textarea"
                  inputName="shipperinfo"
                  placeholder="Shipper Location..."
                  value={formData.shipperInfo}
                  readonly={true}
                />
              </div>


              <div className="col-6 text-start">
                <Input
                  id="TextPickupLocation"
                  type="textarea"
                  inputName="pickupinfo"
                  placeholder="Pick-up Location..."
                  readonly={true}
                  value={formData.pickupInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>




      <div className="form-label_name"><h3>Delivery Information</h3><span></span></div>
      <div className="creation creation-container w-100">
        <div className="row align-items-center mb-3">
          <div className="col-6 text-start">
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
                loadOptions={loadConsigneeSelectOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
          </div>

          <div className="col-6 text-start">
            <label htmlFor="delivery" className="form-label">
              Delivery Location:
            </label>
            <AsyncSelect
              id="deliveryLocation"
              onChange={(e) => {
                handleDeliveryLocationSelection(e);
              }}
              value={deliveryLocationOptions.find(
                (option) => option.id === formData.deliveryLocationId
              )}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={deliveryLocationOptions}
              loadOptions={loadDeliveryLocationSelectOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>

        </div>

        <div className="row align-items-center">
          <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                id="TextConsignee"
                type="textarea"
                inputName="consigneeInfo"
                placeholder="Consignee Info..."
                value={formData.consigneeInfo}
                readonly={true}
                label="Address"
              />
            </div>
          </div>

          <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                id="TextDeliveryLocation"
                type="textarea"
                inputName="deliveryInfo"
                placeholder="Delivery Info..."
                value={formData.deliveryLocationInfo}
                readonly={true}
                label="Address"
              />
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-6 text-start">
            <label htmlFor="language"
              style={{ fontWeight: 'bold', fontSize: '15px', color: '#153A61', marginRight: '10px' }}>
              Client to Bill:
            </label>
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
          <div className="col-6 text-start">
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

      <div className="form-label_name"><h3>Carrier Information</h3><span></span></div>
      <div className="creation creation-container w-100">
        <div className="row align-items-center mb-3">
          <div className="col-6 text-start">
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
              loadOptions={loadCarrierSelectOptions}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </div>
          <div className="col-6 text-start">
            <Input
              id="trackingNumber"
              type="text"
              inputName="trackingNumber"
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
              id="TextMainCarrier"
              type="textarea"
              inputName="issuedbydata"
              value={formData.mainCarrierInfo}
              readonly={true}
              label="Address"
            />
          </div>
          <div className="col-6 text-start">
            <Input
              id="proNumber"
              type="text"
              inputName="proNumber"
              value={formData.proNumber}
              changeHandler={(e) =>
                setFormData({ ...formData, proNumber: e.target.value })
              }
              label="PRO Number"
            />
          </div>

        </div>
      </div>

      <div className="form-label_name"><h3>Commodities</h3><span></span></div>
      <div className="creation-creation-container w-100">


        <CommodityCreationForm
          onCancel={setshowCommodityCreationForm}
          commodities={commodities}
          setCommodities={setcommodities}
          setShowCommoditiesCreationForm={setshowCommodityCreationForm}
        ></CommodityCreationForm>


        {showCommodityCreationForm && (
          <><Table
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
            onAdd={() => { }}
            showOptions={false}
          />
            <button type="button" onClick={() => {
              setshowRepackingForm(!showRepackingForm);
            }}>Repack</button></>
        )}

        {showRepackingForm && (
          <RepackingForm
            commodities={commodities}
            setCommodities={setcommodities}
          ></RepackingForm>
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
                onCancel={() => { }}
                commodities={selectedCommodity.internalCommodities}
                setCommodities={updateSelectedCommodity}
                commodity={internalCommodity}
                editing={true}
              ></CommodityCreationForm>
            )
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

      <div className="form-label_name"><h3>Charges</h3><span></span></div>
      <div className="creation creation-container w-100">
        {true && (
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

        {showIncomeForm && (<Table
          data={charges}
          columns={[
            "Status",
            "Type",
            "Description",
            "Quantity",
            "Price",
            "Currency",
          ]}
          onSelect={() => { }} // Make sure this line is correct
          selectedRow={{}}
          onDelete={() => { }}
          onEdit={() => { }}
          onAdd={() => { }}
          showOptions={false}
        />
        )}
      </div>
      <div className="creation creation-container w-100">
        {true && (
          <ExpenseChargeForm
            onCancel={setshowExpenseForm}
            charges={charges}
            setcharges={setcharges}
            commodities={commodities}
            agent={agent}
            consignee={consignee}
            shipper={shipper}
          ></ExpenseChargeForm>
        )}
        {showExpenseForm && (<Table
          data={charges}
          columns={[
            "Status",
            "Type",
            "Description",
            "Quantity",
            "Price",
            "Currency",
          ]}
          onSelect={() => { }} // Make sure this line is correct
          selectedRow={{}}
          onDelete={() => { }}
          onEdit={() => { }}
          onAdd={() => { }}
          showOptions={false}
        />)}


      </div>
      <div className="company-form__options-container">
        <button className="button-save" onClick={(e) => { e.preventDefault(); sendData() }}
          type="submit"
        >
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
    </form>

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