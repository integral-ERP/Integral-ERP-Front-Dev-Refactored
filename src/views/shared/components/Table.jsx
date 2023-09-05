import { useState } from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toXML } from "jstoxml";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import "../../../styles/components/Table.scss";
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
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [columnOrder, setColumnOrder] = useState(columns);
  const navigate = useNavigate();
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
    "Street & Number": "streetNumber",
    City: "city",
    State: "state",
    Country: "country",
    "Zip-Code": "zipCode",
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
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleSearch = (row) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(lowerCaseSearchQuery)
    );
  };

  const filteredData = data.filter((row) => handleSearch(row));

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
          console.log("Imported JSON data:", importedData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      } else if (fileType === "csv") {
        try {
          const importedData = Papa.parse(content, { header: true }).data;
          // Send the imported data to your API
          // Example: axios.post(`${BASE_URL}import/`, importedData)
          console.log("Imported CSV data:", importedData);
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
          console.log("Imported XML data:", importedData);
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

  const handleDragOver = (e, columnIndex) => {
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
        </div>
      )}

      {showOptions && (
        <div className="button-container">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="search-input"
            />
          </div>
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

            <div className="export-dropdown">
              <label>
                Export Format:
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
        </div>
      )}
      <div className="generic-table">
        <table className="table table-hover">
          <thead>
            <tr>
              {columnOrder.map((columnName, columnIndex) => (
                <th
                  key={columnName}
                  draggable
                  onDragStart={(e) => handleDragStart(e, columnIndex)}
                  onDragOver={(e) => handleDragOver(e, columnIndex)}
                  onDrop={(e) => handleDrop(e, columnIndex)}
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`table-row ${
                  selectedRow && selectedRow.id === row.id
                    ? "table-primary"
                    : ""
                }`}
                onClick={() => {
                  onSelect(row);
                }}
              >
                {columnOrder.map((columnName) => (
                  <td key={columnName} className="generic-table__td">
                    {typeof row[columnNameToProperty[columnName]] ===
                    "boolean" ? (
                      row[columnNameToProperty[columnName]] ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <i className="fas fa-times"></i>
                      )
                    ) : (
                      row[columnNameToProperty[columnName]]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
