import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { useState, useEffect } from "react";
const GeneratePickUpPDF = () => {
  const [url, seturl] = useState(null);

  const createPDF = (data) => {

    
    const pdfGenerator = pdfMake.createPdf(pdf);
    pdfGenerator.getBlob((blob) => {
      const url = URL.createObjectURL(blob);
      seturl(url);
    });
  };

  useEffect(() => {
    createPDF();
  }, [])

  const pdf = {
    content: [
      {
        columns: [
          [
            { text: "PressEx Logistics", style: "header" },
            "2020 NW 129th. Ave. Ste. 201",
            "Miami, FL 33182.",
            "UNITED STATES",
          ],
          {
            width: "*",
            stack: [
              { text: "PickUp Order", style: "header", alignment: "right" },
              {
                style: "tableExample",
                table: {
                  widths: ["*", "*"], // Set all columns to take equal width
                  body: [
                    ["Pickup Number", "810001491"],
                    ["Creation Date/Time", "AUG/24/2023 02:03 PM"],
                    ["Pick-up Date/Time", "AUG/24/2023 02:03 PM"],
                    ["Delivery Date", "AUG/24/2023 02:03 PM"],
                    ["Employee", "Inland Freight"],
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        table: {
          widths: ["15%", "*", "15%", "*"],
          body: [
            [
              {
                text: "Pickup Information",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2,
              },
              {},
              {
                text: "Delivery Information",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: [
                  "PILOT FREIGHT SERVICES \n",
                  "104050 S. OAKVIEW \n",
                  "PARKWAY - STE# 400 \n",
                  "OAK VIEW, WISCONSIN 53132 \n",
                  "USA",
                ],
                margin: [0, 0, 0, 20],
                colSpan: 2,
              },
              {},
              {
                text: [
                  "PressEx Logistics, LLC \n",
                  "2020 NW 129 AVE SUITE 201 \n",
                  "MIAMI, FLORIDA 33182 \n",
                  "UNITED STATES \n",
                  "USA",
                  "Tel: (305 4567884), Fax: 786-9998847",
                ],
                margin: [0, 0, 0, 20],
                colSpan: 2,
              },
              {},
            ],
            // Rest of the rows with 4 columns each
            [
              "Shipper",
              "KRONES INC",
              "Consignee",
              "ALPLA NICARAGUA SA",
            ],
            [
              {
                text: 'Inland Carrier and Supplier Information',
                margin: [0, 0, 0, 0],
                colSpan: 4,
                bold: true,
                fillColor: "#CCCCCC",
                alignment: 'center'
              }
            ],
            [
              "Carrier Name",
              "Forward Air, INC",
              "Driver License",
              "1234198060",
            ],
            [
              "PRO Number",
              "1234198060",
              "Supplier Name",
              "ALPLA NICARAGUA SA",
            ],
            [
              "Tracking Number",
              "1234198060",
              "Invoice Number",
              "1234198060",
            ],
            [
              "Driver Name",
              "Juan Felipe Jaramillo",
              "P.O Number",
              "7000911635 - ALPLA NICARAGUA SA",
            ],
            [
              {
                text: "Notes",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2,
              },
              {},
              {
                text: "Applicable Charges",
                bold: true,
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2,
              },
              {},
            ],
            [
              {
                text: [
                  "Pickup red. 7000911635 - Alpla Nicaragua \n",
                  "SLI en el pickup order \n",
                ],
                margin: [0, 0, 0, 20],
                colSpan: 2,
              },
              {},
              {
                text: [''],
                margin: [0, 0, 0, 20],
                colSpan: 2,
              },
              {},
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
              }
            ],
            [
              {
                text: "PO Number",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
                colSpan: 2
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
                colSpan: 2
              },
              {},
              {},
              {
                text: "Volume Weight",
                fillColor: "#CCCCCC",
                margin: [0, 0, 0, 0],
              }
            ],
            [
              {
                text: [
                  "1; Pallet \n",
                ],
                colSpan: 2,
                margin: [0, 0, 0, 200],
              },
              {},
              {
                text: '48.00x32.00x48.00 in',
              },
              {
                text: 'adhesives',
                colSpan: 2,
                margin: [0, 0, 0, 40],
              },
              {},
              {
                text: '1,416.00 lb',
                margin: [0, 0, 0, 40],
              },
              {
                text: [
                  '42.67 ft3 \n',
                  '444.18 Vlb',
                ],
                margin: [0, 0, 0, 40],
              }
            ],
            [
              {
                text: 'Signature:',
                colSpan: 4,
                rowSpan: 2
              },
              {},
              {},
              {},
              {
                text: 'Pieces'
              },
              {
                text: 'Weight'
              },
              {
                text: [
                  'volume'
                ]
              }
            ],
            [
              {},
              {},
              {},
              {},
              {
                text: '1'
              },
              {
                text: ['642.29 kg\n', '1,416.00 lb']
              },
              {
                text: [
                  '42.67 ft3\n',
                  "444.18 Vlb"
                ]
              }
            ],
          ],
        },
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 0, 0, 5],
        alignment: "right",
        width: "100%"
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
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
