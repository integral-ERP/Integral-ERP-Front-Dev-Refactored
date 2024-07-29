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
import Table from "../shared/components/Table";
import PickupService from "../../services/PickupService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mammoth from 'mammoth'
import { faFile, faFileWord, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import * as XLSX from 'xlsx';
const ReleaseOrderCreationForm = ({
  releaseOrder,
  closeModal,
  creating,
  onReleaseOrderDataChange,
  currentReleaseNumber,
  setcurrentReleaseNumber,
  fromRecipt,
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
  const today = dayjs().format("YYYY-MM-DD hh:mm A");
  const pickupNumber = currentReleaseNumber ? currentReleaseNumber + 1 : 1;
  const [canRender, setcanRender] = useState(false);
  const [commodities, setcommodities] = useState([]);
  const [releaseIDs, setreleaseIDs] = useState([]);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [warehouseReceipts, setWarehouseReceipts] = useState([]);
  const [weightUpdated, setWeightUpdated] = useState(0);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [consignee, setconsignee] = useState(null);
  const [consigneeRequest, setconsigneeRequest] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const StatusDelivered = 9;
  const formFormat = {
    status: StatusDelivered,
    number: pickupNumber,
    createdDateAndTime: today,
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
    main_carrierObj: "",
    warehouse_receipt: "",
    warehouseReceiptObj:"",
    commodities: [],
    consigneeId: "",
    consigneeType: "",
    consigneeInfo: "",
    notes: "",
  };

  const [formData, setFormData] = useState(formFormat);

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
    });
  };

  const handleEmployeeSelection = async (event) => {
    const id = event.id;
    setFormData({
      ...formData,
      employeeId: id,
    });
  };

  const handleClientToBillSelection = async (event) => {
    const type = event.target?.value;
    if (type) {
      if (type === "releasedTo") {
        setFormData({
          ...formData,
          clientToBillType: formData.releasedToType,
          clientToBillId: formData.releasedToId,
        });
      } else {
        setFormData({ ...formData, clientToBillType: "other" });
      }
    } else {
      const id = event.id;
      const type = event.type;

      setFormData({ ...formData, clientToBillType: type, clientToBillId: id });
    }
  };

  const handleMainCarrierSelection = async (event) => {
    const id = event.id;
    console.log("carrierId", id);
    setFormData({
      ...formData,
      carrierId: id,
    });
    console.log("carrierId", carrierId);
  };

  useEffect(() => {}, [formData]);

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
    const info = `${result.data.street_and_number || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zip_code || ""
    }`;
    setFormData({
      ...formData,
      releasedToId: id,
      releasedToInfo: info,
      releasedToType: type,
    });
  };

