import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts;

const GeneratePickUpPDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  

  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;
    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128)
      text: data.number + '', // Barcode data
      scale: 2, // Scale factor for the barcode size
      height: 10, // Height of the barcode
      includetext: true, // Include human-readable text below the barcode
      textxalign: "center",
    };
    try {

      canvas = bwipjs.toCanvas(canvas, barcodeOptions);
      barcodeImage = canvas.toDataURL();
    } catch (error) {
      reject(error);
    }
    const commodityRows = [];
    let totalPieces = 0;
    let totalWeight = 0.0;
    let totalVolume = 0.0;

    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText = "";
      let thirdRowText = "";
      let fourthRowText = "";
      let sixthRowText = "";
      let seventhRowText = "";
      data.commodities?.forEach((commodity, index) => {
        firstRowText += `1; Pallet \n`;
        thirdRowText += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fourthRowText += `${commodity.description} \n`;
        sixthRowText += `${commodity.weight} lbs \n`;
        (seventhRowText += `${commodity.volumetricWeight} ft3 \n`),
          `${commodity.chargedWeight} Vlb \n`;
        totalWeight += parseFloat(commodity.weight);
        totalVolume += parseFloat(commodity.volumetricWeight);

        if (commodity.containsCommodities && commodity.internalCommodities) {
          commodity.internalCommodities.forEach((internalCommodity) => {

            thirdRowText += `${internalCommodity.length}x${internalCommodity.width}x${internalCommodity.height} in \n`;
            fourthRowText += `${internalCommodity.description} \n`;
            sixthRowText += `${internalCommodity.weight} lbs \n`;
            seventhRowText += `${internalCommodity.volumetricWeight} ft3 \n`;
            totalWeight += parseFloat(internalCommodity.weight);
            totalVolume += parseFloat(internalCommodity.volumetricWeight);
          });
        }
      });
      const commodityRow = [
        {

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
          

          chargeRows.push(chargeRow);
        }
      });
      
    }


    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {

        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;


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
                        text: "Pick-up Order",
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                      {
                        text: "Land Bill of Landing",
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                    ],
                  },
                  {
                    text: [
                      `Issued By \n`,
                      `${data.issued_byObj?.name || ``} \n`,
                      `${
                        data.issued_byObj?.phone
                          ? `Tel: ${data.issued_byObj.phone}, `
                          : ``
                      }${
                        data.issued_byObj?.fax
                          ? `Fax: ${data.issued_byObj.fax}`
                          : ``
                      }\n`,
                      `${data.issued_byObj?.street_and_number || ``} \n`,
                      `${data.issued_byObj?.city || ``}, ${
                        data.issuedBy?.state || ``
                      } ${data.issued_byObj?.zip_code || ``} \n`,
                      `${data.issued_byObj?.country || ``}`,
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
                  {
                    // style: `tableExample`,
                    // table: {
                    //   width: `*`,
                    //   body: [
                    //     [`Received By:`, `${data.employeeObj?.name || ``}`],
                    //   ],
                    // },
                  },
                  {
                    // style: `tableExample`,
                    // table: {
                    //   width: `*`,
                    //   body: [[`Received Date`, `${data.creation_date || ``}`]],
                    //   margin: [5, 0, 5, 0],
                    // },
                  },
                ],
              },
              {
                columns: [
                  {
                    // style: `tableExample`,
                    table: {
                      // width: `*`,
                      body: [
                            [`Pickup Date`, `${data.pick_up_date || ``}`],
                            [`Received Date`, `${data.creation_date || ``}`],
                    ],
                    },
                    // table:{
                    //   text: [`Pickup Date`, `${data.pick_up_date || ``}`],
                    //   margin: [0, 0, 0, 0],
                    // },
                    
                  },
                  {
                    style: `tableExample`,
                    table: {
                      width: `*`,
                      body: [
                        [`Delivery Date`, `${data.delivery_date || ``}`],
                        [`Received By:`, `${data.employeeObj?.name || ``}`],
                      ],
                    },
                  },
                  {
                    style: `tableExample`,
                    table: {
                      // width: ['100%'],
                      margin: [50, 50, 50, 50],
                      body: [
                        [`Carrier`, `${data.main_carrierObj?.name || ``}`],
                      ],
                    },
                  },
                ],
              },
              {
                table: {
                  widths: [`33%`, `34%`, `33%`],
                  body: [
                    [
                      {
                        text: `Pickup Company`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Delivery Company`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `PRO Number`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                    [
                      {
                        text: `${
                          data.pickUpLocationObj?.data?.obj?.name || ``
                        }`,
                      },
                      {
                        text: `${
                          data.deliveryLocationObj?.data?.obj?.name || ``
                        }`,
                      },
                      {
                        text: `${data.pro_number || ``}`,
                      },
                    ],
                    [
                      {
                        text: [
                          `${data.pickUpLocationObj?.data?.obj?.name || ``} \n`,
                          `${
                            data.pickUpLocationObj?.data?.obj
                              ?.street_and_number || ``
                          } \n`,
                          `${data.pickUpLocationObj?.data?.obj?.city || ``}, ${
                            data.pickUpLocationObj?.data?.obj?.state || ``
                          } ${
                            data.pickUpLocationObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${data.pickUpLocationObj?.data?.obj?.country || ``}`,
                          `${
                            data.issued_byObj?.phone
                              ? `Tel: ${data.issued_byObj.phone}, `
                              : ``
                          }${
                            data.issued_byObj?.fax
                              ? `Fax: ${data.issued_byObj.fax}`
                              : ``
                          }\n`,
                        ],
                        margin: [0, 0, 0, 20],
                      },
                      {
                        text: [
                          `${
                            data.deliveryLocationObj?.data?.obj?.name || ``
                          } \n`,
                          `${
                            data.deliveryLocationObj?.data?.obj
                              ?.street_and_number || ``
                          } \n`,
                          `${
                            data.deliveryLocationObj?.data?.obj?.city || ``
                          }, ${
                            data.deliveryLocationObj?.data?.obj?.state || ``
                          } ${
                            data.deliveryLocationObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${
                            data.deliveryLocationObj?.data?.obj?.country || ``
                          }`,
                          `${
                            data.issued_byObj?.phone
                              ? `Tel: ${data.issued_byObj.phone}, `
                              : ``
                          }${
                            data.issued_byObj?.fax
                              ? `Fax: ${data.issued_byObj.fax}`
                              : ``
                          }\n`,
                        ],
                        margin: [0, 0, 0, 10],
                      },
                      {
                        text: [
                          `Tracking Number: \n`,
                          `${data.tracking_number || ``}`,
                        ],
                        margin: [0, 0, 0, 10],
                      },
                    ],
                    [
                      {
                        text: `Original Shipper Information`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Final Consignee Information`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Charges`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                    [
                      {
                        text: `${data.shipperObj?.data?.obj?.name || ``}`,
                        rowSpan: 2,
                      },
                      {
                        text: `${data.consigneeObj?.data?.obj?.name || ``}`,
                      },
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
                      },
                    ],
                    [
                      {},
                      {
                        text: `Invoice: ${data.invoice_number || ``}`,
                      },
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
                        rowSpan: 2,
                        alignment: "center"
                      },
                      {
                        text: `Volume`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        rowSpan: 2,
                        alignment: "center"
                      },
                    ],
                    [
                      {
                        text: `PO Number`,
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
                          `${totalVolume.toFixed(2)} ft3\n`,
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

export default GeneratePickUpPDF;
