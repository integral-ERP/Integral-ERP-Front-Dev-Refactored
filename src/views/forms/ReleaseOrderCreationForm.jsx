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
  const [formDataUpdated, setFormDataUpdated] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [allStateUpdatesComplete, setAllStateUpdatesComplete] = useState(false);
  const [issuedByOptions, setIssuedByOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [releasedToOptions, setReleasedToOptions] = useState([]);
  const [clientToBill, setClientToBill] = useState(null);
  const today = dayjs().format("YYYY-MM-DD");
  const pickupNumber = currentReleaseNumber + 1;
  const [canRender, setcanRender] = useState(false);
  const [commodities, setcommodities] = useState([]);

  const formFormat = {
    status: 3,
    number: 0,
    creation_date: today,
    release_date: today,
    employeeId: "",
    issuedById: "",
    issuedByType: "",
    releasedToId: "",
    releasodToType: "",
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
    if(type === "customer"){
        result = await CustomerService.getCustomerById(id);
    }
    if(type === "vendor"){
        result = await VendorService.getVendorByID(id);
    }
    if(type === "agent"){
        result = await ForwardingAgentService.getForwardingAgentById(id);
    }
    if(type === "carrier"){
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
      releasodToType: type
    });
  }

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
        releasedToId: releaseOrder.releasedToId,
        releasodToType: releaseOrder.releasodToType,
        clientToBillId: releaseOrder.clientToBillId,
        clientToBillType: releaseOrder.clientToBillId,
        warehouseReceiptId: releaseOrder.releasedToId,
        status: releaseOrder.status,
        number: releaseOrder.number,
        creation_date: releaseOrder.creation_date,
        release_date: releaseOrder.release_date,
        issuedById: releaseOrder.issued_by,
        issuedByType: releaseOrder.issued_by?.type,
        destinationAgentId: releaseOrder.destination_agent,
        employeeId: releaseOrder.employee,
        pro_number: releaseOrder.pro_number,
        tracking_number: releaseOrder.tracking_number,
        carrierId: releaseOrder.main_carrier,
        purchase_order_number: releaseOrder.purchase_order_number,
        commodities: releaseOrder.commodities,
        releasedToInfo: `${
          releaseOrder.releasedToObj?.data?.obj?.street_and_number || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.city || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.state || ""
        } - ${releaseOrder.releasedToObj?.data?.obj?.country || ""} - ${
          releaseOrder.releasedToObj?.data?.obj?.zip_code || ""
        }`,
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

  useEffect(() => {
    if (creating) {
      fetchFormData();
    }
  }, []);

  useEffect(() => {
    if (creating) {
      setFormData({ ...formData, number: pickupNumber });
    }
  }, [pickupNumber]);

  const sendData = async () => {
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

      const response = await ReleaseService.createClientToBill(clientToBill);
      if (response.status === 201) {
        console.log("CLIENT TO BILL ID", response.data.id);
        setClientToBill(response.data.id);
      }
    }
  };

  const checkUpdatesComplete = () => {
    if (clientToBill !== null) {
      setAllStateUpdatesComplete(true);
    }
  };

  useEffect(() => {
    checkUpdatesComplete();
    if (allStateUpdatesComplete) {
      const createPickUp = async () => {
        let rawData = {
          status: formData.status,
          number: formData.number,
          creation_date: formData.creation_date,
          release_date: formData.release_date,
          employeeId: formData.employeeId,
          issuedById: formData.issuedById,
          issuedByType: formData.issuedByType,
          releasedToId: formData.releasedToId,
          releasodToType: formData.releasodToType,
          clientToBillId: formData.clientToBillId,
          clientToBillType: formData.clientToBillType,
          carrierId: formData.carrierId,
          pro_number: formData.pro_number,
          tracking_number: formData.tracking_number,
          purchase_order_number: formData.purchase_order_number,
          warehouseReceiptId: formData.warehouseReceiptId,
          commodities: formData.commodities,
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
          }, 5000);
        } else {
          console.log("Something went wrong:", response);
          setShowErrorAlert(true);
        }
      };
      createPickUp();
    }
  }, [allStateUpdatesComplete, clientToBill]);

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
            href="#cargo"
            aria-selected={activeTab === "cargo"}
            onClick={() => setActiveTab("cargo")}
            tabIndex="-1"
            role="tab"
          >
            Cargo
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
                label="Release Number"
              />
            </div>
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
            <div className="company-form__section">
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
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                )
              ) : (
                <AsyncSelect
                  id="destinationAgent"
                  onChange={(e) => {
                    handleReleasedToSelection(e);
                  }}
                  value={releasedToOptions.find(
                    (option) => option.id === formData.destinationAgentId
                  )}
                  isClearable={true}
                  defaultOptions={releasedToOptions}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />
              )}
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
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
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
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            <div className="company-form__section">
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
          </div>
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
            <div className="company-form__section">
              <Input
                type="text"
                inputName="purchaseOrderNumber"
                placeholder="Purchase Order Number..."
                value={formData.purchase_order_number}
                changeHandler={(e) =>
                  setFormData({ ...formData, purchase_order_number: e.target.value })
                }
                label="Purchase Order Number"
              />
            </div>
          </div>
        </div>
      </form>
      <form
        className={`tab-pane fade ${
          activeTab === "cargo" ? "show active" : ""
        } company-form__general-form`}
        id="cargo"
        style={{ display: activeTab === "cargo" ? "block" : "none" }}
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
            Error {creating ? "creating" : "updating"} Release Order. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

export default ReleaseOrderCreationForm;
