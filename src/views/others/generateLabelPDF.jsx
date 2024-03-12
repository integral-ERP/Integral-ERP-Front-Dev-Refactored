import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logotextcolor.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts;
pdfMake.vfs = pdfFonts;


const generateLabelPDF = (data, numCon, descrip) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();

  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;
    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128),
      text: `${data.consigneeObj?.data?.obj?.city.substring(0, 3)}` + data.number + 'P' + numCon,
      scale: 2, // Scale factor for the barcode size
      height: 20, // Height of the barcode
      includetext: true, // Include human-readable text below the barcode
      textxalign: "center",
      bold: true,
    };
    barcodeOptions.text = barcodeOptions.text.toUpperCase();
    console.log("BANDERA=", barcodeOptions.text)
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
    let fourthRowText = "";

    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText = "";
      let thirdRowText = "";
      let sixthRowText = "";
      let seventhRowText = "";
      data.commodities?.forEach((commodity) => {
        firstRowText += `1 \n`;
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
            // fourthRowText += `${internalCommodity.description} \n`;
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
          margin: [0, 0, 0, 0], //Cuadro largo
        },
        {},
        {
          text: thirdRowText,
        },
        {
          text: fourthRowText + "",
          colSpan: 2,
          margin: [0, 0, 0, 0],
        },
        {},
        {
          text: sixthRowText,
          margin: [0, 0, 0, 0],
        },
        {
          text: seventhRowText,
          margin: [0, 0, 0, 0],
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
                        fit: [500, 500],
                        colSpan: 2,
                        alignment: "right",
                        margin: [0, -20, 0, 20],
                      },
                      {                      }
                    ],
                  },
                  {
                    stack: [
                      {},
                      {},
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
                ],
              },
              {
                table: {
                  widths: [`0%`, `35%`, `35%`, '35%'],
                  body: [
                    [
                      {
                        text: `SHIPPER`,
                        bold: true,
                        // fillColor: `#CCCCCC`,
                        margin: [-10, 0, 0, 0],
                        colSpan: 1,
                        fontSize: 15,
                        alignment: `left`,
                        border: ['', 'top', 'top', 'top']

                      },
                      {
                        text: [
                          `${data.shipperObj?.data?.obj?.name || ``
                          } \n`,
                          `${data.shipperObj?.data?.obj
                            ?.street_and_number || ``
                          } \n`,
                          `${data.shipperObj?.data?.obj?.city || ``
                          }, ${data.shipperObj?.data?.obj?.state || ``
                          } ${data.shipperObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${data.shipperObj?.data?.obj?.country || ``
                          }`,
                          `${data.shipperObj?.phone
                            ? `Tel: ${data.shipperObj.phone}, `
                            : ``
                          }${data.shipperObj?.fax
                            ? `Fax: ${data.shipperObj.fax}`
                            : ``
                          }\n`,
                        ],
                        fontSize: 15,
                        colSpan: 3,
                        border: ['top', 'top', '', 'top']
                      },
                      {},

                      {},
                    ],
                    [
                      {
                        text: `CONSIGNEE`,
                        margin: [-10, 0, 0, 0],
                        bold: true,
                        colSpan: 1,
                        rowSpan: 2,                      
                        fontSize: 15,
                        border: ['', 'top', 'top', 'top']
                      },

                      {
                        text: [
                          `${data.consigneeObj?.data?.obj?.name || ``} \n`, 
                          `${data.consigneeObj?.data?.obj?.street_and_number || ``} \n`,
                          `${data.consigneeObj?.data?.obj?.zip_code || ``} \n`,
                          `${data.consigneeObj?.phone? `Tel: ${data.consigneeObj.phone}, `: ``}
                           ${data.consigneeObj?.fax? `Fax: ${data.consigneeObj.fax}`: ``}\n`,
                        ],
                        colSpan: 3,
                        fontSize: 15,
                        border: ['top', 'top', '', 'top']
                      },
                      {
                      },
                      
                    ],
                    [
                      {
                      },

                      {
                        text: [
                          `${data.consigneeObj?.data?.obj?.city || ``}, 
                           ${data.consigneeObj?.data?.obj?.state || ``}`,,
                        ],
                        colSpan: 2,
                        fontSize: 20,
                        bold: true,
                      },
                      {
                      },
                      {
                        text: [
                              `${data.consigneeObj?.data?.obj?.country || ``
                          }`],
                        fontSize: 20,
                        bold: true,
                      },
                      
                    ],
                     [
                      {
                        text: `WATBILL NUMBER`,
                        alignment: `left`,
                        colSpan: 4,
                        border: ['', 'top', '', '']
                      },
                      {},
                      {}
                    ],
                    [
                      {
                        image: barcodeImage,
                        // fit: [300, 150],
                        alignment: `center`,
                        colSpan: 4,
                        border: ['', '', '', 'top']
                      },
                      {},
                      {}
                    ],
                    [
                      {
                        text: `DESCRIPTION`,
                        margin: [0, 0, 0, 0],
                        colSpan: 4,
                        alignment: "left",
                        border: ['', '', '', '']
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        text: `${descrip}`,
                        margin: [0, 0, 0, 80],
                        colSpan: 4,
                        alignment: "left",
                        border: ['', '', '', '']
                      },
                      {},
                      {},
                      {}
                    ],

                    [
                      {
                        text: [`TRACKING \n`, `  Here Tracking`],
                        bold: true,
                        alignment: `center`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                        border: ['', '', '', 'top'],
                      },
                      {},
                      {
                        text: `LOCATION \n Here location`,
                        bold: true,
                        // fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        alignment: `center`,
                        colSpan: 2,
                        border: ['', '', '', 'top'],
                      },
                      // {},
                    ],
                  ],
                },
              },
              {
                table: {
                  widths: [`33%`, `34%`, `33%`],
                  body: [
                    [
                      {
                        text: `COLLECT COD`,
                        bold: true,
                        // margin: [0, 0, 0, 0],
                        border: ['', '', 'top', '']

                      },
                      {
                        text: `TOTAL WEIGHT`,
                        bold: true,
                        // margin: [0, 0, 0, 0],
                        border: ['top', '', 'top', '']

                      },
                      {
                        text: `PIECES`,
                        bold: true,
                        // margin: [0, 0, 0, 0],
                        border: ['top', '', '', '']

                      },
                    ],
                    [
                      {
                        text: ``,
                        margin: [0, 0, 0, 30],
                        border: ['', '', 'top', '']

                      },
                      {
                        // text: `PESO` + '  ' + 'LB',
                        text: `${(totalWeight / 2.205).toFixed(2)} LB`,
                        bold: true,
                        alignment: `center`,
                        fontSize: 25,
                        margin: [0, 0, 0, 20],
                        border: ['top', '', 'top', '']

                      },
                      {
                        text: numCon + '/' + totalPieces,
                        margin: [0, 0, 0, 20],
                        bold: true,
                        alignment: `center`,
                        fontSize: 40,
                        border: ['top', '', '', '']
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
                margin: [0, 0, 0, 0],
              },
              subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 0],
              },
              tableExample: {
                margin: [0, 0, 0, 0],
                alignment: `right`,
                width: `150%`,
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

export default generateLabelPDF;