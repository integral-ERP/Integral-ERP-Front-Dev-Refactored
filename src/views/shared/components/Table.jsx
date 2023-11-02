import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toXML } from "jstoxml";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import "../../../styles/components/Table.scss";
import generatePickUpPDF from "../../others/GeneratePickUpPDF";
import GenerateReceiptPDF from "../../others/GenerateReceiptPDF";
import GenerateReleasePDF from "../../others/GenerateReleasePDF";
const Table = ({
  data,
  columns,
  onSelect,
  selectedRow,
  onDelete,
  onEdit,
  onAdd,
  title,
  showOptions,
  handleContextMenu,
  showContextMenu,
  contextMenuPosition,
  setShowContextMenu,
  handleOptionClick,
  onInspect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [columnOrder, setColumnOrder] = useState(columns);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setstartDate] = useState("");
  const [finishDate, setfinishDate] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const navigate = useNavigate();
  const currentDate = new Date();
  const startOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  );
  const endOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (6 - currentDate.getDay())
  );
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initialVisibility = {};
    columns.forEach((columnName) => {
      initialVisibility[columnName] = true;
    });
    return initialVisibility;
  });
  const columnNameToProperty = {
    Name: "name",
    Phone: "phone",
    "Mobile Phone": "movelPhone",
    Email: "email",
    Fax: "fax",
    Website: "webSide",
    "Reference Number": "referentNumber",
    "Contact First Name": "firstNameContac",
    "Contact Last Name": "lasNameContac",
    ID: "numIdentification",
    "Type ID": "typeIdentificacion",
    "Street & Number": "street_and_number",
    City: "city",
    State: "state",
    Country: "country",
    "Zip-Code": "zip_code",
    "Parent Account": "parentAccount",
    "Carrier Type": "carrierType",
    "Method Code": "methodCode",
    "Carrier Code": "carrierCode",
    "SCAC Number": "scacNumber",
    "IATA Code": "iataCode",
    "Airline Code": "airlineCode",
    "Airline Prefix": "airlinePrefix",
    "Airway Bill Numbers": "airwayBillNumbers",
    "Passenger Only Airline": "passengerOnlyAirline",
    Status: "status",
    Type: "type",
    Number: "number",
    Date: "creation_date",
    "Ship Date": "pick_up_date",
    "Delivery Date": "delivery_date",
    "Pickup Name": "pickUpLocationObj.data.obj.name",
    "Pickup Address": "pickUpLocationObj.data.obj.street_and_number",
    "Delivery Name": "deliveryLocationObj.data.obj.name",
    "Delivery Address": "deliveryLocationObj.data.obj.street_and_number",
    Pieces: "commodities.length",
    "Pickup Orders": "",
    "Carrier Name": "main_carrierObj.name",
    "Carrier Address": "main_carrierObj.street_and_number",
    Weight: "",
    Volume: "",
    Carrier: "",
    "Main Carrier Key": "",
    "Inland Carrier Key": "",
    "PRO Number": "pro_number",
    "Tracking Number": "tracking_number",
    "": "",
    "Invoice Number": "invoice_number",
    "Purchase Order number": "purchase_order_number",
    Description: "description",
    Prepaid: "prepaid",
    Quantity: "quantity",
    Price: "totalAmount",
    Amount: "amount",
    "Tax Code": "taxCode",
    "Tax Rate": "taxRate",
    "Tax Amt": "taxAMT",
    "Amt + Tax": "amtTAX",
    Currency: "currency",
    " Length": "length",
    " Height": "height",
    " Weight": "weight",
    " Width": "width",
    " Volumetric Weight": "volumetricWeight",
    " Chargeable Weight": "chargedWeight",
    Note: "note",
    "Account Number": "accountNumber",
    Code: "code",
    "Release Date": "release_date",
    "Released to": "releasedToObj.data.obj.name",
  };

  const handleSearch = (row) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const searchMatch = Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(lowerCaseSearchQuery)
    );
    let dateMatch = false;
    const dateColumn = selectedDateFilter;
    if (dateColumn && dateColumn in columnNameToProperty) {
      const propertyName = columnNameToProperty[dateColumn];
      const rowDate = new Date(row[propertyName]);
      switch (dateFilter) {
        case "all":
          dateMatch = true;
          break;
        case "today":
          dateMatch = rowDate.toDateString() === currentDate.toDateString();
          break;
        case "this-week":
          dateMatch = rowDate >= startOfWeek && rowDate <= endOfWeek;
          break;
        case "this-month":
          dateMatch =
            rowDate.getMonth() === currentDate.getMonth() &&
            rowDate.getFullYear() === currentDate.getFullYear();
          break;
        case "this-year":
          dateMatch = rowDate.getFullYear() === currentDate.getFullYear();
          break;
        case "between":
          console.log(
            "start Date",
            startDate,
            "finish date",
            finishDate,
            "applies?",
            rowDate >= startDate && rowDate <= finishDate,
            rowDate
          );
          dateMatch =
            rowDate >= new Date(startDate) && rowDate <= new Date(finishDate);
          break;
        default:
          dateMatch = true; // "all" or unknown filter, include all rows
          break;
      }
      return searchMatch && dateMatch;
    } else {
      dateMatch = true;
    }

    return searchMatch && dateMatch;
  };
  const filteredData = data.filter((row) => handleSearch(row));

  const generatePDF = () => {
    generatePickUpPDF(selectedRow)
      .then((pdfUrl) => {
        // Now you have the PDF URL, you can use it as needed
        window.open(pdfUrl, "_blank");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const generatePDFReceipt = () => {
    GenerateReceiptPDF(selectedRow)
      .then((pdfUrl) => {
        // Now you have the PDF URL, you can use it as needed
        window.open(pdfUrl, "_blank");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const generatePDFRelease = () => {
    GenerateReleasePDF(selectedRow)
      .then((pdfUrl) => {
        // Now you have the PDF URL, you can use it as needed
        window.open(pdfUrl, "_blank");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const handleColumnVisibilityChange = (columnName) => {
    setVisibleColumns((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleExport = () => {
    if (selectedFormat === "csv") {
      const csv = Papa.unparse(filteredData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "table_data.csv");
    } else if (selectedFormat === "json") {
      const json = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      saveAs(blob, "table_data.json");
    } else if (selectedFormat === "pdf") {
      const pdf = new jsPDF();
      pdf.text(title, 10, 10);

      filteredData.forEach((row, rowIndex) => {
        const y = 20 + (rowIndex + 1) * 10;
        const rowData = Object.values(row)
          .map((value) => value.toString())
          .join(", ");
        pdf.text(rowData, 10, y);
      });

      pdf.save("table_data.pdf");
    } else if (selectedFormat === "xml") {
      const xml = toXML({ rows: filteredData }, { header: true });
      const blob = new Blob([xml], { type: "application/xml" });
      saveAs(blob, "table_data.xml");
    }
  };

  const xmlToJs = (xml) => {
    const result = {};

    if (xml.nodeType === 1) {
      // Element node
      if (xml.attributes.length > 0) {
        result["@attributes"] = {};
        for (let i = 0; i < xml.attributes.length; i++) {
          const attribute = xml.attributes[i];
          result["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      // Text node
      result["#text"] = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes[i];
        const nodeName = item.nodeName;

        if (typeof result[nodeName] === "undefined") {
          result[nodeName] = xmlToJs(item);
        } else {
          if (typeof result[nodeName].push === "undefined") {
            const old = result[nodeName];
            result[nodeName] = [];
            result[nodeName].push(old);
          }
          result[nodeName].push(xmlToJs(item));
        }
      }
    }

    return result;
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const fileType = file.name.split(".").pop().toLowerCase();

      if (fileType === "json") {
        try {
          const importedData = JSON.parse(content);
          // Send the imported data to your API
          // Example: axios.post(`${BASE_URL}import/`, importedData)
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      } else if (fileType === "csv") {
        try {
          const importedData = Papa.parse(content, { header: true }).data;
          // Send the imported data to your API
          // Example: axios.post(`${BASE_URL}import/`, importedData)
        } catch (error) {
          console.error("Error parsing CSV file:", error);
        }
      } else if (fileType === "xml") {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, "text/xml");
          const importedData = xmlToJs(xmlDoc);
          // Send the imported data to your API
          // Example: axios.post(`${BASE_URL}import/`, importedData)
        } catch (error) {
          console.error("Error parsing XML file:", error);
        }
      } else {
        console.log("Unsupported file format");
      }
    };
    reader.readAsText(file);
  };

  const handleDragStart = (e, columnIndex) => {
    // Capture the dragged column's index
    e.dataTransfer.setData("text/plain", columnIndex);
  };

  const handleDragOver = (e) => {
    // Prevent the default behavior to allow dropping
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnIndex) => {
    // Get the dragged column's index
    const sourceColumnIndex = parseInt(
      e.dataTransfer.getData("text/plain"),
      10
    );

    // Create a new column order array with the columns rearranged
    const newColumnOrder = [...columnOrder];

    // Remove the dragged column from its source position
    const [draggedColumn] = newColumnOrder.splice(sourceColumnIndex, 1);

    // Insert the dragged column at the target position
    newColumnOrder.splice(targetColumnIndex, 0, draggedColumn);

    // Update the state with the new column order
    setColumnOrder(newColumnOrder);
  };

  function getPropertyValue(obj, propertyName) {
    const parts = propertyName ? propertyName.split(".") : [];
    let value = obj;
    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        value = undefined; // Property not found or object structure is not as expected
        break;
      }
    }
    return value;
  }

  // Function to get the value from a row for a given column name
  const getCellValue = (row, columnName) => {
    if (columnName === "Delete") {
      return <i className="fas fa-trash" onClick={elementDelete}></i>; // Handle special columns as needed
    }

    if (columnName === "View PDF" || columnName === "View Receipt PDF") {
      return <i className="fas fa-file-pdf"></i>; // Handle special columns as needed
    }

    // Check if columnNameToProperty contains a "." indicating a nested property
    if (columnNameToProperty[columnName]?.includes(".")) {
      return getPropertyValue(row, columnNameToProperty[columnName]);
    } else {
      return row[columnNameToProperty[columnName]];
    }
  };

  // Function to calculate the width needed to display a text
  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "14px Arial"; // You can adjust the font size and font family as needed
    const textMetrics = context.measureText(text);
    return textMetrics.width;
  };

  // Calculate the maximum width needed for each column
  const columnWidthsCalculated = columns.reduce((widths, columnName) => {
    const maxColumnWidth = Math.max(
      ...filteredData.map((row) => {
        const value =
          columnName === "Delete"
            ? "" // Handle special columns as needed
            : getCellValue(row, columnName);

        // Calculate the width needed for the current cell
        const cellWidth = getTextWidth(value);

        return cellWidth;
      })
    );

    // Use a minimum width (e.g., 100 pixels) to prevent columns from being too narrow
    widths[columnName] = Math.max(maxColumnWidth, 100);

    return widths;
  }, {});

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
  };

  const handleDateFilterChange = (value) => {
    setSelectedDateFilter(value);
  };

  return (
    <>
      {showOptions && (
        <div className="header-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left fa-3x"></i>
          </button>
          <div className="title-container">
            <h1 className="title">{title}</h1>
          </div>
          <div className="export-dropdown">
            <label className="laver-export">
              <span className="text-export">Export Format:</span>
              <select value={selectedFormat} onChange={handleFormatChange}>
                <option value="">Select Format</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
                <option value="xml">XML</option>
              </select>
            </label>
            <button className="generic-button" onClick={handleExport}>
              <i className="fas fa-file-export menu-icon fa-3x"></i>
            </button>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="button-container">
          <div className="action-buttons">
            <button className="generic-button" onClick={onAdd}>
              <i className="fas fa-plus menu-icon fa-3x"></i>
            </button>

            <button className="generic-button ne" onClick={onEdit}>
              <i className="fas fa-pencil-alt menu-icon fa-3x ne"></i>
            </button>
            <button className="generic-button ne" onClick={onDelete}>
              <i className="fas fa-trash-alt menu-icon fa-3x ne"></i>
            </button>

            <input
              type="file"
              accept=".json, .csv, .xml"
              onChange={handleImport}
              className="hidden-input"
              id="import-input"
            />
            <button className="generic-button ne" onClick={onDelete}>
              <i
                className="fas fa-upload menu-icon fa-3x"
                onClick={() => document.getElementById("import-input").click()}
              ></i>
            </button>
          </div>
          <div className="position-search">
            <div className="search">
              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="search-input"
                />
              </div>
              {showFilterMenu && (
                <div
                  className="modal"
                  style={{ display: showFilterMenu ? "block" : "none" }}
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Filter Dates</h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => setShowFilterMenu(!showFilterMenu)}
                        >
                          <span aria-hidden="true"></span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="date-filter">
                          <label>Date Filter:</label>
                          <div className="date-range">
                            <label>Start Date:</label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setstartDate(e.target.value)}
                            />
                          </div>
                          <div className="date-range">
                            <label>End Date:</label>
                            <input
                              type="date"
                              value={finishDate}
                              onChange={(e) => setfinishDate(e.target.value)}
                            />
                          </div>
                          <select
                            value={dateFilter}
                            onChange={(e) => handleDateFilter(e.target.value)}
                            style={{ margin: "5px" }}
                          >
                            <option value="all">All</option>
                            <option value="today">Today</option>
                            <option value="this-week">This Week</option>
                            <option value="this-month">This Month</option>
                            <option value="this-year">This Year</option>
                          </select>
                          <div
                            className="radio-container"
                            style={{ display: "flex", width: "250px" }}
                          >
                            {columns.map(
                              (columnName) =>
                                columnName.toLowerCase().includes("date") && (
                                  <label key={columnName}>
                                    <input
                                      type="radio"
                                      value={columnName}
                                      checked={
                                        selectedDateFilter === columnName
                                      }
                                      onChange={(e) =>
                                        handleDateFilterChange(e.target.value)
                                      }
                                    />
                                    {columnName}
                                  </label>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setShowFilterMenu(!showFilterMenu);
                          }}
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          onClick={() => setShowFilterMenu(!showFilterMenu)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <button
                className="generic-button"
                onClick={() => setShowColumnMenu(!showColumnMenu)}
              >
                <i className="fas fa-eye menu-icon fa-3x ne"></i>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="generic-button"
            >
              <i className="fas fa-filter menu-icon fa-3x ne"></i>
            </button>
            {showColumnMenu && (
              <div
                className="modal"
                style={{ display: showColumnMenu ? "block" : "none" }}
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Show Columns</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                      >
                        <span aria-hidden="true"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {columns.map((columnName) => (
                        <label key={columnName}>
                          <input
                            type="checkbox"
                            checked={visibleColumns[columnName]}
                            onChange={() =>
                              handleColumnVisibilityChange(columnName)
                            }
                          />
                          {columnName}
                        </label>
                      ))}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="generic-table">
        <table className="table-hover ">
          <thead className="text-head">
            <tr>
              {columnOrder.map(
                (columnName, columnIndex) =>
                  visibleColumns[columnName] && (
                    <th
                      className="th-separate"
                      key={columnName}
                      draggable
                      onDragStart={(e) => handleDragStart(e, columnIndex)}
                      onDragOver={(e) => handleDragOver(e, columnIndex)}
                      onDrop={(e) => handleDrop(e, columnIndex)}
                    >
                      {columnName}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className={`table-row  tr-margen${
                  selectedRow && selectedRow.id === row.id
                    ? "table-primary"
                    : ""
                }`}
                onClick={() => onSelect(row)}
                onContextMenu={(e) => handleContextMenu(e, row)}
              >
                {columnOrder.map((columnName) =>
                  visibleColumns[columnName] ? (
                    <td
                      key={columnName}
                      data-key={row.id}
                      className="generic-table__td"
                      style={{
                        minWidth: columnWidthsCalculated[columnName],
                        whiteSpace: "nowrap",
                      }}
                    >
                      {columnName === "View PDF" ? (
                        <button type="button" onClick={generatePDF}>
                          <i className="fas fa-file-pdf"></i>
                        </button>
                      ) : columnName === "View Receipt PDF" ? (
                        <button type="button" onClick={generatePDFReceipt}>
                          <i className="fas fa-file-pdf"></i>
                        </button>
                      ) : columnName === "View Release PDF" ? (
                        <button type="button" onClick={generatePDFRelease}>
                          <i className="fas fa-file-pdf"></i>
                        </button>
                      ) : columnName === "Options" ? (
                        <>
                          <button type="button" onClick={onDelete}>
                          <i className="fas fa-trash"></i>
                          </button>
                          <button type="button" onClick={onEdit}>
                          <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button type="button" onClick={onInspect}>
                          <i className="fas fa-eye"></i>
                          </button>
                        </>
                      ) : typeof columnNameToProperty[columnName] ===
                        "boolean" ? (
                        row[columnNameToProperty[columnName]] ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <i className="fas fa-times"></i>
                        )
                      ) : columnNameToProperty[columnName]?.includes(".") ? (
                        getPropertyValue(row, columnNameToProperty[columnName])
                      ) : Array.isArray(
                          row[columnNameToProperty[columnName]]
                        ) ? (
                        row[columnNameToProperty[columnName]].join(", ") // Convert array to comma-separated string
                      ) : (
                        row[columnNameToProperty[columnName]]
                      )}
                    </td>
                  ) : null
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showContextMenu && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <ul>
            <li onClick={() => handleOptionClick("Option 1")}>
              Create Warehouse Receipt
            </li>
            <li onClick={() => handleOptionClick("Option 1")}>
              Create Warehouse Receipt
            </li>
            <li onClick={() => handleOptionClick("Option 1")}>
              Create Warehouse Receipt
            </li>
          </ul>
          {/* ... */}
        </div>
      )}
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  selectedRow: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  title: PropTypes.string,
  showOptions: PropTypes.bool,
};

Table.defaultProps = {
  data: [],
  columns: [],
  onSelect: null,
  selectedRow: null,
  onDelete: null,
  onEdit: null,
  onAdd: null,
  title: "Table",
  showOptions: true,
};

export default Table;
