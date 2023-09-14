import { useState, useEffect, useMemo } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import CarrierService from "../../services/CarrierService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ForwardingAgentService from "../../services/ForwardingAgentService";
import WarehouseProviderService from "../../services/WarehouseProviderService";
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
import { debounce } from "lodash"; // Import debounce for input throttling
const PickupOrderCreationForm = ({
  pickupOrder,
  closeModal,
  creating,
  onpickupOrderDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showIncomeForm, setshowIncomeForm] = useState(false);
  const [showCommodityCreationForm, setshowCommodityCreationForm] =
    useState(false);
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
  const formFormat = {
    // GENERAL TAB
    status: "",
    number: "8000325",
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
    // SUPPLIER TAB
    supplierId: "",
    supplierInfo: "",
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
    const result = await (type === "forwarding-agent"
      ? ForwardingAgentService.getForwardingAgentById(id)
      : WarehouseProviderService.getWarehouseProviderByID(id));
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
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
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
    }`;
    setFormData({
      ...formData,
      pickupOrderId: id,
      pickupOrderType: type,
      pickupInfo: info,
    });
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
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
    }`;
    setFormData({
      ...formData,
      deliveryId: id,
      deliveryType: type,
      deliveryLocationInfo: info,
    });
  };

  const handleDestinationAgentSelection = async (event) => {
    const id = event.id;
    setFormData({
      ...formData,
      destinationAgentId: id,
    });
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
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
    }`;
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
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
    }`;
    setFormData({
      ...formData,
      shipperId: id,
      shipperType: type,
      shipperInfo: info,
    });
  };

  const handleMainCarrierSelection = async (event) => {
    const id = event.id;
    const result = await CarrierService.getCarrierById(id);
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
    }`;
    setFormData({
      ...formData,
      mainCarrierdId: id,
      mainCarrierInfo: info,
    });
  };

  const handleSupplierSelection = async (event) => {
    const id = event.id;
    const type = event.type;
    let result;
    if (type === "customer") {
      result = await CustomerService.getCustomerById(id);
    }
    if (type === "vendor") {
      result = await VendorService.getVendorByID(id);
    }
    const info = `${result.data.streetNumber || ""} - ${
      result.data.city || ""
    } - ${result.data.state || ""} - ${result.data.country || ""} - ${
      result.data.zipCode || ""
    }`;
    setFormData({
      ...formData,
      supplierId: id,
      supplierType: type,
      supplierInfo: info,
    });
  };

  // Your remote data fetching function
  const loadIssuedByOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = issuedByOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadDestinationAgentOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = destinationAgentOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadEmployeeOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = employeeOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadShipperOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = shipperOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadPickupLocationOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = pickupLocationOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadConsigneeOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = consigneeOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadDeliveryLocationsOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = deliveryLocationOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  const loadCarrierOptions = (inputValue, callback) => {
    const query = inputValue.toLowerCase();
    console.log(query);
    const results = carrierOptions.filter((fw) =>
      fw.name.toLowerCase().includes(query)
    );
    console.log(results);
    callback(results);
  };

  // Throttle the input change to avoid sending too many requests
  //const debouncedSearch = debounce(loadOptions, 300); // Adjust the debounce time as needed TODO: check if necessary

  useEffect(() => {
    if (!creating && pickupOrder) {
      let updatedFormData = {
        // GENERAL TAB
        status: pickupOrder.status,
        number: pickupOrder.number,
        createdDateAndTime: pickupOrder.creationDate,
        pickupDateAndTime: pickupOrder.pickUpDate,
        deliveryDateAndTime: pickupOrder.deliveryDate,
        issuedById: pickupOrder.issuedByKey,
        issuedByInfo: `${pickupOrder.issuedBy?.streetNumber || ""} - ${
          pickupOrder.issuedBy?.city || ""
        } - ${pickupOrder.issuedBy?.state || ""} - ${
          pickupOrder.issuedBy?.country || ""
        } - ${pickupOrder.issuedBy?.zipCode || ""}`,
        destinationAgentId: pickupOrder.destinationAgentKey,
        employeeId: pickupOrder.employeekey,
        // PICKUP TAB
        shipperId: pickupOrder.shipperkey,
        shipperInfo: `${pickupOrder.shipper?.streetNumber || ""} - ${
          pickupOrder.shipper?.city || ""
        } - ${pickupOrder.shipper?.state || ""} - ${
          pickupOrder.shipper?.country || ""
        } - ${pickupOrder.shipper?.zipCode || ""}`,
        pickupLocationId: pickupOrder.PickUpLocationkey,
        pickupLocationInfo: `${
          pickupOrder.PickUpLocation?.streetNumber || ""
        } - ${pickupOrder.PickUpLocation?.city || ""} - ${
          pickupOrder.PickUpLocation?.state || ""
        } - ${pickupOrder.PickUpLocation?.country || ""} - ${
          pickupOrder.PickUpLocation?.zipCode || ""
        }`,
        // DELIVERY TAB
        consigneeId: pickupOrder.consigneekey,
        consigneeInfo: `${pickupOrder.consignee?.streetNumber || ""} - ${
          pickupOrder.consignee?.city || ""
        } - ${pickupOrder.consignee?.state || ""} - ${
          pickupOrder.consignee?.country || ""
        } - ${pickupOrder.consignee?.zipCode || ""}`,
        deliveryLocationId: pickupOrder.deliveryLocationkey,
        deliveryLocationInfo: `${
          pickupOrder.deliveryLocation?.streetNumber || ""
        } - ${pickupOrder.deliveryLocation?.city || ""} - ${
          pickupOrder.deliveryLocation?.state || ""
        } - ${pickupOrder.deliveryLocation?.country || ""} - ${
          pickupOrder.deliveryLocation?.zipCode || ""
        }`,
        // CARRIER TAB
        proNumber: pickupOrder.proNumber,
        trackingNumber: pickupOrder.trackingNumber,
        mainCarrierdId: pickupOrder.mainCarrierKey,
        mainCarrierInfo: `${pickupOrder.mainCarrier?.streetNumber || ""} - ${
          pickupOrder.mainCarrier?.city || ""
        } - ${pickupOrder.mainCarrier?.state || ""} - ${
          pickupOrder.mainCarrier?.country || ""
        } - ${pickupOrder.mainCarrier?.zipCode || ""}`,
        // SUPPLIER TAB
        supplierId: pickupOrder.supplierKey,
        supplierInfo: `${pickupOrder.supplier?.streetNumber || ""} - ${
          pickupOrder.supplier?.city || ""
        } - ${pickupOrder.supplier?.state || ""} - ${
          pickupOrder.supplier?.country || ""
        } - ${pickupOrder.supplier?.zipCode || ""}`,
        invoiceNumber: pickupOrder.invoiceNumber,
        purchaseOrderNumber: pickupOrder.purchaseOrderNum,
        // CHARGES TAB
        // COMMODITIES TAB
        commodities: pickupOrder.commodities,
      }; // Create a copy of the existing formData

      setFormData(updatedFormData); // Update formData once with all the changes
      console.log(updatedFormData);
    }
  }, [creating, pickupOrder]);

  const fetchFormData = async () => {
    const forwardingAgents = (
      await ForwardingAgentService.getForwardingAgents()
    ).data.results;
    const warehouseProviders = (
      await WarehouseProviderService.getWarehouseProviders()
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
    const warehouseProvidersWithType = addTypeToObjects(
      warehouseProviders,
      "warehouse-provider"
    );
    const customersWithType = addTypeToObjects(customers, "customer");
    const vendorsWithType = addTypeToObjects(vendors, "vendor");
    const employeesWithType = addTypeToObjects(employees, "employee");
    const carriersWithType = addTypeToObjects(carriers, "carrier");

    // Merge the arrays
    const issuedByOptions = [
      ...forwardingAgentsWithType,
      ...warehouseProvidersWithType,
    ];
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

    // Set the state with the updated arrays
    setIssuedByOptions(issuedByOptions);
    setDestinationAgentOptions(destinationAgentOptions);
    setEmployeeOptions(employeeOptions);
    setShipperOptions(shipperOptions);
    setPickupLocationOptions(pickupLocationOptions);
    setConsigneeOptions(consigneeOptions);
    setDeliveryLocationOptions(deliveryLocationOptions);
    setCarrierOptions(carrierOptions);

    console.log("carriers:", carrierOptions);
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const sendData = async () => {
    let rawData = {
      // GENERAL TAB
      status: 1,
      number: formData.number,
      creationDate: formData.createdDateAndTime,
      pickUpDate: formData.pickupDateAndTime,
      deliveryDate: formData.deliveryDateAndTime,
      issuedByKey: formData.issuedById,
      destinationAgentKey: formData.destinationAgentId,
      employeekey: formData.employeeId,
      // PICKUP TAB
      shipperkey: formData.shipperId,
      PickUpLocationkey: formData.pickupLocationId,
      // DELIVERY TAB
      consigneekey: formData.consigneeId,
      deliveryLocationkey: formData.deliveryLocationId,
      // CARRIER TAB
      proNumber: formData.proNumber,
      trackingNumber: formData.trackingNumber,
      mainCarrierKey: formData.mainCarrierdId,
      // SUPPLIER TAB
      supplierKey: formData.supplierId,
      invoiceNumber: formData.invoiceNumber,
      purchaseOrderNum: formData.purchaseOrderNumber,
      // CHARGES TAB
      // COMMODITIES TAB
      pieces: formData.commodities,
    };
    const response = await (creating
      ? PickupService.createPickup(rawData)
      : PickupService.updatePickup(pickupOrder.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      console.log("Pickup Order successfully created/updated:", response.data);
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

  const handleSelectChange = (e) => {
    setFormData({ ...formData, consigneeId: e.target.value });
  };

  const mockDataCharges = [];

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
            href="#commodities"
            aria-selected={activeTab === "commodities"}
            onClick={() => setActiveTab("commodities")}
            tabIndex="-1"
            role="tab"
          >
            Commodities
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
        <div className="company-form__section">
          <label htmlFor="issuedby" className="company-form__label">
            Issued By:
          </label>
          <AsyncSelect
            id="issuedby"
            value={formData.issuedById}
            onChange={(e) => {
              handleIssuedBySelection(e);
            }}
            loadOptions={loadIssuedByOptions}
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
          <label htmlFor="destinationAgent" className="company-form__label">
            Destination Agent:
          </label>
          <AsyncSelect
            id="destinationAgent"
            value={formData.destinationAgentId}
            onChange={(e) => {
              handleDestinationAgentSelection(e);
            }}
            loadOptions={loadDestinationAgentOptions}
            isClearable={true}
            placeholder="Search and select..."
            defaultOptions={destinationAgentOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
          />
        </div>
        <div className="company-form__section">
          <Input
            type="text"
            inputName="pickupnumber"
            placeholder="Pickup Order Number..."
            value={formData.number}
            readonly={true}
            label="Number"
          />
        </div>
        <div className="company-form__section">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Creation Date and Time"
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
        <div className="company-form__section">
          <label htmlFor="employee" className="company-form__label">
            Employee:
          </label>
          <AsyncSelect
            id="employee"
            value={formData.employeeId}
            onChange={(e) => {
              handleEmployeeSelection(e);
            }}
            loadOptions={loadEmployeeOptions}
            isClearable={true}
            placeholder="Search and select..."
            defaultOptions={employeeOptions}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
          />
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "pickup" ? "show active" : ""
        } company-form__general-form`}
        id="pickup"
        style={{ display: activeTab === "pickup" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <label htmlFor="shipper" className="company-form__label">
            Shipper:
          </label>
          <AsyncSelect
            id="shipper"
            value={formData.shipperId}
            onChange={(e) => {
              handleShipperSelection(e);
            }}
            loadOptions={loadShipperOptions}
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
          <label htmlFor="pickup" className="company-form__label">
            Pick-up Location:
          </label>
          <AsyncSelect
            id="pickup"
            value={formData.pickupLocationId}
            onChange={(e) => {
              handlePickUpSelection(e);
            }}
            loadOptions={loadPickupLocationOptions}
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
              setFormData({ ...formData, purchaseOrderNumber: e.target.value })
            }
            label="Purchase Order Number"
          />
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "delivery" ? "show active" : ""
        } company-form__general-form`}
        id="delivery"
        style={{ display: activeTab === "delivery" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <label htmlFor="consignee" className="company-form__label">
            Consignee:
          </label>
          <div className="custom-select">
            <AsyncSelect
              id="consignee"
              value={formData.consigneeId}
              onChange={(e) => handleConsigneeSelection(e)}
              loadOptions={loadConsigneeOptions}
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
          <label htmlFor="delivery" className="company-form__label">
            Delivery Location:
          </label>
          <AsyncSelect
            id="delivery"
            value={formData.deliveryLocationId}
            onChange={(e) => {
              handleDeliveryLocationSelection(e);
            }}
            loadOptions={loadDeliveryLocationsOptions}
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
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "carrier" ? "show active" : ""
        } company-form__general-form`}
        id="carrier"
        style={{ display: activeTab === "carrier" ? "block" : "none" }}
      >
        <div className="company-form__section">
          <label htmlFor="mainCarrier" className="company-form__label">
            Carrier:
          </label>
          <AsyncSelect
            id="mainCarrier"
            value={formData.mainCarrierdId}
            onChange={(e) => {
              handleMainCarrierSelection(e);
            }}
            loadOptions={loadCarrierOptions}
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
                fill="#C11111"
              />
            </svg>
            Add Expense Charge
          </button>
          {showIncomeForm && (
            <IncomeChargeForm
              onCancel={setshowIncomeForm}
              charges={charges}
              setcharges={setcharges}
            ></IncomeChargeForm>
          )}
        </div>
        <Table
          data={mockDataCharges}
          columns={[
            "Status",
            "Description",
            "Prepaid",
            "Quantity",
            "Price",
            "Amount",
            "Tax Code",
            "Tax Rate",
            "Tax Amt",
            "Amt + Tax",
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
            className="btn btn-primary btn-lg"
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
            "Status",
            " Length",
            " Height",
            " Width",
            " Weight",
            " Volumetric Weight",
            " Charged Weigth",
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
      <div className="company-form__options-container">
        <button
          className="company-form__option btn btn-primary"
          onClick={sendData}
        >
          Save
        </button>
        <button
          className="company-form__option btn btn-secondary"
          onClick={closeModal}
        >
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
