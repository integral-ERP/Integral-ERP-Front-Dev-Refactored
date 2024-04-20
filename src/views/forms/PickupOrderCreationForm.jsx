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
import "../../styles/components/CreationForm.scss";
import { fetchFormData } from "./DataFetcher";
import ReceiptService from "../../services/ReceiptService";

const PickupOrderCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
  currentPickUpNumber,
  setcurrentPickUpNumber,
  showBModal,
  fromPickUp,//added fromPickUp para save commodities
}) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [allStateUpdatesComplete, setAllStateUpdatesComplete] = useState(false);
  const [showIncomeForm, setshowIncomeForm] = useState(false);
  const [showExpenseForm, setshowExpenseForm] = useState(false);
  const [agent, setagent] = useState(null);
  const [consignee, setconsignee] = useState(null);
  const [shipper, setshipper] = useState(null);
  const [pickuplocation, setpickuplocation] = useState(null);
  const [deliverylocation, setdeliverylocation] = useState(null);
  const [consigneeRequest, setconsigneeRequest] = useState(null);
  const [shipperRequest, setshipperRequest] = useState(null);
  const [releasedToOptions, setReleasedToOptions] = useState([]);
  const [clientToBillRequest, setclientToBillRequest] = useState(null);
  const [showCommodityCreationForm, setshowCommodityCreationForm] = useState(false);
  const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
  const [showCommodityInspect, setshowCommodityInspect] = useState(false);
  const [showRepackingForm, setshowRepackingForm] = useState(false);
  const [weightUpdated, setWeightUpdated] = useState(0);
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
  const [CTBType, setCTBType] = useState("");
  const [editingComodity, setEditingComodity] = useState(false);
  //added events y attachments para save commodities
  const [events, setEvents] = useState([]);
  const [attachments, setattachments] = useState([]);


  const formFormat = {
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

    shipperId: "",
    shipperType: "",
    shipperInfo: "",

    supplierId: "",
    supplierType: "",
    supplierInfo: "",

    pickupLocationId: "",
    pickupLocationType: "",
    pickupLocationInfo: "",

    consigneeId: "",
    consigneeType: "",
    consigneeInfo: "",

    deliveryLocationId: "",
    deliveryLocationType: "",
    deliveryLocationInfo: "",
    client_to_bill: "",
    client_to_bill_type: "",

    proNumber: "",
    trackingNumber: "",
    mainCarrierdId: "",
    mainCarrierInfo: "",
    invoiceNumber: "",
    purchaseOrderNumber: "",

    commodities: [],
    weight: 0,
  };
  const [formData, setFormData] = useState(formFormat);

  useEffect(() => {
    fetchFormData()
      .then((data) => {
        const forwardingAgents = data.filter(item => item.type === 'forwarding-agent');
        const customers = data.filter(item => item.type === 'customer');
        const vendors = data.filter(item => item.type === 'vendor');
        const employees = data.filter(item => item.type === 'employee');
        const carriers = data.filter(item => item.type === 'Carrier');

        setIssuedByOptions([...forwardingAgents])
        setDestinationAgentOptions([...forwardingAgents])
        setEmployeeOptions([...employees]);
        setShipperOptions([...forwardingAgents, ...customers, ...vendors])
        setPickupLocationOptions([...forwardingAgents, ...customers, ...vendors])
        setConsigneeOptions([...forwardingAgents, ...customers, ...vendors, ...carriers])
        setDeliveryLocationOptions([...forwardingAgents, ...customers, ...vendors, ...carriers])
        setCarrierOptions([...carriers])
        setReleasedToOptions([...forwardingAgents, ...customers, ...vendors])
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleIssuedBySelection = async (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ['forwarding-agent'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported IssuedBy type: ${type}`);
      return;
    }
    const selectedObject = issuedByOptions.find(option => option.id === id && option.type === type);
    const info = `${selectedObject?.street_and_number || ""} - ${selectedObject?.city || ""
      } - ${selectedObject?.state || ""} - ${selectedObject?.country || ""} - ${selectedObject?.zip_code || ""
      }`;
    setFormData({
      ...formData,
      issuedById: id,
      issuedByType: type,
      issuedByInfo: info,
    });
  };

  const handlePickUpSelection = async (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ['forwarding-agent', 'customer', 'vendor'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported pickup type: ${type}`);
      return;
    }
    const selectedObject = pickupLocationOptions.find(option => option.id === id && option.type === type);
    const info = `${selectedObject?.street_and_number || ""} - ${selectedObject?.city || ""
      } - ${selectedObject?.state || ""} - ${selectedObject?.country || ""} - ${selectedObject?.zip_code || ""
      }`;
    setFormData({
      ...formData,
      pickupLocationId: id,
      pickupLocationInfo: info,
      pickupLocationType: type,
    });
  };

  const handleSelectCommodity = (commodity) => {
    setselectedCommodity(commodity);
  };

  const handleDeliveryLocationSelection = async (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ['forwarding-agent', 'customer', 'vendor', 'Carrier'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported delivery location type: ${type}`);
      return;
    }
    const deliveryLocation = deliveryLocationOptions.find(option => option.id === id && option.type === type);
    if (deliveryLocation) {
      const info = `${deliveryLocation?.street_and_number || ""} - ${deliveryLocation?.city || ""
        } - ${deliveryLocation?.state || ""} - ${deliveryLocation?.country || ""} - ${deliveryLocation?.zip_code || ""
        }`;
      setdeliverylocation(deliveryLocation);
      setFormData({
        ...formData,
        deliveryLocationId: id,
        deliveryLocationInfo: info,
        deliveryLocationType: type,
      });
    } else {
      console.error("Error: No se encontró la ubicación de entrega con el id y tipo especificados.");
    }
  };


  const handleDestinationAgentSelection = async (event) => {
    const id = event?.id;
    const type = event?.type || "";
    const validTypes = ['forwarding-agent'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported Destination Agent type: ${type}`);
      return;
    }
    setFormData({
      ...formData,
      destinationAgentId: id,
    });
  };

  const handleEmployeeSelection = async (event) => {
    const id = event?.id;
    const type = event?.type || "";
    const validTypes = ['employee'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported employee type: ${type}`);
      return;
    }
    setFormData({
      ...formData,
      employeeId: id,
    });
  };

  const handleConsigneeSelection = (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ['forwarding-agent', 'customer', 'vendor', 'Carrier'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported consignee type: ${type}`);
      return;
    }
    const selectedConsignee = consigneeOptions.find(option => option.id === id && option.type === type);
    if (!selectedConsignee) {
      console.error(`Consignee not found with ID ${id} and type ${type}`);
      return;
    }

    const info = `${selectedConsignee.street_and_number || ""} - ${selectedConsignee.city || ""
      } - ${selectedConsignee.state || ""} - ${selectedConsignee.country || ""} - ${selectedConsignee.zip_code || ""
      }`;
    setconsignee(selectedConsignee);
    setdefaultValueConsignee(selectedConsignee);
    setFormData({
      ...formData,
      consigneeId: id,
      consigneeType: type,
      consigneeInfo: info,
    });
  };


  const handleShipperSelection = (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ['forwarding-agent', 'customer', 'vendor'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported shipper type: ${type}`);
      return;
    }
    const selectedShipper = shipperOptions.find(option => option.id === id && option.type === type);
    if (!selectedShipper) {
      console.error(`Shipper not found with ID ${id} and type ${type}`);
      return;
    }
    const info = `${selectedShipper?.street_and_number || ""} - ${selectedShipper?.city || ""
      } - ${selectedShipper?.state || ""} - ${selectedShipper?.country || ""} - ${selectedShipper?.zip_code || ""
      }`;

    setshipper(selectedShipper);
    setdefaultValueShipper(selectedShipper);
    setFormData({
      ...formData,
      shipperId: id,
      shipperType: type,
      shipperInfo: info,
      supplierId: id,
      supplierType: type,
      supplierInfo: info
    });
  };
  const handleCommodityDelete = () => {
    const newCommodities = commodities.filter(
      (com) => com.id != selectedCommodity.id
    );
    setcommodities(newCommodities);
  };

  const handleMainCarrierSelection = async (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ['Carrier'];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported shipper type: ${type}`);
      return;
    }
    const selectedCarrier = carrierOptions.find(option => option.id === id && option.type === type);
    if (!selectedCarrier) {
      console.error(`Shipper not found with ID ${id} and type ${type}`);
      return;
    }
    const info = `${selectedCarrier?.street_and_number || ""} - ${selectedCarrier?.city || ""
      } - ${selectedCarrier?.state || ""} - ${selectedCarrier?.country || ""} - ${selectedCarrier?.zip_code || ""
      }`;
    setFormData({
      ...formData,
      mainCarrierdId: id,
      mainCarrierInfo: info,
    });
  };

  const handleClientToBillSelection = async (event) => {
    const type = event?.target?.value || "";
    if (type === "other") {
      setFormData({ ...formData, client_to_bill_type: type });
    } else if (type === "shipper" || type === "consignee") {
      if (formData.shipperId || formData.consigneeId) {
        const id = type === "shipper" ? formData.shipperId : formData.consigneeId;
        setFormData({
          ...formData,
          client_to_bill_type: type,
          client_to_bill: id,
        });
      } else {
        console.error("ShipperId or consigneeId is not available.");
      }
    } else {
      setCTBType(event?.type);
      const id = event?.id;
      const type = event?.type === "shipper" ? "shipper" : event?.type === "consignee" ? "consignee" : "other";

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
      setshowCommodityCreationForm(true);
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
        employeeByName: pickupOrder.employeeObj?.data?.obj?.name,
        weight: pickupOrder.weight,

        shipperId: pickupOrder.shipperObj?.data?.obj?.id,
        shipperType:
          pickupOrder.shipperObj?.data?.obj?.type_person !== "agent"
            ? pickupOrder.shipperObj?.data?.obj?.type_person
            : "forwarding-agent",
        shipperInfo: `${pickupOrder.shipperObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.shipperObj?.data?.obj?.city || ""} - ${pickupOrder.shipperObj?.data?.obj?.state || ""
          } - ${pickupOrder.shipperObj?.data?.obj?.country || ""} - ${pickupOrder.shipperObj?.data?.obj?.zip_code || ""
          }`,

        pickupLocationId: pickupOrder.pickUpLocationObj?.data?.obj?.id,
        pickupLocationInfo: `${pickupOrder.pickUpLocationObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.pickUpLocationObj?.data?.obj?.city || ""} - ${pickupOrder.pickUpLocationObj?.data?.obj?.state || ""
          } - ${pickupOrder.pickUpLocationObj?.data?.obj?.country || ""} - ${pickupOrder.pickUpLocationObj?.data?.obj?.zip_code || ""
          }`,
        pickupLocationType:
          pickupOrder.pickUpLocationObj?.data?.obj?.type_person !== "agent"
            ? pickupOrder.pickUpLocationObj?.data?.obj?.type_person
            : "forwarding-agent",

        consigneeId: pickupOrder.consigneeObj?.data?.obj?.id,
        consigneeInfo: `${pickupOrder.consigneeObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.consigneeObj?.data?.obj?.city || ""} - ${pickupOrder.consigneeObj?.data?.obj?.state || ""
          } - ${pickupOrder.consigneeObj?.data?.obj?.country || ""} - ${pickupOrder.consigneeObj?.data?.obj?.zip_code || ""
          }`,
        consigneeType: pickupOrder.consigneeObj?.data?.obj?.type_person,
        deliveryLocationId: pickupOrder.deliveryLocationObj?.data?.obj?.id,
        deliveryLocationType:
          pickupOrder.deliveryLocationObj?.data?.obj?.type_person !== "agent"
            ? pickupOrder.deliveryLocationObj?.data?.obj?.type_person
            : "forwarding-agent",
        deliveryLocationInfo: `${pickupOrder.deliveryLocationObj?.data?.obj?.street_and_number || ""
          } - ${pickupOrder.deliveryLocationObj?.data?.obj?.city || ""} - ${pickupOrder.deliveryLocationObj?.data?.obj?.state || ""
          } - ${pickupOrder.deliveryLocationObj?.data?.obj?.country || ""} - ${pickupOrder.deliveryLocationObj?.data?.obj?.zip_code || ""
          }`,

        proNumber: pickupOrder.pro_number,
        trackingNumber: pickupOrder.tracking_number,
        mainCarrierdId: pickupOrder.main_carrier,
        mainCarrierInfo: `${pickupOrder.main_carrierObj?.street_and_number || ""
          } - ${pickupOrder.main_carrierObj?.city || ""} - ${pickupOrder.main_carrierObj?.state || ""
          } - ${pickupOrder.main_carrierObj?.country || ""} - ${pickupOrder.main_carrierObj?.zip_code || ""
          }`,

        invoiceNumber: pickupOrder.invoice_number,
        purchaseOrderNumber: pickupOrder.purchase_order_number,

        commodities: pickupOrder.commodities,
        charges: pickupOrder.charges,
        client_to_billById: pickupOrder.client_to_billObj?.data?.obj?.data?.obj
          ?.id
          ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          : pickupOrder.client_to_billObj?.data?.obj?.id,
        client_to_bill: pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          : pickupOrder.client_to_billObj?.data?.obj?.id,
        client_to_bill_type: pickupOrder.client_to_billObj?.data?.obj?.data?.obj
          ?.type_person
          ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id ===
            pickupOrder.shipperObj?.data?.obj?.id
            ? "shipper"
            : pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id ===
              pickupOrder.consigneeObj?.data?.obj?.id
              ? "consignee"
              : "other"
          : "other",
      };
      let temp = pickupOrder.client_to_billObj?.data?.obj?.data?.obj
        ?.type_person
        ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.type_person
        : pickupOrder.client_to_billObj?.data?.obj?.type_person;
      setCTBType(temp !== "agent" ? temp : "forwarding-agent");
      handleClientToBillSelection({
        id: pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          : pickupOrder.client_to_billObj?.data?.obj?.id,
        type: temp !== "agent" ? temp : "forwarding-agent",
      });
      setFormData(updatedFormData);
      setcanRender(true);

    }
  }, [creating, pickupOrder]);

  useEffect(() => {
    if (charges.length > 0) {
      setshowExpenseForm(true);
      setshowIncomeForm(true);
    }
  }, [charges.length]);

  const SortArray = (x, y) => {
    return new Intl.Collator("es").compare(x.name, y.name);
  };


  const loadSelectOptions = async (options, inputValue) => {
    let filteredOptions = options;
    if (inputValue) {
      filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    const mappedOptions = filteredOptions.map(option => ({
      ...option,
      value: option.id,
      label: option.name
    }));

    return mappedOptions;
  };

  const loadEmployeeSelectOptions = async (inputValue) => {
    return await loadSelectOptions(employeeOptions, inputValue)
  }
  const loadIssuedBySelectOptions = async (inputValue) => {
    return await loadSelectOptions(issuedByOptions, inputValue)
  }

  const loadDestinationAgentsSelectOptions = async (inputValue) => {
    return await loadSelectOptions(destinationAgentOptions, inputValue)
  }
  const loadShipperSelectOptions = async (inputValue) => {
    return await loadSelectOptions(shipperOptions, inputValue)
  }

  const loadConsigneeSelectOptions = async (inputValue) => {
    return await loadSelectOptions(consigneeOptions, inputValue)
  }

  const loadPickUpLocationSelectOptions = async (inputValue) => {
    return await loadSelectOptions(pickupLocationOptions, inputValue)
  }

  const loadDeliveryLocationSelectOptions = async (inputValue) => {
    return await loadSelectOptions(deliveryLocationOptions, inputValue)
  }

  const loadCarrierSelectOptions = async (inputValue) => {
    return await loadSelectOptions(carrierOptions, inputValue)
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
    if (type === "Carrier") {
      option = await CarrierService.getCarrierById(id);
    }
    setdefaultValueShipper(option?.data);
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
    if (type === "Carrier") {
      option = await CarrierService.getCarrierById(id);
    }
    setdefaultValueConsignee(option?.data);
  };


  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => { }, [formData.pickupLocationId]);

  useEffect(() => {
    if (creating) {
      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  const listId = [
    { selectedId: "#pickupnumber", asociatedId: "#pickupnumber" },
    { selectedId: "#issuedById > div", asociatedId: "#issuedById > div" },
    { selectedId: "#employeeId  > div", asociatedId: "#employeeId > div" },
    { selectedId: "#creationdateandtime", asociatedId: "#creationdateandtime" },
    { selectedId: "#pickupdateandtime", asociatedId: "#pickupdateandtime" },
    { selectedId: "#deliverydateandtime", asociatedId: "#deliverydateandtime" },
    { selectedId: "#shipper > div", asociatedId: "#shipperinfo" },
    // { selectedId: "#pickupLocation > div", asociatedId: "#pickupinfo" },
    { selectedId: "#pickupLocation > div", asociatedId: "#pickupLocationInfo" },
    { selectedId: "#consignee > div", asociatedId: "#consigneeInfo" },
    { selectedId: "#deliveryLocation > div", asociatedId: "#deliveryInfo" },
    {
      selectedId: "#destinationAgentId > div",
      asociatedId: "#destinationAgentId > div",
    },
    { selectedId: "#mainCarrier > div", asociatedId: "#issuedbydata" },
    { selectedId: "#invoiceNumber", asociatedId: "#invoiceNumber" },
    { selectedId: "#trackingNumber", asociatedId: "#trackingNumber" },
    { selectedId: "#proNumber", asociatedId: "#proNumber" },
    { selectedId: "#purchaseOrderNumber", asociatedId: "#purchaseOrderNumber" },
  ];

  useEffect(() => {
    if (commodities && commodities.length >= 1) {
      setFormData({ ...formData, status: 5 });
    }
  }, [commodities]);

  const [inputStyle, setinputStyle] = useState({});
  const sendData = async () => {
    for (const inputs of listId) {
      const inputSelected = document.querySelector(inputs.selectedId);
      const inputAsociated = document.querySelector(inputs.asociatedId);
      const isValid = true; //inputSelected && inputAsociated && !(inputAsociated.value === "" || inputAsociated.value === null || inputAsociated.value === undefined)

      if (inputSelected && formData[inputSelected.id]) {
        inputSelected.style.border = "1px solid green";

        continue;
      } else {
        if (inputSelected) inputSelected.style.border = "1px solid red";

        if (!isValid && inputSelected?.style) {
          inputSelected.style.border = "1px solid red";
        } else {
          if (inputSelected) inputSelected.style.border = "1px solid green";
        }
      }
    }

    if (commodities.length > 0) {
      let totalWeight = 0;
      commodities.forEach((com) => {
        totalWeight += parseFloat(com.weight);
      });

      setWeightUpdated(totalWeight);
    }

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
    if (formData.consigneeType === "Carrier") {
      consigneeName = "carrierid";
    }
    if (consigneeName !== "") {
      const consignee = {
        [consigneeName]: formData.consigneeId,
      };

      const response = await PickupService.createConsignee(consignee);
      if (response.status === 201) {
        formData.client_to_bill_type === "consignee"
          ? (auxVar = response.data.id)
          : "";
        setconsigneeRequest(response.data.id);
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
    if (formData.deliveryLocationType === "Carrier") {
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
    if (formData.pickupLocationType === "Carrier") {
      pickUpLocationName = "carrierid";
    }
    if (pickUpLocationName !== "") {
      const consignee = {
        [pickUpLocationName]: formData.pickupLocationId,
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
    if (formData.shipperType === "Carrier") {
      shipperName = "carrierid";
    }
    if (shipperName !== "") {
      const consignee = {
        [shipperName]: formData.shipperId,
      };

      const response = await PickupService.createShipper(consignee);
      if (response.status === 201) {
        formData.client_to_bill_type === "shipper"
          ? (auxVar = response.data.id)
          : "";
        setshipperRequest(response.data.id);
      }
    }

    let clientToBillName = "";

    if (formData.client_to_bill_type === "other") {
      if (CTBType === "customer") {
        clientToBillName = "customerid";
      }
      if (CTBType === "vendor") {
        clientToBillName = "vendorid";
      }
      if (CTBType === "forwarding-agent") {
        clientToBillName = "agentid";
      }
      if (CTBType === "carrier") {
        clientToBillName = "carrierid";
      }
    }
    if (formData.client_to_bill_type === "shipper") {
      clientToBillName = "shipperid";
    }
    if (formData.client_to_bill_type === "consignee") {
      clientToBillName = "consigneeid";
    }

    if (clientToBillName !== "") {
      const clientToBill = {
        [clientToBillName]:
          formData.client_to_bill_type === "shipper" ||
            formData.client_to_bill_type === "consignee"
            ? auxVar
            : formData.client_to_bill,
      };
      const response = await ReleaseService.createClientToBill(clientToBill);
      if (response.status === 201) {
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
      const clickedElement = event.target;
      const isForm = clickedElement.closest(".pickup");

      if (!isForm) {
        setselectedCommodity(null);
        setshowCommodityEditForm(false);
      }
    };

    document
      .querySelector(".pickup")
      ?.addEventListener("click", handleModalClick);

    return () => {
      document
        .querySelector(".pickup")
        ?.removeEventListener("click", handleModalClick);
    };
  }, []);

  useEffect(() => {
    if (commodities.length > 0) {
      setFormData({ ...formData, status: 4 });
    }
  }, [commodities]);

  useEffect(() => {
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      const createPickUp = async () => {
        let rawData = {
          status: formData.status,
          number: formData.number,
          creation_date: formData.createdDateAndTime,
          pick_up_date: formData.pickupDateAndTime,
          delivery_date: formData.deliveryDateAndTime,
          issued_by: formData.issuedById,
          destination_agent: formData.destinationAgentId,
          employee: formData.employeeId,

          shipper: shipperRequest,
          shipperType: "",
          pick_up_location: pickuplocation,

          consignee: consigneeRequest,
          delivery_location: deliverylocation,
          client_to_bill_type: formData.client_to_bill_type,
          client_to_bill: formData.client_to_bill,

          pro_number: formData.proNumber,
          tracking_number: formData.trackingNumber,
          inland_carrier: formData.mainCarrierdId,
          main_carrier: formData.mainCarrierdId,

          invoice_number: formData.invoiceNumber,
          purchase_order_number: formData.purchaseOrderNumber,

          commodities: commodities,
          charges: charges,
         /*  supplier: formData.shipperId, */
          weight: weightUpdated,
        };

        const response = await (creating
          ? PickupService.createPickup(rawData)
          : PickupService.updatePickup(pickupOrder.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
          setcurrentPickUpNumber(currentPickUpNumber + 1);
          setShowSuccessAlert(true);
          setTimeout(() => {
            closeModal();
            onpickupOrderDataChange();
            setShowSuccessAlert(false);
            setFormData(formFormat);
            window.location.reload();
          }, 500 /* 2147483647 */);
        } else {
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
    clientToBillRequest,
    weightUpdated,
  ]);
  const [colorTab, setcolorTab] = useState(true);
  useEffect(() => {
    const listItems = document.querySelectorAll(".nav-item");
    if (!listItems) return;
    for (const item of listItems) {
      item.addEventListener("click", () => {
        setcolorTab(false);
      });
    }
  }, []);

  //added save commodities
  useEffect(() => {
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      const createPickUp = async () => {
        let rawData = {
          status: 14,
          number: formData.number,
          creation_date: formData.createdDateAndTime,
          issued_by: formData.issuedById,
          destination_agent: formData.destinationAgentId,
          employee: formData.employeeId,
          supplier: formData.supplierId,
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
          weight: weightUpdated,
        };
        const response = await (creating
          ? ReceiptService.createReceipt(rawData)
          : ReceiptService.updateReceipt(pickupOrder.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
          if (fromPickUp) {
            console.log("BANDERA-1 = ", fromPickUp);
            //added onhand status
            const statusOnhand = 4;
            const newPickup = { ...pickupOrder, status: statusOnhand };
            PickupService.updatePickup(pickupOrder.id, newPickup);
          }

          if (!fromPickUp) {
            //added onhand status
            console.log("BANDERA-2 = ", fromPickUp);
          }
          setcurrentPickUpNumber(currentPickUpNumber + 1);
          setShowSuccessAlert(true);
          setTimeout(() => {
            closeModal();
            onpickupOrderDataChange();
            setShowSuccessAlert(false);
            setFormData(formFormat);
            //added redirect to warehouse receipt
            window.location.href = `/warehouse/receipt`;
          }, 2000);
        } else {
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


  const getAsyncSelectValue = () => {
    let selectedOption = null;
    if (formData.client_to_bill_type === "shipper") {
      selectedOption = releasedToOptions.find(
        (option) =>
          option.id === formData.shipperId &&
          option.type === formData.shipperType
      );
    } else if (formData.client_to_bill_type === "consignee") {
      selectedOption = releasedToOptions.find(
        (option) =>
          option.id === formData.consigneeId &&
          option.type === formData.consigneeType
      );
    } else {
      selectedOption = releasedToOptions.find(
        (option) =>
          option.id === formData.client_to_bill && option.type === CTBType
      );
    }
    return selectedOption;
  };
  //--------------------------------------------------
  //added edit commodities
  const handleCommodityEdit = () => {
    console.log("commodities description ", selectedCommodity.description);
    setEditingComodity(true);
    console.log("commodities description ", selectedCommodity);
  };

  return (
    <div className="form-container">
      <form className="company-form pickup">
        <div className="row w-100">
          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>General</h2>
                <span></span>
              </div>
              <div className="row align-items-center mb-3">
                <div className="col-6 text-start text-start">
                  <Input
                    id="pickupnumber"
                    type="number"
                    inputName="pickupnumber"
                    placeholder="Pickup Order Number..."
                    value={formData.number}
                    readonly={true}
                    label="Number"
                  />
                </div>
                <div className="col-6 text-start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p id="creation-date" className="text-date">
                      Creation Date and Time
                    </p>
                    <DateTimePicker
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
              </div>
              <div className="row align-items-center mb-3">
                <div className="col-6 text-start">
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
                    value={employeeOptions.find(
                      (employee) => employee.id === formData.employeeId
                    )}
                    loadOptions={loadEmployeeSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>
                <div className="col-6 text-start" id="dates">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p id="creation-date" className="text-date">Pick-up Date and Time</p>
                    <DateTimePicker
                      // label="Pick-up Date and Time"
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
              <div className="row mb-3">
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
                        className="async-option"
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
                      className="async-option"
                      isClearable={true}
                      defaultOptions={destinationAgentOptions}
                      loadOptions={loadDestinationAgentsSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      value={destinationAgentOptions.find(
                        (option) => option.id === formData.destinationAgentId
                      )}
                    />
                  )}
                </div>

                <div className="col-6 text-start" id="dates">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p id="creation-date" className="text-date">Delivery Date and Time</p>
                    <DateTimePicker
                      // label="Delivery Date and Time"
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

              <div className="row mb-3">
                <div className="col-6 text-start">
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
                <div className="col-6 text-start" style={{ marginTop: "20px" }}>
                  <div className="company-form__section">
                    <Input
                      type="textarea"
                      inputName="issuedbyinfo"
                      placeholder="Apply to..."
                      value={formData.issuedByInfo}
                      readonly={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>Pickup Information</h2>
                <span></span>
              </div>

              <div className="row">
                <div className="col-6 text-start">
                  <label htmlFor="shipper" className="form-label">
                    Shipper:
                  </label>
                  <AsyncSelect
                    id="shipper"
                    onChange={(e) => {
                      handleShipperSelection(e);
                    }}
                    value={defaultValueShipper}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={shipperOptions}
                    loadOptions={loadShipperSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>

                <div className="col-6 text-start">
                  <Input
                    type="text"
                    inputName="invoiceNumber"
                    value={formData.invoiceNumber}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        invoiceNumber: e.target.value,
                      })
                    }
                    label="Purchase Order"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 text-start">
                  <Input
                    id="TextShipperLocation"
                    type="textarea"
                    inputName="shipperinfo"
                    placeholder="Shipper Location..."
                    value={formData.shipperInfo}
                    readonly={true}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-6 text-start">
                  <label htmlFor="pickup" className="form-label">
                    Pick-up Location:
                  </label>
                  <AsyncSelect
                    id="pickupLocation"
                    onChange={(e) => {
                      handlePickUpSelection(e);
                    }}
                    value={pickupLocationOptions.find(
                      (option) =>
                        option.id === formData.pickupLocationId &&
                        option.type === formData.pickupLocationType
                    )}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={pickupLocationOptions}
                    loadOptions={loadPickUpLocationSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>

                <div className="col-6 text-start">
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
              <div className="row mb-3">
                <div className="col-12 text-start">
                  <Input
                    id="TextPickupLocation"
                    type="textarea"
                    inputName="pickupinfo"
                    placeholder="Pick-up Location..."
                    readonly={true}
                    // value={formData.pickupInfo}
                    value={formData.pickupLocationInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row w-100">
          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>Delivery Information</h2>
                <span></span>
              </div>
              <div className="row align-items-center mb-3">
                <div className="col-6 text-start">
                  <label htmlFor="consignee" className="form-label">
                    Consignee:
                  </label>
                  <div className="custom-select">
                    <AsyncSelect
                      id="consignee"
                      onChange={(e) => { handleConsigneeSelection(e); }}
                      value={defaultValueConsignee}
                      isClearable={true}
                      placeholder="Search and select..."
                      defaultOptions={consigneeOptions}
                      loadOptions={loadConsigneeSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                </div>
                <div
                  className="col-6 text-start"
                  style={{ marginBlockEnd: "auto" }}
                >
                  <label htmlFor="delivery" className="form-label">
                    Delivery Location:
                  </label>
                  <AsyncSelect
                    id="deliveryLocation"
                    onChange={(e) => { handleDeliveryLocationSelection(e); }}
                    value={deliveryLocationOptions.find(
                      (option) =>
                        option.id === formData.deliveryLocationId &&
                        option.type === formData.deliveryLocationType
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


                <div className="col-6 text-start" style={{ marginBlockEnd: "auto" }}>
                  <div className="text-start">
                    <label
                      htmlFor="language"
                      style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        color: "#565656",
                        marginRight: "10px",
                      }}
                    >
                      Client to Bill:
                    </label>
                    <select
                      name="clientToBill"
                      id="clientToBill"
                      className="form-input"
                      value={formData.client_to_bill_type}
                      onChange={(e) => {
                        handleClientToBillSelection(e);
                      }}
                    >
                      <option value="">Select an option</option>
                      <option value="shipper">Shipper</option>
                      <option value="consignee">Ultimate Consignee</option>
                      <option value="other">Other</option>
                    </select>
                    <p style={{ color: "red" }}>
                      Note: Always select a client to bill when editing
                    </p>
                  </div>
                  <div className="text-start">
                    <AsyncSelect
                      id="releasedToOther"
                      isDisabled={formData.client_to_bill_type !== "other"}
                      onChange={(e) => {
                        handleClientToBillSelection(e);
                      }}
                      value={getAsyncSelectValue()}
                      isClearable={true}
                      defaultOptions={releasedToOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
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
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>Carrier Information</h2>
                <span></span>
              </div>
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
                      setFormData({
                        ...formData,
                        trackingNumber: e.target.value,
                      })
                    }
                    label="Tracking Number"
                  />
                </div>
              </div>
              <div className="row ">
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
          </div>
        </div>

        {/* //-------------------------------------COMMODITES------------------------------------------------------------- */}
        <input type="checkbox" id="toggleBoton"></input>
        <label className="button-charge" htmlFor="toggleBoton">Commodities</label>

        <div className="row w-100" id="miDiv">
          <div className="">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                {editingComodity ? (
                  <h3 style={{ color: "blue", fontWeight: "bold" }}> Edition</h3>
                ) : (
                  <h3>Commodities</h3>

                )}
                <span></span>
              </div>
              <CommodityCreationForm
                onCancel={setshowCommodityCreationForm}
                commodities={commodities}
                setCommodities={setcommodities}
                setShowCommoditiesCreationForm={setshowCommodityCreationForm}
                /* added tres parametros */
                editing={editingComodity}
                commodity={selectedCommodity}
                setEditingComodity={setEditingComodity}
                locationEnabled={true}
              />
              <br />

              {showCommodityCreationForm && (
                <div className="text-center">
                  <Table
                    noScroll
                    data={commodities}
                    columns={[
                      "Description",
                      " Length (in)",
                      " Width (in)",
                      " Height (in)",
                      " Weight (lb)",
                      " Location",
                      " Volume (ft3)",
                      // " Weight (lb)",
                      "Options",
                    ]}
                    onSelect={handleSelectCommodity} // Make sure this line is correct
                    selectedRow={selectedCommodity}
                    onDelete={handleCommodityDelete}
                    onEdit={handleCommodityEdit}
                    onInspect={() => { setshowCommodityInspect(!showCommodityInspect); }}
                    onAdd={() => { }}
                    showOptions={false}
                    //added no double click
                    Nodoubleclick={true}
                  /* deleted variable hiden button trash */
                  />
                  {/* added view commodities */}
                  {showCommodityInspect && (
                    <div className="repacking-container">
                      <div className="main-commodity">
                        <p className="item-description">
                          {selectedCommodity.description}
                        </p>
                        <p className="item-info">
                          Weight: {selectedCommodity.weight}
                        </p>
                        <p className="item-info">
                          Height: {selectedCommodity.height}
                        </p>
                        <p className="item-info">Width: {selectedCommodity.width}</p>
                        <p className="item-info">
                          Length: {selectedCommodity.length}
                        </p>
                        <p className="item-info">
                          Volumetric Weight: {selectedCommodity.volumetricWeight}
                        </p>
                        <p className="item-info">
                          Chargeable Weight: {selectedCommodity.chargedWeight}
                        </p>
                        <p className="item-info">
                          Location: {selectedCommodity.locationCode}
                        </p>
                        {/* <p className="item-info">Repacked?: {selectedCommodity.containsCommodities ? "Yes" : "No"}</p> */}
                      </div>
                      {/*  fix the repacking show internalCommodities for edition */}
                      {selectedCommodity.internalCommodities &&
                        selectedCommodity.internalCommodities.map((com) => (
                          <div
                            key={com.id}
                            className="card"
                            style={{
                              display: "flex",
                              textAlign: "left",
                              fontSize: "15px",
                            }}
                          >
                            <p className="item-description">{com.description}</p>
                            <p className="item-info">Weight: {com.weight}</p>
                            <p className="item-info">Height: {com.height}</p>
                            <p className="item-info">Width: {com.width}</p>
                            <p className="item-info">Length: {com.length}</p>
                            <p className="item-info">
                              Volumetric Weight: {com.volumetricWeight}
                            </p>
                            <p className="item-info">
                              Chargeable Weight: {com.chargedWeight}
                            </p>
                            <p className="item-info">Location: {com.locationCode}</p>
                            {/* <p className="item-info">Repacked?: {com.containsCommodities ? "Yes" : "No"}</p> */}
                          </div>
                        ))}
                    </div>
                  )}
                  <button
                    className="button-save"
                    type="button"
                    onClick={() => {
                      setshowRepackingForm(!showRepackingForm);
                    }}
                  >
                    Repack
                  </button>
                  <br />
                  <br />
                  <br />

                  {showRepackingForm && (
                    <RepackingForm
                      commodities={commodities}
                      setCommodities={setcommodities}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------------------------------------------------- */}


        <input type="checkbox" id="toggleBoton"></input>
        <label className="button-charge" htmlFor="toggleBoton" style={{ display: 'none' }}></label>

        <div className="row w-100" id="miDiv">
          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>Charges Income </h2>
                <span></span>
              </div>
              {true && (
                <IncomeChargeForm
                  onCancel={setshowIncomeForm}
                  charges={charges}
                  setcharges={setcharges}
                  commodities={commodities}
                  agent={agent}
                  consignee={consignee}
                  shipper={shipper}
                />
              )}

              {showIncomeForm && (
                <Table
                  data={charges.filter((c) => c.type === "income")}
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
          </div>

          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>Charges Expense </h2>
                <span></span>
              </div>
              {true && (
                <ExpenseChargeForm
                  onCancel={setshowExpenseForm}
                  charges={charges}
                  setcharges={setcharges}
                  commodities={commodities}
                  agent={agent}
                  consignee={consignee}
                  shipper={shipper}
                />
              )}
              {showExpenseForm && (
                <Table
                  data={charges.filter((c) => c.type === "expense")}
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
          </div>
        </div>

        <div className="company-form__options-container">
          <button
            className="button-save"
            onClick={(e) => {
              e.preventDefault();
              sendData();
            }}
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
            <p className="succes"> Success </p>
            <p className=" created">
              {" "}
              Pick up Order {creating
                ? "created"
                : "updated"} successfully!{" "}
            </p>
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
              Error {creating ? "creating" : "updating"} Pick up Order. Please
              try again
            </strong>
          </Alert>
        )}
      </form>
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