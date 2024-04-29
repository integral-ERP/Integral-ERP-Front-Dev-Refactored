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
import { fetchFormData } from "./DataFetcher";
const ReceiptCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
  currentPickUpNumber,
  setcurrentPickUpNumber,
  fromPickUp,
  fromReceipt,
  showBModal,
}) => {
  console.log("pickupOrder", pickupOrder);
  console.log('creating', creating);
  const [activeTab, setActiveTab] = useState("general");
  // const [note, setNote] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formDataUpdated, setFormDataUpdated] = useState(false);
  console.log("formdataupdated", formDataUpdated);
  //added warning alert for commodities
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [allStateUpdatesComplete, setAllStateUpdatesComplete] = useState(false);
  const [showIncomeForm, setshowIncomeForm] = useState(false);
  const [showExpenseForm, setshowExpenseForm] = useState(false);
  const [showEventForm, setshowEventForm] = useState(false);
  const [consignee, setconsignee] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [defaultValueSupplier, setDefaultValueSupplier] = useState(null);
  const [agent, setagent] = useState(null);
  const [shipper, setshipper] = useState(null);
  const [consigneeRequest, setconsigneeRequest] = useState(null);
  const [shipperRequest, setshipperRequest] = useState(null);
  const [supplierRequest, setsupplierRequest] = useState(null);
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
  const [supplierInfo, setsupplierInfo] = useState("");

  const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
  const [showCommodityInspect, setshowCommodityInspect] = useState(false);
  const [showRepackingForm, setshowRepackingForm] = useState(false);
  const [selectedCommodity, setselectedCommodity] = useState(null);
  //-------------------------------------------------------
  const [SelectEvent, setSelectEvent] = useState(null);

  const [selectedIncomeCharge, setSelectedIncomeCarge] = useState(null);
  const [selectedExpenseCharge, setSelectedExpenseCarge] = useState(null);
  const [showIncomeChargeEditForm, setshowIncomeChargeEditForm] =
    useState(false);
  const [showExpenseEditForm, setshowExpenseEditForm] = useState(false);
  // Desabilitar el botón si commodities es null o vacío y cambio de estado
  const [changeStateSave, setchangeStateSave] = useState(false);
  const isButtonDisabled = !commodities || commodities.length === 0;

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
        setShipperOptions([ ...customers, ...vendors])
        setSupplierOptions([...forwardingAgents, ...customers, ...vendors])
        setConsigneeOptions([...forwardingAgents, ...customers, ...vendors, ...carriers])
        setCarrierOptions([...carriers])
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

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

    supplierId: "",
    supplierType: "",
    supplierInfo: "",

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
    notes: "",
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

  //------------------------------------------------
  const handleSelectEvent = (events) => {
    setSelectEvent(events);
    console.log("selected events ", events);
  };

  const handleDeleteEvent = () => {
    if (SelectEvent) {
    }
  };

  //------------------------------------------------

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

  const handleConsigneeSelection = (event) => {
    const id = event?.id || "";
    const type = event?.type || "";
    const validTypes = ["forwarding-agent", "customer", "vendor", "Carrier"];
    if (!validTypes.includes(type)) {
      console.error(`Unsupported consignee type: ${type}`);
      return;
    }
    const selectedConsignee = consigneeOptions.find(
      (option) => option.id === id && option.type === type
    );
    if (!selectedConsignee) {
      console.error(`Consignee not found with ID ${id} and type ${type}`);
      return;
    }

    const info = `${selectedConsignee.street_and_number || ""} - ${
      selectedConsignee.city || ""
    } - ${selectedConsignee.state || ""} - ${
      selectedConsignee.country || ""
    } - ${selectedConsignee.zip_code || ""}`;
    setconsignee(selectedConsignee);
    setdefaultValueConsignee(selectedConsignee);
    setFormData({
      ...formData,
      consigneeId: id,
      consigneeType: type,
      consigneeInfo: info,
    });
  };

 /*  const handleSupplierSelection = async (event) => {
    const id = event.id || formData.supplierId;
    // const type = event.type || formData.supplierType;
    const type = event?.type || "";
    const selectedSupplier = supplierOptions.find(
      (option) => option.id === id && option.type === type
    );

    if (supplierOptions) {
      console.log("supplierOptions =", supplierOptions);
      // Si se selecciona una opción, actualiza el estado con el nuevo ID de proveedor
      setFormData(prevFormData => ({
        ...prevFormData,
        supplierId: supplierOptions.id
      }));
    }

    if (!selectedSupplier) {
      console.error(`Unsupported consignee type: ${type}`);
      return;
    }

    const info = `${selectedSupplier?.street_and_number || ""} - ${
      selectedSupplier?.city || ""
    } - ${selectedSupplier?.state || ""} - ${
      selectedSupplier?.country || ""
    } - ${selectedSupplier?.zip_code || ""}`;

    setSupplier(selectedSupplier);

    setFormData({
      ...formData,
      supplierId: id,
      supplierType: type,
      supplierInfo: info,
    });
  }; */
 /*  const handleSupplierSelection = async (event) => {
    const id = event.id || "";
    // const type = event.type || formData.supplierType;
    const type = event?.type || "";
    const selectedSupplier = supplierOptions.find(
      (option) => option.id === id && option.type === type
    );
    

    
    if (supplierOptions) {
      console.log("supplierOptions =", supplierOptions);
      console.log("selectedSupplier =", selectedSupplier);
      const info = `${selectedSupplier?.street_and_number || ""} - ${
        selectedSupplier?.city || "" 
      } - ${selectedSupplier?.state || ""} - ${
        selectedSupplier?.country || ""
      } - ${selectedSupplier?.zip_code || ""}`;
      // Si se selecciona una opción, actualiza el estado con el nuevo ID de proveedor
      setFormData(prevFormData => ({
        ...prevFormData,
        supplierId: selectedSupplier.id,
        supplierType: selectedSupplier.type,
        supplierInfo: info,
      }));
    }

    if (!selectedSupplier) {
      console.error(`Unsupported consignee type: ${type}`);
      return;
    }

    const info = `${selectedSupplier?.street_and_number || ""} - ${
      selectedSupplier?.city || ""
    } - ${selectedSupplier?.state || ""} - ${
      selectedSupplier?.country || ""
    } - ${selectedSupplier?.zip_code || ""}`;

    setSupplier(selectedSupplier);

    setFormData({
      ...formData,
      supplierId: id,
      supplierType: type,
      supplierInfo: info,
    });
  }; */
  const handleSupplierSelection = async (event) => {
    if (event && event.id) {
      const id = event.id || formData.supplierId;
      const type = event.type || formData.supplierType;

      let result;
      if (type === "forwarding-agent") {
        result = await ForwardingAgentService.getForwardingAgentById(id);
      } else if (type === "customer") {
        result = await CustomerService.getCustomerById(id);
      } else if (type === "vendor") {
        result = await VendorService.getVendorByID(id);
      }

      const info = result?.data
        ? `${result.data.street_and_number || ""} - ${
            result.data.city || ""
          } - ${result.data.state || ""} - ${result.data.country || ""} - ${
            result.data.zip_code || ""
          }`
        : formData.supplierInfo;
      setSupplier(result?.data || supplier);
      setFormData({
        ...formData,
        supplierId: id,
        supplierType: type,
        supplierInfo: info,
      });
    } else {
      console.error(
        "El objeto de selección de supplier es nulo o no tiene una propiedad 'id'"
      );
    }
  };

  const handleShipperSelection = async (event) => {
    if (event && event.id) {
      const id = event.id || formData.shipperId;
      const type = event.type || formData.shipperType;

      let result;
      if (type === "forwarding-agent") {
        result = await ForwardingAgentService.getForwardingAgentById(id);
      } else if (type === "customer") {
        result = await CustomerService.getCustomerById(id);
      } else if (type === "vendor") {
        result = await VendorService.getVendorByID(id);
      }

      const info = result?.data
        ? `${result.data.street_and_number || ""} - ${
            result.data.city || ""
          } - ${result.data.state || ""} - ${result.data.country || ""} - ${
            result.data.zip_code || ""
          }`
        : formData.shipperInfo;
      setshipper(result?.data || shipper);
      setFormData({
        ...formData,
        shipperId: id,
        shipperType: type,
        shipperInfo: info,
      });
    } else {
      console.error(
        "El objeto de selección de shipper es nulo o no tiene una propiedad 'id'"
      );
    }
  };

  const handleClearShipperSelection = () => {
    setFormData({
      ...formData,
      shipperId: null,
      shipperType: null,
      shipperInfo: "",
    });
  };
  //---------------------------------CHARGE IMG---------------------------------------------------------
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState("");

  const handleShowLargeImage = (src) => {
    setLargeImageSrc(src);
    setShowLargeImage(true);
  };

  const handleCloseLargeImage = () => {
    setShowLargeImage(false);
  };

  const handleDownloadAttachment = (base64Data, fileName) => {
    // Convertir la base64 a un Blob
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "image/jpeg" });

    // Crear un enlace temporal y descargar el Blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newAttachments = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = () => {
          newAttachments.push({
            name: file.name,
            base64: reader.result,
          });

          if (newAttachments.length === files.length) {
            setattachments((prevAttachments) => [
              ...prevAttachments,
              ...newAttachments,
            ]);
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };
  //------------------------------------------------------------------------------------------

  const handleDeleteAttachment = (name) => {
    const updateAttachments = attachments.filter(
      (attachment) => attachment.name !== name
    );
    setattachments(updateAttachments);
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

  const handleCommodityDelete = async () => {
    if (!selectedCommodity) {
      alert("Please select a commodity before deleting it.");
      return;
    }
    //added alert message if editing
    if (editingComodity) {
      alert("Please finish editing the commodity before deleting it.");
      return;
    }
    try {
      // Mostrar un cuadro de diálogo de confirmación
      const confirmDelete = window.confirm(
        `Are you sure you want to delete this commodity "${selectedCommodity.description}" or do "${selectedCommodity.description}" unpacking?`
      );
      // Si el usuario hace clic en "Aceptar" en el cuadro de diálogo
      if (confirmDelete) {
        if (
          selectedCommodity.internalCommodities &&
          selectedCommodity.internalCommodities.length > 0
        ) {
          // Realizar desempaque (unpack)
          const remainingCommodities = commodities.filter(
            (commodity) => commodity.id !== selectedCommodity.id
          );

          const unpackedCommodities = [
            ...selectedCommodity.internalCommodities,
          ];
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

        // Esperar selectedCommodity como null
        setTimeout(() => {
          setselectedCommodity(null);
        }, 100);
      } else {
        return;
      }
    } catch (error) {
      console.error("Error when deleting the commodity:", error);
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

  // const addNotes = () => {
  //   const updatedNotes = [...formData.notes, note];

  //   setFormData({ ...formData, notes: updatedNotes });
  // };

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
    setdefaultValueShipper(option.data);
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
    setdefaultValueConsignee(option.data);
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
      setsupplierRequest(pickupOrder.supplier);
      setagent(pickupOrder.destination_agentObj);
      setshowCommodityCreationForm(true);

      const initialSupplier = pickupOrder.shipperObj?.data?.obj
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

        /* supplier: initialSupplier,
        supplierId: initialSupplier?.id,
        supplierType: initialSupplier?.type_person,

        supplierInfo: `${initialSupplier?.street_and_number || ""} - ${
          initialSupplier?.city || ""
        } - ${initialSupplier?.state || ""} - ${
          initialSupplier?.country || ""
        } - ${initialSupplier?.zip_code || ""}`, */
        supplier: pickupOrder.supplier,
        supplierId: pickupOrder.supplierObj.data?.obj?.id,
        supplierType: pickupOrder.supplierObj.data?.obj?.type_person,
        supplierInfo: `${
          pickupOrder.supplierObj?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.supplierObj?.data?.obj?.city || ""} - ${
          pickupOrder.supplierObj?.data?.obj?.state || ""
        } - ${pickupOrder.supplierObj?.data?.obj?.country || ""} - ${
          pickupOrder.supplierObj?.data?.obj?.zip_code || ""
        }`,

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

      console.log("updatedFormData", updatedFormData);

      setFormData(updatedFormData);
      setcanRender(true);
    }
  }, [creating, pickupOrder]);

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
      const initialSupplier = pickupOrder.shipperObj?.data?.obj
      let updatedFormData = {
        status: 4,
        // notes :pickupOrder.notes,
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

        supplierId: pickupOrder.shipperObj.data?.obj?.id,
        supplierType: pickupOrder.shipperObj.data?.obj?.type_person,
        supplier: pickupOrder.shipper,
        supplierObjId: pickupOrder.shipperObj.data?.obj?.id,
        supplierInfo: `${
          pickupOrder.shipperObj?.data?.obj?.street_and_number || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.city || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.state || ""
        } - ${pickupOrder.shipperObj?.data?.obj?.country || ""} - ${
          pickupOrder.shipperObj?.data?.obj?.zip_code || ""
        }`,

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
        // notes: [],
      };
      setFormData(updatedFormData);
      setFormDataUpdated(true);
      setconsigneeRequest(pickupOrder.consignee);
      setshipperRequest(pickupOrder.shipper);
      setsupplierRequest(pickupOrder.supplier);
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
    let supplierName = "";
    if (formData.supplierType === "customer") {
      supplierName = "customerid";
    }
    if (formData.supplierType === "vendor") {
      supplierName = "vendorid";
    }
    if (formData.supplierType === "forwarding-agent") {
      supplierName = "agentid";
    }
    if (formData.supplierType === "Carrier") {
      supplierName = "carrierid";
    }
    if (supplierName !== "") {
      const consignee = {
        [supplierName]: formData.supplierId,
      };

      const response = await ReceiptService.createSupplier(consignee);
      if (response.status === 201) {
        setsupplierRequest(response.data.id);
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
            ? formData.shipperId //CAMBIO
            : formData.consigneeId, //CAMBIO
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
      supplierRequest !== null &&
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
        console.log("createPickUpAAA",supplierRequest);
        let rawData = {
          status: 4, // Hice un cambio, estar pendeinte  status: 2,
          number: formData.number,
          creation_date: formData.createdDateAndTime,
          issued_by: formData.issuedById,
          destination_agent: formData.destinationAgentId,
          employee: formData.employeeId,
          supplier: supplierRequest,
          /* supplier: shipperRequest, */
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
        //added para guardar comidities in pickup order
        let rawDatapick = {
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
          pick_up_location: formData.pickuplocation,

          consignee: consigneeRequest,
          delivery_location: formData.deliverylocation,
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
          ? (async () => {
              const result = await ReceiptService.createReceipt(rawData);
              if (result) {
                await PickupService.updatePickup(pickupOrder.id, rawDatapick);
              }
              return result;
            })()
          : (async () => {
              const result = await ReceiptService.updateReceipt(pickupOrder.id, rawData);
              const buscarrecipt = await ReceiptService.getReceiptById(pickupOrder.id);
              const buscarpickup = (await callPickupOrders(null)).data.results;
              const numeroRecibo = buscarrecipt.data.number;
              
              buscarpickup.forEach(pickup => {
                if (pickup.number === numeroRecibo) {
                  PickupService.updatePickup(pickup.id, rawDatapick);
                }
              });
              
              return result; // Retornar el resultado de updateReceipt
            })()
        );
        
        

        /* if (!creating) {
            const buscarrecipt = await ReceiptService.getReceiptById(pickupOrder.id);
            const buscarpickup = (await callPickupOrders(null)).data.results;

            //console.log("BUSCARPICKUP", buscarpickup);
            const numeroRecibo = buscarrecipt.data.number;
            //console.log("numeroRecibo",numeroRecibo);
            buscarpickup.forEach(pickup => {
              if (pickup.number === numeroRecibo) {
                //console.log("HECHO",pickup.number);
                PickupService.updatePickup(pickup.id, rawDatapick);
              }
            }); 
          }  */

        if (response.status >= 200 && response.status <= 300) {
          //PickupService.updatePickup(pickupOrder.id, rawDatapick);
        
          
              
          
          
          
          //PickupService.updatePickup(pickupOrder.id, rawDatapick);
          /* if (fromPickUp) {
            console.log("BANDERA-1 = ", fromPickUp);
            //added onhand status
            const statusOnhand = 4;
            const newPickup = { ...pickupOrder, status: statusOnhand };
            PickupService.updatePickup(pickupOrder.id, newPickup);
          } */

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
          }, 1000);
        } else {
          setShowErrorAlert(true);
        }
      };
      createPickUp();
    }
  }, [
    shipperRequest,
    supplierRequest,
    consigneeRequest,
    allStateUpdatesComplete,
    clientToBillRequest,
  ]);

  const callPickupOrders = async (url = null) => {
    try {
      return await PickupService.getPickups(url);
    } catch (error) {
      console.error("Error al obtener pedidos de recogida:", error);
      throw error;
    }
  };
  
  

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
    <div className="form-container">
      <div className="company-form receipt">
        <div className="row w-100">
          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h3>General</h3>
                <span></span>
              </div>
              <div className="row mb-3">
                <div className="col-6 text-start">
                  <Input
                    type="number"
                    inputName="number"
                    placeholder="Number..."
                    value={formData.number}
                    readonly={true}
                    label="Number"
                  />
                </div>

                <div className="col-6 text-start">
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
                <div className="col-6 text-start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p id="creation-date" className="text-date">
                      Entry Date and Time
                    </p>
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
                </div>

                <div className="row mb-3">
                <div className="col-6 text-start">
                  <label htmlFor="issuedBy" className="form-label">
                    Issued By:
                  </label>
                  <AsyncSelect
                    id="issuedBy"
                    onChange={(e) => {
                      handleIssuedBySelection(e);
                    }}
                    value={issuedByOptions.find(
                      (option) => option.id === formData.issuedById
                    )}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={issuedByOptions}
                    loadOptions={loadIssuedBySelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>

                <div className="col-6 text-start">
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
                    value={shipperOptions.find(
                      (option) => 
                        option.id === formData.shipperId &&
                        option.type_person === formData.shipperType
                    )}
                    onChange={(e) => handleShipperSelection(e)}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={shipperOptions}
                    loadOptions={loadShipperSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>
                <div className="col-6 text-start">
                  <label htmlFor="consignee" className="form-label">
                    Consignee:
                  </label>
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
                  <p style={{ color: "red" }}>
                    Note: Always select a client to bill when editing
                  </p>
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
                  <label htmlFor="supplier" className="form-label">
                    Name:
                  </label>
                  <AsyncSelect
                    id="supplier"
                    value={supplierOptions.find(
                      (option) => 
                        option.id === formData.supplierId &&
                        option.type_person === formData.supplierType
                    )}
                    onChange={(e) => handleSupplierSelection(e)}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={supplierOptions}
                    loadOptions={loadShipperSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                  {/* <AsyncSelect
                    id="supplier"
                    onChange={(e) => {
                      handleSupplierSelection(e);
                    }}
                    isClearable={true}
                    placeholder="Search and select..."
                    defaultOptions={supplierOptions}
                    loadOptions={loadShipperSelectOptions}
                    value={supplierOptions.find(
                      (option) => 
                      option.id === formData.supplierId &&
                      option.type_person === formData.supplierType
                    )}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  /> */}
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
                    inputName="supplierInfo"
                    placeholder="Supplier Location..."
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

        <div className="creation creation-container">
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
                noScrollY
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
                onInspect={() => {
                  setshowCommodityInspect(!showCommodityInspect);
                }}
                onAdd={() => {}}
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
                    <p className="item-info">
                      Width: {selectedCommodity.width}
                    </p>
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
                        <p className="item-info">
                          Location: {com.locationCode}
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
        <label className="button-charge" htmlFor="toggleBoton"></label>

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
                  noScroll
                  noScrollY
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
                  noScroll
                  noScrollY
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

        <div className="creation creation-container">
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
                    noScrollY
                    data={events}
                    columns={[
                      "Date",
                      // "Name",
                      "Event Type",
                      "Details",
                      "Location",
                      // "Include In Tracking",
                      "Created In",
                      // "Created By",
                      "Created On",
                      // "Last Modified By",
                      // "Last Modified On",
                      // "Optionss"  //Mirar como modifico esta parte para q salga solo eliminar y editar
                    ]}
                    onSelect={handleSelectEvent}
                    selectedRow={SelectEvent}
                    onDelete={() => {}}
                    onEdit={() => {}}
                    onAdd={() => {}}
                    showOptions={false}
                    importLabel={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="creation creation-container">
          <div className="form-label_name">
            <h3>Attachments</h3>
            <span></span>
          </div>
          <div className="row">
            <div className="col-12">
              <label htmlFor="fileInput" className="custom-file-input">
                <span className="button-text">Seleccionar archivos</span>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>
              <div className="image-container">
                {attachments.map((attachment) => (
                  <div key={attachment.name} className="image-wrapper">
                    <img
                      src={attachment.base64}
                      alt={attachment.name}
                      onClick={() => handleShowLargeImage(attachment.base64)}
                    />
                    <div className="image-buttons">
                      <button
                        className="custom-button"
                        onClick={() => handleDeleteAttachment(attachment.name)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      {/* <button
              className="custom-button"
              onClick={() => handleDownloadAttachment(attachment.base64, attachment.name)}
            >
              <i className="fas fa-download"></i>
            </button> */}
                    </div>
                  </div>
                ))}
                {showLargeImage && (
                  <div
                    className="large-image-overlay"
                    onClick={handleCloseLargeImage}
                  >
                    <div className="large-image-container">
                      <button
                        className="button-cancel pick "
                        onClick={handleCloseLargeImage}
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                      <img
                        src={largeImageSrc}
                        style={{ width: "60rem" }}
                        alt="Large Image"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="creation creation-container">
          <div className="form-label_name">
            <h3>Notes</h3>
            <span></span>
          </div>

          <div className="row align-items-center">
            <div className="col-10 text-start" style={{ width: "100%" }}>
              <Input
                type="textarea"
                inputName="notes"
                placeholder="Nota here..."
                label="Note"
                value={formData.notes}
                changeHandler={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
              {/* <input
              name="notes"
              type="text"
              className="form-input"
              placeholder="Notes..."
              onChange={(e) => setNote(e.target.value)}
              style={{ width: "99%" }}
            /> */}
            </div>

            {/* <div className="col">
            <button
              type="button"
              onClick={addNotes}
              style={{
                backgroundColor: "#006BAD",
                color: "white",
                fontSize: "15px",
                width: "90%",
                borderRadius: "5px",
              }}
            >
              Add
            </button>
          </div> */}
            {/* <div className="row">
            <div className="col-10 text-start">
              <Input
                name="notes"
                className="form-input w-100"
                placeholder="PRO Number..."
                value={formData.notes?.toString()}
                style={{width: "100%",marginTop: "10px",height: "100px",wordWrap: "break-word"}}
                // readOnly
              />
            </div> 
          </div>*/}
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
              Error {creating ? "creating" : "updating"} Warehouse Receipt.
              Please try again
            </strong>
          </Alert>
        )}
      </div>
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
