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
import "../../styles/components/ReceipCreationForm.scss";
import RepackingForm from "./RepackingForm";
import PickupService from "../../services/PickupService";

const ReceiptCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
  currentPickUpNumber,
  setcurrentPickUpNumber,
  fromPickUp,
  fromReceipt,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [note, setNote] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formDataUpdated, setFormDataUpdated] = useState(false);
  //added warning alert for commodities
  const [showWarningAlert, setShowWarningAlert] = useState(false);
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
  const [weightUpdated, setWeightUpdated] = useState(0);
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
  const [defaultValueShipper, setdefaultValueShipper] = useState(null);
  const [defaultValueConsignee, setdefaultValueConsignee] = useState(null);
  const today = dayjs().format("YYYY-MM-DD");
  const pickupNumber = currentPickUpNumber + 1;
  const [canRender, setcanRender] = useState(false);

  const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
  const [showCommodityInspect, setshowCommodityInspect] = useState(false);
  const [showRepackingForm, setshowRepackingForm] = useState(false);
  const [selectedCommodity, setselectedCommodity] = useState(null);

  const [selectedIncomeCharge, setSelectedIncomeCarge] = useState(null);
  const [selectedExpenseCharge, setSelectedExpenseCarge] = useState(null);
  const [showIncomeChargeEditForm, setshowIncomeChargeEditForm] =
    useState(false);
  const [showExpenseEditForm, setshowExpenseEditForm] = useState(false);
  // Desabilitar el botón si commodities es null o vacío y cambio de estado
  const [changeStateSave, setchangeStateSave] = useState(false);
  const isButtonDisabled = !commodities || commodities.length === 0;

  useEffect(() => {
    if (!isButtonDisabled) {
      setchangeStateSave(false);
    }
  }, [isButtonDisabled]);

  //added variable editing for commodities
  const [editingComodity, setEditingComodity] = useState(false);
  const formFormat = {
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

    shipperId: "",
    shipperType: "",
    shipperInfo: "",
    pickupLocationId: "",
    pickupLocationType: "",
    pickupLocationInfo: "",

    consigneeId: "",
    consigneeType: "",
    consigneeInfo: "",
    deliveryLocationId: "",
    deliveryLocationType: "",
    deliveryLocationInfo: "",

    proNumber: "",
    trackingNumber: "",
    mainCarrierdId: "",
    mainCarrierInfo: "",
    invoiceNumber: "",
    purchaseOrderNumber: "",

    clientToBillId: "",
    clientToBillType: "",

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
  //added unrepack
  const [repackedItems, setRepackedItems] = useState([]);
  const [selectedRepackId, setSelectedRepackId] = useState(null);

  const handleIssuedBySelection = async (event) => {
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

  const handleSelectIncomeCharge = (commodity) => {
    setSelectedIncomeCarge(commodity);
  };

  const handleSelectExpenseCharge = (commodity) => {
    setSelectedExpenseCarge(commodity);
  };

  const handleIncomeChargeDelete = () => {
    const newCharges = charges.filter(
      (com) => com.id != selectedIncomeCharge.id
    );
    setcharges(newCharges);
  };

  const handleExpenseChargeDelete = () => {
    const newCharges = charges.filter(
      (com) => com.id != selectedExpenseCharge.id
    );
    setcharges(newCharges);
  };

  const handleEmployeeSelection = async (event) => {
    const id = event.id;
    setFormData({
      ...formData,
      employeeId: id,
    });
  };

  const handleSupplierSelection = async (event) => {
    const id = event.id;
    const result = await CarrierService.getCarrierById(id);
    const info = `${result.data?.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setFormData({ ...formData, supplierId: id, supplierInfo: info });
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
    if (type === "Carrier") {
      result = await CarrierService.getCarrierById(id);
    }

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
    const id =
      type === "shipper"
        ? formData.shipperId
        : type === "consignee"
        ? formData.consigneeId
        : "";
    setFormData({
      ...formData,
      clientToBillId: id,
      clientToBillType: type,
    });
  };

  const handleShipperSelection = async (event) => {
    const id = event.id || formData.shipperId;
    const type = event.type || formData.shipperType;

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
    const info = result?.data
      ? `${result.data.street_and_number || ""} - ${result.data.city || ""} - ${
          result.data.state || ""
        } - ${result.data.country || ""} - ${result.data.zip_code || ""}`
      : formData.shipperInfo;
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

    setattachments([...attachments, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
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

  const handleSelectCommodity = (commodity) => {
    setselectedCommodity(commodity);
    console.log("selected commodity ", commodity);
  };

  const handleCommodityDelete = () => {
    if (
      selectedCommodity.internalCommodities &&
      selectedCommodity.internalCommodities.length > 0
    ) {
      // Realizar desempaque (unpack)
      const remainingCommodities = commodities.filter(
        (commodity) => commodity.id !== selectedCommodity.id
      );

      const unpackedCommodities = [...selectedCommodity.internalCommodities];
      // Actualizar el estado con la información más reciente
      setcommodities([...remainingCommodities, ...unpackedCommodities]);
      setSelectedRepackId(null);
    } else {
      // Elimina el commodity si no contiene commodities internos
      const newCommodities = commodities.filter(
        (com) => com.id !== selectedCommodity.id
      );

      setcommodities(newCommodities);
    }
  };

  //added edit commodities
  const handleCommodityEdit = () => {
    console.log("commodities description ", selectedCommodity.description);
    setEditingComodity(true);
    console.log("commodities description ", selectedCommodity);
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
      const isForm = clickedElement.closest(".income-charge-form");

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

  const addNotes = () => {
    const updatedNotes = [...formData.notes, note];

    setFormData({ ...formData, notes: updatedNotes });
  };

  const loadShipperOption = async (id, type) => {
    let option = null;
    if (type === "customer") {
      option = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      option = await VendorService.getVendorByID(id);
    }
    if (type === "forwarding-agent") {
      option = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if (type === "Carrier") {
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
    if (type === "forwarding-agent") {
      option = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if (type === "Carrier") {
      option = await CarrierService.getCarrierById(id);
    }
    setdefaultValueShipper(option.data);
  };

  const SortArray = (x, y) => {
    return new Intl.Collator("es").compare(x.name, y.name);
  };

  useEffect(() => {
    if (!creating && pickupOrder != null) {
      setcommodities(pickupOrder.commodities);
      setcharges(pickupOrder.charges);
      setEvents(pickupOrder.events);
      setattachments(pickupOrder.attachments);

      loadShipperOption(
        pickupOrder.shipperObj?.data?.obj?.id,
        pickupOrder.shipperObj?.data?.obj?.type_person !== "agent"
          ? pickupOrder.shipperObj?.data?.obj?.type_person
          : "forwarding-agent"
      );
      loadConsigneeOption(
        pickupOrder.consigneeObj?.data?.obj?.id,
        pickupOrder.consigneeObj?.data?.obj?.type_person !== "agent"
          ? pickupOrder.consigneeObj?.data?.obj?.type_person
          : "forwarding-agent"
      );
      setshowExpenseForm(true);
      setshowIncomeForm(true);
      setconsignee(pickupOrder.consigneeObj?.data?.obj);
      setconsigneeRequest(pickupOrder.consignee);
      setshipper(pickupOrder.shipperObj?.data?.obj);
      setshipperRequest(pickupOrder.shipper);
      setagent(pickupOrder.destination_agentObj);
      setshowCommodityCreationForm(true);

      let CTBID = "";
      if (fromReceipt) {
        CTBID = pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
          ? pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
          : pickupOrder.clientBillObj?.data?.obj?.id;
      } else {
        CTBID = pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          : pickupOrder.client_to_billObj?.data?.obj?.id;
      }
      let updatedFormData = {
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

        shipper: pickupOrder.shipper,
        shipperId: pickupOrder.shipperObj.data?.obj?.id, //pickupOrder.shipper
        shipperType: pickupOrder.shipperObj.data?.obj?.type_person,
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

        consignee: pickupOrder.consignee,
        consigneeId: pickupOrder.consigneeObj.data?.obj?.id, //pickupOrder.consignee
        consigneeType: pickupOrder.consigneeObj.data?.obj?.type_person,
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

        supplierId: pickupOrder.supplier,
        supplierInfo: `${pickupOrder.supplierObj?.street_and_number || ""} - ${
          pickupOrder.supplierObj?.city || ""
        } - ${pickupOrder.supplierObj?.state || ""} - ${
          pickupOrder.supplierObj?.country || ""
        } - ${pickupOrder.supplierObj?.zip_code || ""}`,
        invoiceNumber: pickupOrder.invoice_number,
        purchaseOrderNumber: pickupOrder.purchase_order_number,

        clientToBillId: CTBID,
        clientToBillType:
          CTBID === pickupOrder.shipperObj.data?.obj?.id
            ? "shipper"
            : CTBID === pickupOrder.consigneeObj.data?.obj?.id
            ? "consignee"
            : "",

        commodities: pickupOrder.commodities,
        charges: pickupOrder.charges,
        notes: pickupOrder.notes,
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

    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));

    const forwardingAgentsWithType = addTypeToObjects(
      forwardingAgents,
      "forwarding-agent"
    );
    const customersWithType = addTypeToObjects(customers, "customer");
    const vendorsWithType = addTypeToObjects(vendors, "vendor");
    const employeesWithType = addTypeToObjects(employees, "employee");
    const carriersWithType = addTypeToObjects(carriers, "Carrier");

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

    setIssuedByOptions(issuedByOptions.sort(SortArray));
    setDestinationAgentOptions(destinationAgentOptions.sort(SortArray));
    setEmployeeOptions(employeeOptions.sort(SortArray));
    setShipperOptions(shipperOptions.sort(SortArray));
    setConsigneeOptions(consigneeOptions.sort(SortArray));
    setCarrierOptions(carrierOptions.sort(SortArray));
    setSupplierOptions(carrierOptions.sort(SortArray));
  };

  const addTypeToObjects = (arr, type) => arr.map((obj) => ({ ...obj, type }));

  const loadIssuedBySelectOptions = async (inputValue) => {
    const responseCustomers = (await CustomerService.search(inputValue)).data
      .results;
    const responseVendors = (await VendorService.search(inputValue)).data
      .results;
    const responseAgents = (await ForwardingAgentService.search(inputValue))
      .data.results;

    const options = [
      ...addTypeToObjects(responseVendors, "vendor"),
      ...addTypeToObjects(responseCustomers, "customer"),
      ...addTypeToObjects(responseAgents, "forwarding-agent"),
    ];

    return options;
  };

  const loadDestinationAgentsSelectOptions = async (inputValue) => {
    const responseAgents = (await ForwardingAgentService.search(inputValue))
      .data.results;

    const options = [...addTypeToObjects(responseAgents, "forwarding-agent")];

    return options;
  };

  const loadShipperSelectOptions = async (inputValue) => {
    const responseCustomers = (await CustomerService.search(inputValue)).data
      .results;
    const responseVendors = (await VendorService.search(inputValue)).data
      .results;
    const responseAgents = (await ForwardingAgentService.search(inputValue))
      .data.results;

    const options = [
      ...addTypeToObjects(responseVendors, "vendor"),
      ...addTypeToObjects(responseCustomers, "customer"),
      ...addTypeToObjects(responseAgents, "forwarding-agent"),
    ];

    return options;
  };

  const loadConsigneeSelectOptions = async (inputValue) => {
    const responseCustomers = (await CustomerService.search(inputValue)).data
      .results;
    const responseVendors = (await VendorService.search(inputValue)).data
      .results;
    const responseAgents = (await ForwardingAgentService.search(inputValue))
      .data.results;
    const responseCarriers = (await CarrierService.search(inputValue)).data
      .results;

    const options = [
      ...addTypeToObjects(responseVendors, "vendor"),
      ...addTypeToObjects(responseCustomers, "customer"),
      ...addTypeToObjects(responseAgents, "forwarding-agent"),
      ...addTypeToObjects(responseCarriers, "Carrier"),
    ];

    return options;
  };

  const loadEmployeeSelectOptions = async (inputValue) => {
    const response = await EmployeeService.search(inputValue);
    const data = response.data.results;

    const options = addTypeToObjects(data, "employee");

    return options;
  };

  const loadCarrierSelectOptions = async (inputValue) => {
    const responseCarriers = (await CarrierService.search(inputValue)).data
      .results;

    const options = [...addTypeToObjects(responseCarriers, "Carrier")];

    return options;
  };

  useEffect(() => {
    if (!fromPickUp) {
      fetchFormData();
    }
  }, []);

  useEffect(() => {
    if (creating) {
      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  useEffect(() => {
    if (fromPickUp) {
      setshowCommodityCreationForm(true);
      setEmployeeOptions([pickupOrder.employeeObj]);
      setIssuedByOptions([pickupOrder.issued_byObj]);
      setDestinationAgentOptions([pickupOrder.destination_agentObj]);
      setShipperOptions([pickupOrder.shipperObj?.data?.obj]);
      setConsigneeOptions([pickupOrder.consigneeObj?.data?.obj]);
      setCarrierOptions([pickupOrder.main_carrierObj]);
      setSupplierOptions([pickupOrder.supplierObj]);
      setcommodities(pickupOrder.commodities);

      let CTBID = "";
      if (fromReceipt) {
        CTBID = pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
          ? pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
          : pickupOrder.clientBillObj?.data?.obj?.id;
      } else {
        CTBID = pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
          : pickupOrder.client_to_billObj?.data?.obj?.id;
      }
      let updatedFormData = {
        status: 4,
        weight: pickupOrder.weight,
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

        shipperId: pickupOrder.shipperObj.data?.obj?.id,
        shipperType: pickupOrder.shipperObj.data?.obj?.type_person,
        shipper: pickupOrder.shipper,
        shipperObjId: pickupOrder.shipperObj.data?.obj?.id,
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

        consigneeId: pickupOrder.consigneeObj.data?.obj?.id,
        consignee: pickupOrder.consignee,
        consigneeType: pickupOrder.consigneeObj.data?.obj?.type_person,
        consigneeObjId: pickupOrder.consigneeObj.data?.obj?.id,
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

        supplierId: pickupOrder.supplier,
        supplierInfo: `${pickupOrder.supplierObj?.street_and_number || ""} - ${
          pickupOrder.supplierObj?.city || ""
        } - ${pickupOrder.supplierObj?.state || ""} - ${
          pickupOrder.supplierObj?.country || ""
        } - ${pickupOrder.supplierObj?.zip_code || ""}`,

        invoiceNumber: pickupOrder.invoice_number,
        purchaseOrderNumber: pickupOrder.purchase_order_number,

        clientToBillId: CTBID,
        clientToBillType:
          CTBID === pickupOrder.consigneeObj.data?.obj?.id
            ? "consignee"
            : CTBID === pickupOrder.shipperObj.data?.obj?.id
            ? "shipper"
            : "",

        commodities: pickupOrder.commodities,
        notes: [],
      };
      setFormData(updatedFormData);
      setFormDataUpdated(true);
      setconsigneeRequest(pickupOrder.consignee);
      setshipperRequest(pickupOrder.shipper);
    }
  }, [fromPickUp, pickupOrder]);

  useEffect(() => {
    if (formDataUpdated) {
      handleConsigneeSelection({
        id: pickupOrder.consigneeObj?.data?.obj?.id,
        type: pickupOrder.consigneeObj?.data?.obj?.type_person,
      });
      handleShipperSelection({
        id: pickupOrder.shipperObj?.data?.obj?.id,
        type: pickupOrder.shipperObj?.data?.obj?.type_person,
      });
      handleDestinationAgentSelection({
        id: pickupOrder.destination_agentObj?.id,
      });
    }
  }, [formDataUpdated, pickupOrder]);

  const sendData = async () => {
    // Mostrar la alerta si commodities es null o vacío
    if (isButtonDisabled) {
      setchangeStateSave(true);
      //added change estate for warning alert
      setShowWarningAlert(true);
      return;
    }

    if (commodities.length > 0) {
      let totalWeight = 0;
      commodities.forEach((com) => {
        totalWeight += parseFloat(com.weight);
      });

      setWeightUpdated(totalWeight);
    }
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

      const response = await ReceiptService.createConsignee(consignee);
      if (response.status === 201) {
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
    if (formData.shipperType === "Carrier") {
      shipperName = "carrierid";
    }
    if (shipperName !== "") {
      const consignee = {
        [shipperName]: formData.shipperId,
      };

      const response = await ReceiptService.createShipper(consignee);
      if (response.status === 201) {
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
        [clientToBillName]:
          clientToBillName === "shipperid"
            ? formData.shipper
            : formData.consignee,
      };

      const response = await ReceiptService.createClientToBill(clientToBill);
      if (response.status === 201) {
        setclientToBillRequest(response.data.id);
      }
    }

    if (commodities.length > 0) {
      let weight = 0;
      commodities.forEach((com) => {
        weight += com.weight;
      });
      setFormData({ ...formData, weight: weight });
    }
  };

  const checkUpdatesComplete = () => {
    if (
      shipperRequest !== null &&
      consigneeRequest !== null &&
      clientToBillRequest !== null &&
      weightUpdated
    ) {
      setAllStateUpdatesComplete(true);
    }

    if (fromPickUp && clientToBillRequest !== null) {
      setAllStateUpdatesComplete(true);
    }
  };

  useEffect(() => {
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      const createPickUp = async () => {
        let rawData = {
          status: 2,
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

  /* useEffect(() => {
    console.log(formData)
  }, [formData]) */

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

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <div>
      <div>
        <div className="company-form receipt">
          <div className="row w-100">
            <div className="col-6">
              <div className="creation creation-container w-100">
                <div className="form-label_name">
                  <h3>General</h3>
                  <span></span>
                </div>
                <div className="row mb-3">
                  <div className="col-4 text-start">
                    <Input
                      type="number"
                      inputName="number"
                      placeholder="Number..."
                      value={formData.number}
                      readonly={true}
                      label="Number"
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
                      placeholder="Search and select..."
                    />
                  </div>

                  <div className="col-4 text-start">
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
                          value={destinationAgentOptions.find(
                            (option) =>
                              option.id === formData.destinationAgentId
                          )}
                          isClearable={true}
                          defaultOptions={destinationAgentOptions}
                          loadOptions={loadDestinationAgentsSelectOptions}
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
                        value={destinationAgentOptions.find(
                          (option) => option.id === formData.destinationAgentId
                        )}
                        isClearable={true}
                        defaultOptions={destinationAgentOptions}
                        loadOptions={loadDestinationAgentsSelectOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        placeholder="Search and select..."
                      />
                    )}
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-4 text-start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <p className="text-date">Entry Date and Time</p>
                      <DateTimePicker
                        // label="Entry Date and Time"
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
                  <div className="col-4 text-start">
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
            </div>

            <div className="col-6">
              <div className="creation creation-container w-100">
                <div className="form-label_name">
                  <h3>Shipper/Consignee</h3>
                  <span></span>
                </div>
                <div className="row mb-3">
                  <div className="col-6 text-start">
                    <label htmlFor="shipper" className="form-label">
                      Shipper:
                    </label>
                    <AsyncSelect
                      id="shipper"
                      onChange={(e) => {
                        handleShipperSelection(e);
                      }}
                      isClearable={true}
                      placeholder="Search and select..."
                      defaultOptions={shipperOptions}
                      loadOptions={loadShipperSelectOptions}
                      value={shipperOptions.find(
                        (option) =>
                          option.id === formData.shipperId &&
                          option.type_person === formData.shipperType
                      )}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div className="col-6 text-start">
                    <label htmlFor="consignee" className="form-label">
                      Consignee:
                    </label>
                    <div className="custom-select">
                      <AsyncSelect
                        id="consignee"
                        value={consigneeOptions.find(
                          (option) =>
                            option.id === formData.consigneeId &&
                            option.type_person === formData.consigneeType
                        )}
                        onChange={(e) => handleConsigneeSelection(e)}
                        isClearable={true}
                        placeholder="Search and select..."
                        defaultOptions={consigneeOptions}
                        loadOptions={loadConsigneeSelectOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                      />
                    </div>
                  </div>
                </div>

                <div className="row align-items-center mb-3">
                  <div className="col-6 text-start">
                    <Input
                      type="textarea"
                      inputName="shipperinfo"
                      placeholder="Shipper Location..."
                      value={formData.shipperInfo}
                      readonly={true}
                    />
                  </div>

                  <div className="col-6 text-start">
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

                <div className="row">
                  <div className="col-6 text-start">
                    <label htmlFor="clientToBill" className="form-label">
                      Client to Bill:
                    </label>
                    <select
                      value={formData.clientToBillType}
                      name="clientToBill"
                      id="clientToBill"
                      onChange={(e) => handleClientToBillSelection(e)}
                    >
                      <option value="">Select an option</option>
                      <option value="consignee">Consignee</option>
                      <option value="shipper">Shipper</option>
                    </select>
                    {/* <p style={{ color: "red" }}>
                        Note: Always select a client to bill when editing
                      </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row w-100">
            <div className="col-6">
              <div className="creation creation-container w-100">
                <div className="form-label_name">
                  <h3>Supplier</h3>
                  <span></span>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-6 text-start">
                    <label htmlFor="shipper" className="form-label">
                      Name:
                    </label>
                    <AsyncSelect
                      id="shipper"
                      value={supplierOptions.find(
                        (option) => option.id === formData.supplierId
                      )}
                      onChange={(e) => {
                        handleSupplierSelection(e);
                      }}
                      isClearable={true}
                      placeholder="Search and select..."
                      defaultOptions={supplierOptions}
                      loadOptions={loadCarrierSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  </div>

                  <div className="col-6 text-start">
                    <Input
                      type="text"
                      inputName="invoiceNumber"
                      placeholder="Invoice Number..."
                      value={formData.invoiceNumber}
                      changeHandler={(e) =>
                        setFormData({
                          ...formData,
                          invoiceNumber: e.target.value,
                        })
                      }
                      label="Invoice Number"
                    />
                  </div>
                </div>

                <div className="row alig-items-center">
                  <div className="col-6 text-start">
                    <Input
                      type="textarea"
                      inputName="shipperinfo"
                      placeholder="Shipper Location..."
                      value={formData.supplierInfo}
                      readonly={true}
                    />
                  </div>

                  <div
                    className="col-6 text-start"
                    style={{ marginTop: "-5px" }}
                  >
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
              </div>
            </div>

            <div className="col-6">
              <div className="creation creation-container w-100">
                <div className="form-label_name">
                  <h3>Carrier Information</h3>
                  <span></span>
                </div>
                <div className="row">
                  <div className="col-4 text-start">
                    <label htmlFor="mainCarrier" className="form-label">
                      Carrier:
                    </label>
                    <AsyncSelect
                      id="mainCarrier"
                      value={carrierOptions.find(
                        (option) => option.id === formData.mainCarrierdId
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
                  <div className="col-4 text-start">
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
                  <div className="col-4 text-start">
                    <Input
                      type="text"
                      inputName="trackingNumber"
                      placeholder="Tracking Number..."
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
              </div>
            </div>
          </div>

          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h3>General</h3>
              <span></span>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-start">
                <Input
                  type="number"
                  inputName="number"
                  placeholder="Number..."
                  value={formData.number}
                  readonly={true}
                  label="Number"
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
                  placeholder="Search and select..."
                />
              </div>

              <div className="col-4 text-start">
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
                      value={destinationAgentOptions.find(
                        (option) => option.id === formData.destinationAgentId
                      )}
                      isClearable={true}
                      defaultOptions={destinationAgentOptions}
                      loadOptions={loadDestinationAgentsSelectOptions}
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
                    value={destinationAgentOptions.find(
                      (option) => option.id === formData.destinationAgentId
                    )}
                    isClearable={true}
                    defaultOptions={destinationAgentOptions}
                    loadOptions={loadDestinationAgentsSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    placeholder="Search and select..."
                  />
                )}
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-4 text-start">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <p className="text-date">Entry Date and Time</p>
                  <DateTimePicker
                    // label="Entry Date and Time"
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
              <div className="col-4 text-start">
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
        </div>

        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h3>Shipper/Consignee</h3>
              <span></span>
            </div>
            <div className="row mb-3">
              <div className="col-6 text-start">
                <label htmlFor="shipper" className="form-label">
                  Shipper:
                </label>
                <AsyncSelect
                  id="shipper"
                  onChange={(e) => {
                    handleShipperSelection(e);
                  }}
                  isClearable={true}
                  placeholder="Search and select..."
                  defaultOptions={shipperOptions}
                  loadOptions={loadShipperSelectOptions}
                  value={shipperOptions.find(
                    (option) =>
                      option.id === formData.shipperId &&
                      option.type_person === formData.shipperType
                  )}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>
              <div className="col-6 text-start">
                <label htmlFor="consignee" className="form-label">
                  Consignee:
                </label>
                <div className="custom-select">
                  <AsyncSelect
                    id="consignee"
                    value={consigneeOptions.find(
                      (option) =>
                        option.id === formData.consigneeId &&
                        option.type_person === formData.consigneeType
                    )}
                    onChange={(e) => handleConsigneeSelection(e)}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={consigneeOptions}
                    loadOptions={loadConsigneeSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>
              </div>
            </div>

            <div className="row align-items-center mb-3">
              <div className="col-6 text-start">
                <Input
                  type="textarea"
                  inputName="shipperinfo"
                  placeholder="Shipper Location..."
                  value={formData.shipperInfo}
                  readonly={true}
                />
              </div>

              <div className="col-6 text-start">
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

            <div className="row">
              <div className="col-6 text-start">
                <label htmlFor="clientToBill" className="form-label">
                  Client to Bill:
                </label>
                <select
                  value={formData.clientToBillType}
                  name="clientToBill"
                  id="clientToBill"
                  onChange={(e) => handleClientToBillSelection(e)}
                >
                  <option value="">Select an option</option>
                  <option value="consignee">Consignee</option>
                  <option value="shipper">Shipper</option>
                </select>
                {/* <p style={{ color: "red" }}>
                        Note: Always select a client to bill when editing
                      </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row w-100">
        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h3>Supplier</h3>
              <span></span>
            </div>
            <div className="row align-items-center mb-3">
              <div className="col-6 text-start">
                <label htmlFor="shipper" className="form-label">
                  Name:
                </label>
                <AsyncSelect
                  id="shipper"
                  value={supplierOptions.find(
                    (option) => option.id === formData.supplierId
                  )}
                  onChange={(e) => {
                    handleSupplierSelection(e);
                  }}
                  isClearable={true}
                  placeholder="Search and select..."
                  defaultOptions={supplierOptions}
                  loadOptions={loadCarrierSelectOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div>

              <div className="col-6 text-start">
                <Input
                  type="text"
                  inputName="invoiceNumber"
                  placeholder="Invoice Number..."
                  value={formData.invoiceNumber}
                  changeHandler={(e) =>
                    setFormData({
                      ...formData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  label="Invoice Number"
                />
              </div>
            </div>

            <div className="row alig-items-center">
              <div className="col-6 text-start">
                <Input
                  type="textarea"
                  inputName="shipperinfo"
                  placeholder="Shipper Location..."
                  value={formData.supplierInfo}
                  readonly={true}
                />
              </div>

              <div className="col-6 text-start" style={{ marginTop: "-5px" }}>
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
          </div>
        </div>

        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h3>Carrier Information</h3>
              <span></span>
            </div>
            <div className="row">
              <div className="col-4 text-start">
                <label htmlFor="mainCarrier" className="form-label">
                  Carrier:
                </label>
                <AsyncSelect
                  id="mainCarrier"
                  value={carrierOptions.find(
                    (option) => option.id === formData.mainCarrierdId
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
              <div className="col-4 text-start">
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
              <div className="col-4 text-start">
                <Input
                  type="text"
                  inputName="trackingNumber"
                  placeholder="Tracking Number..."
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
          </div>
        </div>
      </div>

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
        />
        <br />

        {showCommodityCreationForm && (
          <div className="text-center">
            <Table
              data={commodities}
              columns={[
                "Description",
                " Length",
                " Height",
                " Width",
                " Weight",
                // "Location",
                " Volumetric Weight",
                " Chargeable Weight",
                "Options",
              ]}
              onSelect={handleSelectCommodity} // Make sure this line is correct
              selectedRow={selectedCommodity}
              onDelete={handleCommodityDelete}
              onEdit={handleCommodityEdit}
              onInspect={() => {
                setshowCommodityInspect(!showCommodityInspect);
              }}
              onAdd={() => {}}
              showOptions={false}
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
                  {/* <p className="item-info">Repacked?: {selectedCommodity.containsCommodities ? "Yes" : "No"}</p> */}
                </div>
                {/*  fix the repacking show internalCommodities for edition */}
                {selectedCommodity.internalCommodities &&
                  selectedCommodity.internalCommodities.map((com) => (
                    <div key={com.id} className="card">
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

      {/* button duplicado */}
      {/* <button
                  type="button"
                  onClick={() => {
                    setshowRepackingForm(!showRepackingForm);
                  }}
                  className="button-save"
                >
                  Repacking
                </button> */}

      <input type="checkbox" id="toggleBoton"></input>
      <label className="button-charge" for="toggleBoton"></label>

      <div className="row w-100" id="miDiv">
        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h3>Charges</h3>
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
            )}
            {showIncomeChargeEditForm && (
              <IncomeChargeForm
                onCancel={setshowIncomeChargeEditForm}
                charges={charges}
                setcharges={setcharges}
                commodities={commodities}
                agent={agent}
                consignee={consignee}
                shipper={shipper}
                editing={true}
                charge={selectedIncomeCharge}
              />
            )}
          </div>
        </div>

        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h3>Charges</h3>
              <span></span>
            </div>
            {true && (
              <ExpenseChargeForm
                onCancel={setshowIncomeForm}
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
            )}
            {showExpenseEditForm && (
              <ExpenseChargeForm
                onCancel={setshowIncomeChargeEditForm}
                charges={charges}
                setcharges={setcharges}
                commodities={commodities}
                agent={agent}
                consignee={consignee}
                shipper={shipper}
                editing={true}
                charge={selectedIncomeCharge}
              />
            )}
          </div>
        </div>
      </div>

      <div className="creation creation-container w-100">
        <div className="form-label_name">
          <h3>Events</h3>
          <span></span>
        </div>
        <div className="row">
          <div className="col-12 text-start">
            <div className="container-box event-section">
              <div className="box__event--form">
                <EventCreationForm
                  onCancel={setshowEventForm}
                  events={events}
                  setevents={setEvents}
                />
              </div>
              {events && events.length > 0 && (
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
                  onSelect={() => {}}
                  selectedRow={{}}
                  onDelete={() => {}}
                  onEdit={() => {}}
                  onAdd={() => {}}
                  showOptions={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="creation creation-container w-100">
        <div className="form-label_name">
          <h3>Attachments</h3>
          <span></span>
        </div>
        <div className="row">
          <div className="col-12">
            <input type="file" multiple onChange={handleFileUpload} />
            <ul>
              {attachments.map((attachment) => (
                <li key={attachment.name}>{attachment.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="creation creation-container w-100">
        <div className="form-label_name">
          <h3>Notes</h3>
          <span></span>
        </div>

        <div className="row align-items-center">
          <div className="col-10 text-start">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <input
              name="notes"
              type="text"
              className="form-input"
              placeholder="Notes..."
              onChange={(e) => setNote(e.target.value)}
              style={{ width: "99%" }}
            />
          </div>

          <div className="col">
            <button
              type="button"
              onClick={addNotes}
              style={{
                backgroundColor: "#153A61",
                color: "white",
                fontSize: "16px",
                width: "90%",
              }}
            >
              Add
            </button>
          </div>
          <div className="row">
            <div className="col-10 text-start">
              <textarea
                name="notes"
                className="form-input w-100"
                placeholder=""
                value={formData.notes?.toString()}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  height: "100px",
                  wordWrap: "break-word",
                }}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="company-form__options-container">
        <button
          disabled={changeStateSave}
          className="button-save"
          onClick={sendData}
        >
          Save
        </button>

        <button className="button-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {/* {showSuccessAlert && (
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
      )} */}
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <p className="succes"> Success </p>
          <p className=" created">
            {" "}
            Warehouse Receipt {creating
              ? "created"
              : "updated"} successfully!{" "}
          </p>
        </Alert>
      )}

      {/* added change estate for warning alert */}
      {showWarningAlert && (
        <Alert
          severity="warning"
          onClose={() => setShowWarningAlert(false)}
          className="alert-notification-warning"
        >
          <p className="succes">
            {" "}
            Please fill in data in the commodities section, do not leave empty
            spaces.
          </p>
          <p className="succes"> Don't leave empty fields.</p>
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
