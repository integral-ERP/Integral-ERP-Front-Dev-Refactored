import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts;
pdfMake.vfs = pdfFonts;


const generateLabelPDF = (data, numCon) => {
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
      data.commodities?.forEach((commodity) => {
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
          margin: [0, 0, 0, 200], //Cuadro largo
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
                        fit: [150, 150],
                      },
                      {
                      }
                    ],
                  },
                  {
                    stack: [
                      {
                        text: ` WAYBILL NUMBER\n `,
                        fontSize: 10,
                        bold: true,
                        fillColor: `red`,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                      {
                        image: barcodeImage,
                        fit: [250, 250],
                        fillColor: `#CCCCCC`,
                        alignment: `center`,
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
                        margin: [0, 0, 0, 10],
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
                        colSpan: 2
                      },
                      {},
                      {
                        text: [
                          `${data.consigneeObj?.data?.obj?.name || ``} \n`, `${data.consigneeObj?.data?.obj?.street_and_number || ``
                          } \n`,
                          `${data.consigneeObj?.data?.obj?.city || ``
                          }, ${data.consigneeObj?.data?.obj?.state || ``
                          } ${data.consigneeObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${data.consigneeObj?.data?.obj?.country || ``
                          }`,
                          `${data.consigneeObj?.phone
                            ? `Tel: ${data.consigneeObj.phone}, `
                            : ``
                          }${data.consigneeObj?.fax
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
                        text: "DESCRIPTION",
                        margin: [0, 0, 0, 10],
                        bold: true,
                        fillColor: `#CCCCCC`,
                        colSpan: 4,
                        alignment: "left"
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        text: "Here description",
                        margin: [0, 0, 0, 200],
                        colSpan: 4,
                        alignment: "left",
                      },
                      {},
                      {},
                      {}
                    ],

                    [
                      {
                        text: [`TRACKING \n`, `  Here Tracking`],
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                      {
                        text: `LOCATION \n Here location`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      // {},
                    ],
                    // [
                    // {
                    //   text: `Here Tracking`,
                    //   colSpan: 2
                    // },
                    // {},
                    // {
                    //   text: `Here location`,
                    //   colSpan: 2
                    // },
                    // {},
                    // ],
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
                        border: ['top', '', 'top', '']

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
                        border: ['top', '', 'top', '']

                      },
                    ],
                    [
                      {
                        text: ``,
                        margin: [0, 0, 0, 30],
                        border: ['top', '', 'top', 'top']

                      },
                      {
                        text: `PESO` + '  ' + 'LB',
                        bold: true,
                        alignment: `center`,
                        fontSize: 25,
                        margin: [0, 0, 0, 30],
                        border: ['top', '', 'top', 'top']

                      },
                      {
                        text: totalPieces + '/',
                        margin: [0, 0, 0, 30],
                        bold: true,
                        alignment: `center`,
                        fontSize: 40,
                        border: ['top', '', 'top', 'top']
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

export default generateLabelPDF;


