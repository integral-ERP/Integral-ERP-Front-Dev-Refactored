import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { useState, useEffect } from "react";
import logo from "../../img/logo.png";
import barcode from "../../img/bars.png";
const GeneratePickUpPDF = () => {
  const [url, seturl] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [barcodeUrl, setbarcodeUrl] = useState(null);

  useEffect(() => {
    // Fetch the logo image dynamically
    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {
        // Convert the image blob to a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataURL = event.target.result;
          setImgUrl(dataURL);
        };
        reader.readAsDataURL(imageBlob);
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });

    fetch(barcode)
      .then((response) => response.blob())
      .then((imageBlob) => {
        // Convert the image blob to a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataURL = event.target.result;
          setbarcodeUrl(dataURL);
        };
        reader.readAsDataURL(imageBlob);
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });
  }, []);

  useEffect(() => {
    if (imgUrl && barcodeUrl) {
      // Once the image data URL is available, create the PDF
      const pdfGenerator = pdfMake.createPdf(pdf);
      pdfGenerator.getBlob((blob) => {
        const pdfUrl = URL.createObjectURL(blob);
        seturl(pdfUrl);
      });
    }
  }, [imgUrl, barcodeUrl]);

  const pdf = {
    content: [
      {
        columns: [
          [{ image: imgUrl, fit: [100, 100] }],
          {
            text: [
              "Issued By \n",
              "PressEx Logistics \n",
              "Tel: (305)4567884, Fax: 786-9998847 \n",
              "2020 NW 129 AVE SUITE 201 \n",
              "MIAMI, FLORIDA 33182 \n",
              "UNITED STATES",
            ],
          },
          {
            stack: [
              { image: barcodeUrl, fit: [100, 200], alignment: "right" },
              { text: "8000325", bold: true, alignment: "right", fontSize: 20 },
            ],
          },
        ],
      },
      {
        columns: [
          [
            {}, // Empty cell for the logo image (rowspan: 2)
          ],
          {
            style: "tableExample",
            table: {
              width: "*",
              body: [["Received By:", "Juan Felipe Jaramillo"]],
            },
          },
          {
            style: "tableExample",
            table: {
              width: "*",
              body: [["Received Date", "09/15/2023"]],
              margin: [5, 0, 5, 0],
            },
          },
        ],
      },
      {
        columns: [
          {
            style: "tableExample",
            table: {
              width: "*",
              body: [["Pickup Date", "09/15/2023"]],
            },
          },
          {
            style: "tableExample",
            table: {
              width: "*",
              body: [["Delivery Date", "09/15/2023"]],
            },
          },
          {
            style: "tableExample",
            table: {
              width: "*",
              body: [["Carrier", "Forward Air, INC"]],
            },
          },
        ],
      },
      {
        table: {
          widths: ["33%", "33%", "33%"],
          body: [
            [
              {
                text: "Pickup Company",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Delivery Company",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "PRO Number",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
            ],
            [
              {
                text: "Krones INC.",
              },
              {
                text: "ALPLA NICARAGUA SA",
              },
              {
                text: "7000911635 - ALPLA NICARAGUA SA",
              },
            ],
            [
              {
                text: [
                  "PILOT FREIGHT SERVICES \n",
                  "104050 S. OAKVIEW \n",
                  "PARKWAY - STE# 400 \n",
                  "OAK VIEW, WISCONSIN 53132 \n",
                  "USA \n\n",
                  "Tel: (305 4567884), Fax: 786-9998847",
                ],
                margin: [0, 0, 0, 20],
              },
              {
                text: [
                  "PressEx Logistics, LLC \n",
                  "2020 NW 129 AVE SUITE 201 \n",
                  "MIAMI, FLORIDA 33182 \n",
                  "UNITED STATES \n",
                  "USA \n\n",
                  "Tel: (305 4567884), Fax: 786-9998847",
                ],
                margin: [0, 0, 0, 10],
              },
              {
                text: ["Tracking Number: \n", "700106746441"],
                margin: [0, 0, 0, 10],
              },
            ],
            [
              {
                text: "Original Shipper Information",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Final Consignee Information",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Supplier Information",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
            ],
            [
              {
                text: "Original Shipper Name.",
              },
              {
                text: "Final Consignee Name",
              },
              {
                text: "Supplier Name",
              },
            ],
            [
              {
                text: "Driver: Juan Felipe Jaramillo.",
              },
              {
                text: "Invoice: 700106746441",
              },
              {
                style: "tableExample",
                table: {
                  width: "100%",
                  body: [
                    ["Description", "Price"],
                    ["Delivery", "50"],
                    ["Taxes", "25"],
                  ],
                },
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ["5%", "10%", "20%", "30%", "10%", "10%", "15%"],
          body: [
            [
              {
                text: "Pcs",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Package",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Dimensions",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Description",
                fillColor: "#CCCCCC",
                colSpan: 2,
                margin: [0, 0, 0, 0],
              },
              {},
              {
                text: "Weight",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Volume",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
            ],
            [
              {
                text: "PO Number",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2,
              },
              {},
              {
                text: "Invoice Number",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
              {
                text: "Notes",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2,
              },
              {},
              {},
              {
                text: "Volume Weight",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              },
            ],
            [
              {
                text: ["1; Pallet \n"],
                colSpan: 2,
                margin: [0, 0, 0, 200],
              },
              {},
              {
                text: "48.00x32.00x48.00 in",
              },
              {
                text: "adhesives",
                colSpan: 2,
                margin: [0, 0, 0, 40],
              },
              {},
              {
                text: "1,416.00 lb",
                margin: [0, 0, 0, 40],
              },
              {
                text: ["42.67 ft3 \n", "444.18 Vlb"],
                margin: [0, 0, 0, 40],
              },
            ],
            [
              {
                text: "Signature:",
                colSpan: 4,
                rowSpan: 2,
              },
              {},
              {},
              {},
              {
                text: "Pieces",
              },
              {
                text: "Weight",
              },
              {
                text: ["volume"],
              },
            ],
            [
              {},
              {},
              {},
              {},
              {
                text: "1",
              },
              {
                text: ["642.29 kg\n", "1,416.00 lb"],
              },
              {
                text: ["42.67 ft3\n", "444.18 Vlb"],
              },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 0, 0, 5],
        alignment: "right",
        width: "100%",
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
    defaultStyle: {
      fontSize: 10, // Set the desired font size here (e.g., 10)
    },
  };

  return (
    <>
      <div>
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            GO TO PDF
          </a>
        )}
      </div>
    </>
  );
};

export default GeneratePickUpPDF;