//added consignee
  const handleConsigneeSelection =async (event) => {
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
    setFormData({
      ...formData,
      consigneeId: id,
      consigneeType: type,
      consigneeInfo: info,
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

  const handleCommoditySelection = (receiptNumber, commodityID, id) => {
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

   //---------------------------------------added atacments ---------------------------------
    //---------------------------------CHARGE IMG---------------------------------------------------------

  const [showPreview, setShowPreview] = useState(false);
  
  const [fileContent, setfileContent] = useState({});

  // const pdfPlugin = defaultLayoutPlugin();

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
  //---------------------------------------
   const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            base64: reader.result,
            type: file.type,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(newAttachments => {
      setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
    });
  };

  const handlePreview = async (attachment) => {
    if (attachment.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = convertDataURIToBinary(attachment.base64);
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setfileContent({ ...attachment, htmlContent: result.value });
      } catch (error) {
        console.error("Error processing Word file:", error);
        alert("Error processing Word file. Please try again.");
      }
    } else {
      setfileContent(attachment);
    }
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setfileContent({});
  };

  const getIcon = (type) => {
    if (type === 'application/pdf') {
      return faFilePdf;
    } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return faFileWord;
    } else if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return faFileExcel;
    } else {
      return faFile;
    }
  };

  const getColor = (type) => {
    if (type === 'application/pdf') {
      return "#ff0000";
    } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return "#1976d2";
    } else if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return "#43a047";
    } else {
      return "#9e9e9e";
    }
  };


  // ----------------------------------------------------------------------------------------
  const handleDeleteAttachment = (name) => {
    const updateAttachments = attachments.filter(
      (attachment) => attachment.name !== name
    );
    setAttachments(updateAttachments);
  }

  const convertDataURIToBinary = (dataURI) => {
    const base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    const base64 = dataURI.substring(base64Index);
    const raw = atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array.buffer;
  };

  const renderPreviewContent = () => {
    if (fileContent.type.startsWith("image/")) {
      return <img src={fileContent.base64} style={{ width: "60rem" }} alt="Large Preview" />;
    }
    if (fileContent.type === 'application/pdf') {
      return (
        <iframe
          src={fileContent.base64}
          width="100%"
          height="500px"
          title="PDF file"
        />
      );
    }

    if (fileContent.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = XLSX.read(fileContent.base64.split(',')[1], { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const htmlString = XLSX.utils.sheet_to_html(sheet, { editable: false });
      return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    }
    if (fileContent.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <div dangerouslySetInnerHTML={{ __html: fileContent.htmlContent }} />;
    }

    return <div>No se puede previsualizar este tipo de archivo</div>;
  };

  // -----------------------------------------------attachments end-----------------------------------------
  useEffect(() => {
    if (!creating && releaseOrder != null) {
      setcommodities(releaseOrder.commodities);
      setAttachments(releaseOrder.attachments);
      let updatedFormData = {
        status: releaseOrder.status,
        number: releaseOrder.number,
        createdDateAndTime: releaseOrder.creation_date,
        release_date: releaseOrder.release_date,
        employeeId: releaseOrder.employee,
        issuedById: releaseOrder.issued_by,
        issuedByType: releaseOrder.issued_byObj?.type_person,
        releasedToId: releaseOrder.releasedToObj.data?.obj?.id, //pickupOrder.consignee //releaseOrder.releasedToObj?.data?.obj?.id,
        releasedToType:  releaseOrder.releasedToObj.data?.obj?.type_person,//releaseOrder.releasedToObj?.data?.obj?.type_person,
        releasedToInfo: `${
          releaseOrder.releasedToObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.city || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.state || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.country || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.zip_code || ""
        }`,  /* `${
          releaseOrder.releasedToObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.city || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.state || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.country || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.zip_code || ""
        }`, */
       /*  clientToBillId: releaseOrder.client_to_bill,
        clientToBillType: releaseOrder.clientBillObj?.data?.obj?.type_person, */
        carrierId: releaseOrder.carrier,
        pro_number: releaseOrder.pro_number,
        tracking_number: releaseOrder.tracking_number,
        purchase_order_number: releaseOrder.purchase_order_number,
        main_carrierObj: releaseOrder.main_carrierObj,
        warehouse_receipt: releaseOrder.warehouse_receipt,
        warehouseReceiptObj: releaseOrder.warehouseReceiptObj,
       /*  warehouseReceiptId: releaseOrder.warehouseReceiptId, */
        commodities: releaseOrder.commodities,
        notes: releaseOrder.notes,
        /* charges: releaseOrder.charges, */
        /* consignee: releaseOrder.consignee,
        consigneeId: releaseOrder.consigneeObj.data?.obj?.id, //pickupOrder.consignee
        consigneeType: releaseOrder.consigneeObj.data?.obj?.type_person,
        consigneeInfo: `${
          releaseOrder.consigneeObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.consigneeObj?.data?.obj?.city || ""} - ${
          releaseOrder.consigneeObj?.data?.obj?.state || ""
        } - ${releaseOrder.consigneeObj?.data?.obj?.country || ""} - ${
          releaseOrder.consigneeObj?.data?.obj?.zip_code || ""
        }`, */
      };
      setconsignee(releaseOrder.consigneeObj?.data?.obj);
      setconsigneeRequest(releaseOrder.consignee);
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
    const carriersWithType = addTypeToObjects(carriers, "Carrier");

    const issuedByOptions = [...forwardingAgentsWithType];
    const employeeOptions = [...employeesWithType];
    const releasedToOptions = [
      ...customersWithType,
      ...vendorsWithType,
      ...forwardingAgentsWithType,
      ...carriersWithType,
    ];

    const carrierOptions = [...carriersWithType];

    const consigneeOptions = [
      ...customersWithType,
      ...vendorsWithType,
      ...forwardingAgentsWithType,
      ...carriersWithType,
    ]

    issuedByOptions.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    employeeOptions.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    carrierOptions.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    setConsigneeOptions(consigneeOptions);
    setReleasedToOptions(releasedToOptions);
    setIssuedByOptions(issuedByOptions);
    setEmployeeOptions(employeeOptions);
    setCarrierOptions(carrierOptions);
  };

  const addTypeToObjects = (arr, type) => arr.map((obj) => ({ ...obj, type }));

  const loadIssuedBySelectOptions = async (inputValue) => {
    const responseAgents = (await ForwardingAgentService.search(inputValue))
      .data.results;

    const options = [...addTypeToObjects(responseAgents, "forwarding-agent")];

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

    const options = [...addTypeToObjects(responseCarriers, "carrier")];

    return options;
  };

  const loadReleasedToOptionsSelectOptions = async (inputValue) => {
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
      ...addTypeToObjects(responseCarriers, "carrier"),
    ];

    return options;
  };


  const loadConsigneeToOptionsSelectOptions = async (inputValue) => {
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

  useEffect(() => {
    if (!fromRecipt) {
      fetchFormData();
    }
  }, []);

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
    fetchFormData();
    fetchReceipts();
  }, []);

  useEffect(() => {
    if (creating) {
      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  useEffect(() => {
    if (commodities.length > 0) {
      setFormData({ ...formData, status: 1 });
    }
  }, [commodities]);

  useEffect(() => {
    if (fromRecipt) {
      setcommodities(releaseOrder.commodities);
      //console.log("idwh", releaseOrder.id);
      //console.log("todowh", releaseOrder);
      let updatedFormData = {
        status: releaseOrder.status,
        number: releaseOrder.number,
        createdDateAndTime: today,//releaseOrder.creation_date,
        release_date: today,// releaseOrder.release_date,
        employeeId: releaseOrder.employee,
        issuedById: releaseOrder.issued_by,
        issuedByType: releaseOrder.issued_byObj?.type_person,
        releasedToId: releaseOrder.consigneeObj.data?.obj?.id,//releaseOrder.releasedToObj?.data?.obj?.id,
        releasedToType: releaseOrder.consigneeObj.data?.obj?.type_person,//releaseOrder.releasedToObj?.data?.obj?.type_person,
        releasedToInfo:`${
          releaseOrder.consigneeObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.consigneeObj?.data?.obj?.city || ""} - ${
          releaseOrder.consigneeObj?.data?.obj?.state || ""
        } - ${releaseOrder.consigneeObj?.data?.obj?.country || ""} - ${
          releaseOrder.consigneeObj?.data?.obj?.zip_code || ""
        }`, /* `${
          releaseOrder.releasedToObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.city || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.state || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.country || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.zip_code || ""
        }`, */
        clientToBillId: releaseOrder.client_to_bill,
        clientToBillType: releaseOrder.clientBillObj?.data?.obj?.type_person,
        carrierId: releaseOrder.carrier_by,
        pro_number: releaseOrder.pro_number,
        tracking_number: releaseOrder.tracking_number,
        purchase_order_number: releaseOrder.purchase_order_number,
        main_carrierObj: releaseOrder.main_carrierObj,
        warehouse_receipt: releaseOrder.id,
        warehouseReceiptObj: releaseOrder,
        commodities: releaseOrder.commodities,
        charges: releaseOrder.charges,
        consignee: releaseOrder.consignee,
        consigneeId: releaseOrder.consigneeObj.data?.obj?.id, //pickupOrder.consignee
        consigneeType: releaseOrder.consigneeObj.data?.obj?.type_person,
        consigneeInfo: `${
          releaseOrder.consigneeObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.consigneeObj?.data?.obj?.city || ""} - ${
          releaseOrder.consigneeObj?.data?.obj?.state || ""
        } - ${releaseOrder.consigneeObj?.data?.obj?.country || ""} - ${
          releaseOrder.consigneeObj?.data?.obj?.zip_code || ""
        }`,
      };
      setconsignee(releaseOrder.consigneeObj?.data?.obj);
      setReleasedTo(releaseOrder.consigneeObj?.data?.obj)
      setconsigneeRequest(releaseOrder.consignee);
      setFormData(updatedFormData);
      setcanRender(true);
    }
  }, [fromRecipt, releaseOrder]);
  
  const sendData = async () => {
     let releasedToName = "";
    if (formData.releasedToType === "customer") {
      releasedToName = "customerid";
    }
    if (formData.releasedToType === "vendor") {
      releasedToName = "vendorid";
    }
    if (formData.releasedToType === "forwarding-agent") {
      releasedToName = "agentid";
    }
    if (formData.releasedToType === "Carrier") {
      releasedToName = "carrierid";
    }

    if (releasedToName !== "") {
      const releasedToC = {
        [releasedToName]: formData.releasedToId,
      };

      const response = await ReleaseService.createReleasedTo(releasedToC);
      if (response.status === 201) {
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
    if (formData.clientToBillType === "Carrier") {
      clientToBillName = "carrierid";
    }
    if (clientToBillName !== "") {
      const clientToBill = {
        [clientToBillName]: formData.clientToBillId,
      };

      
      const response = await ReleaseService.createClientToBill(clientToBill);
      if (response.status === 201) {
        setClientToBill(response.data.id);
      }
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
    
    console.log("hecho3");
    if (commodities.length > 0) {
      let totalWeight = 0;
      commodities.forEach((com) => {
        totalWeight += parseFloat(com.weight);
      });
      setWeightUpdated(totalWeight);
    }
  };
  const callPickupOrders = async (url = null) => {
    try {
      return await PickupService.getPickups(url);
    } catch (error) {
      console.error("Error al obtener pedidos de recogida:", error);
      throw error;
    }
  };
  
  const checkUpdatesComplete = () => {
    if (/* releasedTo !== null && clientToBill !== null && */ weightUpdated) {
      setAllStateUpdatesComplete(true);
    }
  };

  useEffect(() => {
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      let charges = [];

      releaseIDs.forEach((id) => {
        const order = warehouseReceipts.find((receipt) => receipt.id == id);
        charges = [...charges, order.charges];
      });

        // Convertir createdDateAndTime a ISO 8601
      const isoDate = dayjs(formData.createdDateAndTime,"YYYY-MM-DD hh:mm A").toISOString();

       // Convertir release_date a ISO 8601
          const isoReleaseDate = dayjs(formData.release_date,"YYYY-MM-DD hh:mm A").toISOString(); 
          const logWithDelay = async (data) => {
            await new Promise(resolve => setTimeout(resolve, 10000));
            console.log("Datos a enviar:", data);
          };

      // # Obtener la fecha y la hora por separado
      let dataCreation = new Date(isoDate);
      let year = dataCreation.getFullYear();
      let month = String(dataCreation.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
      let day = String(dataCreation.getDate()).padStart(2, '0');
      let hours = dataCreation.getHours();
      let minutes = String(dataCreation.getMinutes()).padStart(2, '0');
      // Determinar AM o PM
      let ampm = hours >= 12 ? 'P' : 'A';
      // Convertir horas de 24 horas a 12 horas
      hours = hours % 12;
      hours = hours ? hours : 12; // La hora 0 debería ser 12
      // Formato: YYYY-MM-DD HH:MM AM/PM
      let formattedDateTime = `${day}/${month}/${year}-${hours}:${minutes}${ampm}`;
//-----------------------
      const createPickUp = async () => {
        let rawData = {
          status: StatusDelivered,
          number: formData.number,
          creation_date: isoDate,
          creation_date_text: formattedDateTime,
          release_date: isoReleaseDate,
          employee: formData.employeeId,
          issued_by: formData.issuedById,
          issuedByType: formData.issuedByType,
          released_to: releasedTo,
          releasodToType: formData.releasedToType,
          client_to_bill: formData.clientToBill,
          client_to_bill_type: formData.clientToBillType,
          carrier: formData.main_carrierObj.id,
          pro_number: formData.pro_number,
          tracking_number: formData.tracking_number,
          purchase_order_number: formData.purchase_order_number,
          main_carrierObj: formData.main_carrierObj,
          warehouse_receipt: formData.warehouse_receipt,
          warehouseReceiptObj: formData.warehouseReceiptObj,
          commodities: commodities,
          consignee: consigneeRequest,
          attachments: attachments.map((attachment) => {
            return {
              name: attachment.name,
              type: attachment.type,
              base64: attachment.base64,
            };
          }),
          notes: formData.notes,
        };
        // Llama a la función de log con retraso
        logWithDelay(rawData);
        //console.log("CHNAGED", updatedReceiptData.consigneeObj.data.obj);
        console.log("CONSIGNEREQUEST", consigneeRequest);
        const response = await (creating
          ? (async () => {

            const createReleaseForm = await ReleaseService.createRelease(rawData);
              //added change status delivered
             const buscarrecipt = await ReceiptService.getReceiptById(releaseOrder.id);
            const updatedReceiptData = { ...buscarrecipt.data };
            //console.log("updatedReceiptData", updatedReceiptData);
            updatedReceiptData.status=StatusDelivered;
           
            await ReceiptService.updateReceipt(releaseOrder.id, updatedReceiptData );
            
            const buscarpickup = (await callPickupOrders(null)).data.results;
            const numeroRecibo = buscarrecipt.data.number;
            
            buscarpickup.forEach(pickup => {
              if (pickup.number === numeroRecibo) {
                PickupService.updatePickup(pickup.id, updatedReceiptData );
              }
            }); 
            
             // Retornar el resultado de updateReceipt 
            return createReleaseForm;
          })()
          :  (async () => {

            const updateInfoRelease = await ReleaseService.updateRelease(releaseOrder.id, rawData);
          
            return updateInfoRelease;
          })()
      );

        if (response.status >= 200 && response.status <= 300) {
          setcurrentReleaseNumber(currentReleaseNumber + 1);
          setShowSuccessAlert(true);
          setTimeout(() => {
            closeModal();
            onReleaseOrderDataChange();
            setShowSuccessAlert(false);
            setFormData(formFormat);
            window.location.href = `/warehouse/release`;
          }, 1000);
        } else {
          setShowErrorAlert(true);
        }
      };
      createPickUp();
    }
  }, [allStateUpdatesComplete, weightUpdated]);

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
  
  const getAsyncSelectValue = () => {
    let selectedOption = null;
    if (formData.clientToBillType === "releasedTo") {
      selectedOption = releasedToOptions.find(
        (option) =>
          option.id === formData.releasedToId &&
          option.type === formData.releasedToType
      );
    } else {
      selectedOption = releasedToOptions.find(
        (option) =>
          option.id === formData.clientToBillId &&
          option.type === formData.clientToBillType
      );
    }

    return selectedOption;
  };

  return (
    <div className="form-container">
      <div className="company-form release-order">
        <div className="row w-100">
          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>General</h2>
                <span></span>
              </div>
              <div className="row mb-3">
                <div className="col-4 text-start">
                  <label className="form-label">Warehouse number: </label>
                  <div className="col-4 text-start">
                    <input
                      className="tex-release"
                      // type="text"
                      // inputName="number"
                      // placeholder="Number..."
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      label="Ware House Number"
                    />
                  </div>
                </div>

                <div className="col-4 text-start">
                  <label htmlFor="employee" className="form-label">
                    Employee:
                  </label>
                  <AsyncSelect
                    type="text"
                    id="employee"
                    // inputName="purchaseOrderNumber"
                    value={employeeOptions.find(
                      (option) => option.id == formData.employeeId
                    )}
                    // value ={formData.employeeOptions.find(option)}
                    // value={(option) => option.name}
                    // onChange={(e) => {
                    //   handleEmployeeSelection(e);
                    // }}
                    // isClearable={true}
                    // defaultOptions={employeeOptions}
                    // loadOptions={loadEmployeeSelectOptions}
                    getOptionLabel={(option) => option.name}
                    // getOptionValue={(option) => option.id}
                  />
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
                    // onChange={(e) => {
                    //   handleIssuedBySelection(e);
                    // }}
                    // isClearable={true}
                    // placeholder="Search and select..."
                    // defaultOptions={issuedByOptions}
                    // loadOptions={loadIssuedBySelectOptions}
                    getOptionLabel={(option) => option.name}
                    // getOptionValue={(option) => option.id}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-4 text-start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p id="creation-date" className="text-date">
                      Creation Date and Time
                    </p>
                    <DateTimePicker
                      // label="Creation Date and Time"
                      className="font-right"
                      value={dayjs(formData.createdDateAndTime)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          createdDateAndTime: dayjs(e).format("YYYY-MM-DD hh:mm A"),
                        })
                      }
                    />
                  </LocalizationProvider>
                </div>
                <div className="col-4 text-start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p id="creation-date" className="text-date">
                      Release Date and Time
                    </p>
                    <DateTimePicker
                      // label="Release Date and Time"
                      className="font-right"
                      value={dayjs(formData.release_date)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          release_date: dayjs(e).format("YYYY-MM-DD hh:mm A"),
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
                      id="consignee"
                      value={consigneeOptions.find(
                        (option) =>
                          option.id === formData.releasedToId &&
                          option.type_person === formData.releasedToType
                      )}
                      onChange={(e) => handleConsigneeSelection(e)}
                      isClearable={true}
                      placeholder="Search and select..."
                      defaultOptions={consigneeOptions}
                      loadOptions={loadConsigneeToOptionsSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )
                ) : (
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
                      loadOptions={loadConsigneeToOptionsSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                )}
              </div> 

                {/* <div className="col-4 text-start">
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
                        (option) =>
                          option.id === formData.releasedToId &&
                          option.type === formData.releasedToType
                      )}
                      className="async-option"
                      isClearable={true}
                      defaultOptions={releasedToOptions}
                      loadOptions={loadReleasedToOptionsSelectOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )
                ) : (
                  <AsyncSelect
                    id="releasedToId"
                    onChange={(e) => {
                      handleReleasedToSelection(e);
                    }}
                    value={releasedToOptions.find(
                      (option) =>
                        option.id === formData.releasedToId &&
                        option.type === formData.releasedToType
                    )}
                    className="async-option"
                    isClearable={true}
                    defaultOptions={releasedToOptions}
                    loadOptions={loadReleasedToOptionsSelectOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                )}
              </div>  */}
              </div>

              {/* <div className="row align-items-center mb-3">
              <div className="col-6 text-start">
                <label htmlFor="clientToBill" className="form-label">
                  Client to Bill:
                </label>
                <Input
                  name="clientToBill"
                  id="clientToBill"
                  value={formData.client_to_bill_type}
                  onChange={(e) => {
                    handleClientToBillSelection(e);
                  }}
                >
                  <option value="">Select an Option</option>
                  <option value="releasedTo">Released To</option>
                  <option value="other">Other</option>
                </Input>
                <p style={{ color: "red" }}>
                  Note: Always select a client to bill when editing
                </p>
                </div>
                <div className="col-6 text-start">
                <AsyncSelect
                  id="releasedToOther"
                  isDisabled={formData.clientToBillType !== "other"}
                  onChange={(e) => {
                    handleClientToBillSelection(e);
                  }}
                  value={getAsyncSelectValue()}
                  isClearable={true}
                  defaultOptions={releasedToOptions}
                  loadOptions={loadReleasedToOptionsSelectOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              </div> 
            </div>*/}
            </div>
          </div>

          <div className="col-6">
            <div className="creation creation-container w-100">
              <div className="form-label_name">
                <h2>Carrier</h2>
                <span></span>
              </div>
              <div className="row align-items-center mb-3">
                <div className="col-6 text-start">
                  <label htmlFor="mainCarrier" className="form-label">
                    Carrier:
                  </label>
                  <Input
                    type="text"
                    inputName="purchaseOrderNumber"
                    placeholder="Carrier . . . "
                    value={formData.main_carrierObj.name || ""}
                  />
                </div>
                <div className="col-6 text-start">
                  <Input
                    type="text"
                    inputName="trackingNumber"
                    placeholder="Tracking Number..."
                    value={formData.tracking_number }
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        tracking_number: e.target.value,
                      })
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
                    value={formData.pro_number }
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
                  value={formData.purchase_order_number || ""}
                  onChange={(e) =>
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
          </div>
        </div>

        <div className="creation creation-container">
          <div className="form-label_name">
            <h2>Commodities</h2>
            <span></span>
          </div>

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
              " Volume-Weight (Vlb)",
              // " Weight (lb)",
            ]}
            onAdd={() => {}}
            showOptions={false}
          />
        </div>

        {/* <div className="creation creation-container w-100">
        <div className="row align-items-center">
          <div
            className="col-6 text-start"
            style={{ fontSize: "14px", fontWeight: "bold" }}
          >
            {warehouseReceipts.map((receipt) => (
              <div key={receipt.number}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedReceipts.includes(receipt.number)}
                    onChange={() => handleReceiptSelection(receipt.number)}
                  />
                  {receipt.number} - {receipt.issued_byObj?.name}
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
                          {commodity.height}x{commodity.width}x
                          {commodity.length} - {commodity.description}
                        </option>
                      ))}
                    </select>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div> */}


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
              <br />
              <br />
              <div className="attachment-container">
            {attachments.map((attachment) => (
              <div key={attachment.name} className="attachment-wrapper">
                <div onClick={() => handlePreview(attachment)} style={{ cursor: 'pointer' }}>
                  {attachment.type.startsWith("image/") ? (
                    <img
                      src={attachment.base64}
                      alt={attachment.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={getIcon(attachment.type)}
                      size="10x"
                      style={{ color: getColor(attachment.type) }}
                    />
                  )}
                </div>
                <span className="attachment-name">{attachment.name}</span>
                <div className="delete-button-container">
                  <button
                    className="custom-button"
                    onClick={() => handleDeleteAttachment(attachment.name)}
                  >
                    <div className="delete-icon">
                      <p>&times;</p>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="preview-overlay" onClick={handleClosePreview}>
          <div className="preview-container">
            <button className="button-cancel pick" onClick={handleClosePreview}>
              <i className="fas fa-times-circle"></i>
            </button>
            {renderPreviewContent()}
          </div>
        </div>
      )}
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
                      placeholder="Note here..."
                      // label="Note"
                      value={formData.notes}
                      changeHandler={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

        <div className="company-form__options-container">
           <button className="button-save" onClick={sendData}>
          Save
        </button> 
          {/* <button className="button-cancel" onClick={closeModal}>
            Accept
          </button> */}
        </div>
        {/* {showSuccessAlert && (
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
              Release Order {creating ? "created" : "updated"} successfully!
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
              Error {creating ? "creating" : "updating"} Release Order. Please
              try again
            </strong>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ReleaseOrderCreationForm;
