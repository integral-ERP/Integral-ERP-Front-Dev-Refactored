import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const GenerateReceiptPDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  console.log(barcodeImage);

  //ctx.drawImage(bwipjs.toCanvas(barcodeOptions),0 ,0);

  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;
    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128),
      text: data.number + '',
      scale: 2, // Scale factor for the barcode size
      height: 10, // Height of the barcode
    };
    try {
      // Generate the barcode as a canvas
      canvas = bwipjs.toCanvas(canvas, barcodeOptions);
      barcodeImage = canvas.toDataURL();
    } catch (error) {
      reject(error);
    }
    const commodityRows = [];
    let totalPieces = 0;
    let totalWeight = 0.0;
    let totalVolume = 0.0;
    // Loop through the commodities array and create a table row for each item
    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText = "";
      let thirdRowText = "";
      let fourthRowText = "";
      let sixthRowText = "";
      let seventhRowText = "";
      data.commodities?.forEach((commodity) => {
        firstRowText += `1; Pallet \n`;
        thirdRowText += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fourthRowText += `${commodity.description} \n`;
        sixthRowText += `${commodity.weight} lbs \n`;
        (seventhRowText += `${commodity.volumetricWeight} ft3 \n`),
          `${commodity.chargedWeight} Vlb \n`;
        totalWeight += parseFloat(commodity.weight);
        totalVolume += parseFloat(commodity.volumetricWeight);
      });
      const commodityRow = [
        {
          // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
          text: firstRowText,
          colSpan: 2,
          margin: [0, 0, 0, 200],
        },
        {},
        {
          text: thirdRowText,
        },
        {
          text: fourthRowText,
          colSpan: 2,
          margin: [0, 0, 0, 40],
        },
        {},
        {
          text: sixthRowText,
          margin: [0, 0, 0, 40],
        },
        {
          text: seventhRowText,
          margin: [0, 0, 0, 40],
        },
      ];
      commodityRows.push(commodityRow);
    }
    const chargeRows = [];

    if (data.charges) {
      data.charges.forEach((charge) => {
        if (charge.show && charge.type !== "expense") {
          // Check if the charge should be shown based on the "show" property
          console.log("CARGO", charge);
          const chargeRow = [
            {
              text: charge.type, // Display the charge type
              margin: [0, 0, 0, 0],
            },
            {
              text: charge.description,
              margin: [0, 0, 0, 0],
            },
            {
              text: `$${parseInt(charge.totalAmount)} ${charge.currency}`, // Display the totalAmount and currency
              margin: [0, 0, 0, 0],
            },
          ];
          console.log("ROW", chargeRow);
          // Add the charge row to the array
          chargeRows.push(chargeRow);
        }
      });
      console.log(chargeRows);
    }

    // Fetch the logo image dynamically
    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {
        // Convert the image blob to a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;
          // Create the PDF document with barcode

          const pdf = {
            content: [
              {
                columns: [
                  {
                    stack: [
                      {
                        image: imgUrl,
                        fit: [100, 100],
                      },
                      {
                        text: "Warehouse Receipt",
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      }
                    ],
                  },
                  {
                    stack: [
                      {
                        image: barcodeImage,
                        fit: [100, 200],
                        alignment: `right`,
                      },
                    ],
                  },
                ],
              },
              {
                columns: [
                  [
                    {}, // Empty cell for the logo image (rowspan: 2)
                  ],
                  {},
                  {
                    style: `tableExample`,
                    table: {
                      width: `*`,
                      body: [
                        [`Receipt Number`, `${data.number || ``}`],
                        [`Received Date/Time`, `${data.creation_date || ``}`],
                        [`Received By`, `${data.number || ``}`]
                      ],
                      margin: [5, 0, 5, 0],
                    },
                  },
                ],
              },
              {
                table: {
                  widths: [`15%`, `35%`, `15%`, '35%'],
                  body: [
                    [
                      {
                        text: `Shipper Information`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                      {
                        text: `Consignee Information`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {
                        text: [
                          `${
                            data.shipperObj?.data?.obj?.name || ``
                          } \n`,
                          `${
                            data.shipperObj?.data?.obj
                              ?.street_and_number || ``
                          } \n`,
                          `${
                            data.shipperObj?.data?.obj?.city || ``
                          }, ${
                            data.shipperObj?.data?.obj?.state || ``
                          } ${
                            data.shipperObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${
                            data.shipperObj?.data?.obj?.country || ``
                          }`,
                          `${
                            data.shipperObj?.phone
                              ? `Tel: ${data.shipperObj.phone}, `
                              : ``
                          }${
                            data.shipperObj?.fax
                              ? `Fax: ${data.shipperObj.fax}`
                              : ``
                          }\n`,
                        ],
                        colSpan: 2
                      },
                      {},
                      {
                        text: [
                          `${
                            data.consigneeObj?.data?.obj?.name || ``
                          } \n`,
                          `${
                            data.consigneeObj?.data?.obj
                              ?.street_and_number || ``
                          } \n`,
                          `${
                            data.consigneeObj?.data?.obj?.city || ``
                          }, ${
                            data.consigneeObj?.data?.obj?.state || ``
                          } ${
                            data.consigneeObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${
                            data.consigneeObj?.data?.obj?.country || ``
                          }`,
                          `${
                            data.consigneeObj?.phone
                              ? `Tel: ${data.consigneeObj.phone}, `
                              : ``
                          }${
                            data.consigneeObj?.fax
                              ? `Fax: ${data.consigneeObj.fax}`
                              : ``
                          }\n`,
                        ],
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {
                        text: "Inland and Supplier Information",
                        margin: [0, 0, 0, 0],
                        bold: true,
                        fillColor: `#CCCCCC`,
                        colSpan: 4,
                        alignment: "center"
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        text: `Carrier Name`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.mainCarrierObj?.name || ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Drivers License`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.driversLicense || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `PRO Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.pro_number|| ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Suppliers Name`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.mainCarrierObj?.name || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `Tracking Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.tracking_number|| ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Invoice Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.invoice_number || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `Driver Name`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.driversName|| ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `P.O Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.pro_number || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `Notes`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                      {
                        text: `Applicable Charges`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {
                        text: `${data.notes || ``}`,
                        rowSpan: 2,
                        colSpan: 2
                      },
                      {},
                      {
                        style: `tableExampleLeft`,
                        table: {
                          widths: ["28%", "40%", "32%"],
                          body: [
                            ["Type", `Description`, `Price`],
                            ...chargeRows,
                          ],
                        },
                        rowSpan: 2,
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {},
                      {},
                      {},
                      {},
                    ],
                  ],
                },
              },
              {
                table: {
                  widths: [`5%`, `10%`, `20%`, `30%`, `10%`, `10%`, `15%`],
                  body: [
                    [
                      {
                        text: `Pcs`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Package`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Dimensions`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Description`,
                        fillColor: `#CCCCCC`,
                        colSpan: 2,
                        margin: [0, 0, 0, 0],
                      },
                      {},
                      {
                        text: `Weight`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        rowSpan: 3,
                        alignment: "center"
                      },
                      {
                        text: `Volume`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        rowSpan: 3,
                        alignment: "center"
                      },
                    ],
                    [
                      {
                        text: `Location`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {
                        text: `Invoice Number`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Notes`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {},
                      {
                      },
                    ],
                    [
                      {
                        text: `Quantity`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {
                        text: `PO Number`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Part Number / Model / Serial Number`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {},
                      {
                      },
                    ],
                    ...commodityRows,
                    [
                      {
                        text: `Signature:`,
                        colSpan: 4,
                        rowSpan: 2,
                      },
                      {},
                      {},
                      {},
                      {
                        text: `Pieces`,
                      },
                      {
                        text: `Weight`,
                      },
                      {
                        text: [`volume`],
                      },
                    ],
                    [
                      {},
                      {},
                      {},
                      {},
                      {
                        text: totalPieces,
                      },
                      {
                        text: [
                          `${totalWeight} kg\n`,
                          `${(totalWeight / 2.205).toFixed(2)} lb`,
                        ],
                      },
                      {
                        text: [
                          `${totalVolume} ft3\n`,
                          `${(totalVolume / 35.315).toFixed(2)} m3`,
                        ],
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
                alignment: `right`,
                width: `100%`,
              },
              tableExampleLeft: {
                margin: [0, 0, 0, 5],
                alignment: `left`,
                width: `100%`,
              },
              tableHeader: {
                bold: true,
                fontSize: 13,
                color: `black`,
              },
            },
            defaultStyle: {
              fontSize: 10, // Set the desired font size here (e.g., 10)
            },
          };

          // Generate the PDF
          const pdfGenerator = pdfMake.createPdf(pdf);
          pdfGenerator.getBlob((blob) => {
            const pdfUrl = URL.createObjectURL(blob);
            resolve(pdfUrl);
          });
        };
        reader.readAsDataURL(imageBlob); // Read the logo image
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default GenerateReceiptPDF;
