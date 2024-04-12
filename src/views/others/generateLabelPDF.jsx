import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logotextcolor from "../../img/logotextcolor.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts;
pdfMake.vfs = pdfFonts;

const GenerateReceiptPDF = (data, numCon) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();

  const country  =  data.consigneeObj?.data?.obj?.country?.toUpperCase();
  const cantidadPaquete = data.commodities.length;
  const location =  data.commodities[0].locationCode;
  const serialID =  data.commodities[0].id;

  console.log("location = ", location);
  console.log("cantidadPaquete = ", cantidadPaquete);

  var pais = "";
  var margPais = 20;
  var fontPais = 20;

  switch (country) {
    case "UNITED STATES":
      pais = "USA";
      fontPais = 40;
      margPais = 10;
      break;
    case "BRASIL":
      pais = "BRA";
      fontPais = 40;
      margPais = 10;
      break;
    case "BRAZIL":
      pais = "BRA";
      fontPais = 40;
      margPais = 10;
      break
    case "CHINA":
      pais = "CHN";
      fontPais = 40;
      margPais = 10;
      break
    case "COLOMBIA":
      pais = "COL";
      fontPais = 40;
      margPais = 10;
      break
    case "DOMINICAN REPUBLIC":
      pais = "Rep. Dom";
      fontPais = 40;
      margPais = 10;
      break
    case "COSTA RICA":
      pais = "CRI";
      fontPais = 40;
      margPais = 10;
      break
    case "CHILE":
      pais = "CHL";
      fontPais = 40;
      margPais = 10;
      break
    case "PERU":
      pais = "PER";
      fontPais = 40;
      margPais = 10;
      break
    case "PANAMA":
      pais = "PAN";
      fontPais = 40;
      margPais = 10;
      break
    case "ARGENTINA":
      pais = "ARG";
      fontPais = 40;
      margPais = 10;
      break
    default:
      pais = country;
  }

  return new Promise((resolve, reject) => {
    // let canvas = null;
    // let barcodeImage = null;
    // canvas = document.createElement("canvas");
    // const barcodeOptions = {
    //   bcid: "code128", // Barcode type (e.g., code128),
    //   text: `${data.consigneeObj?.data?.obj?.city.substring(0, 3)}` + data.number + 'P' + serialID,
    //   scale: 2, // Scale factor for the barcode size
    //   height: 20, // Height of the barcode
    //   includetext: true, // Include human-readable text below the barcode
    //   textxalign: "center",
    //   bold: true,
    // };
    // barcodeOptions.text = barcodeOptions.text.toUpperCase();
    // try {
    //   canvas = bwipjs.toCanvas(canvas, barcodeOptions);
    //   barcodeImage = canvas.toDataURL();
    // } catch (error) {
    //   reject(error);
    // }
    
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
      let locatione = "";
      data.commodities?.forEach((commodity) => {
        // firstRowText += `1; Pallet \n`;
        firstRowText += `1 \n`;
        thirdRowText += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fourthRowText += `${commodity.description} \n`;
        sixthRowText += `${commodity.weight} lbs \n`;
        (seventhRowText += `${commodity.volumetricWeight} ft3 \n`),
          `${commodity.chargedWeight} Vlb \n`;
        totalWeight += parseFloat(commodity.weight);
        totalVolume += parseFloat(commodity.volumetricWeight);
        // locatione += `${commodity.description} \n`;
        // console.log("totalWeight =", locatione);

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

      let PESO1 = (totalWeight / 2.205).toFixed(2);
      let PESO2 = (totalWeight);

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

    fetch(logotextcolor)
      .then((response) => response.blob())
      .then((imageBlob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;

          for (let index = 0; index < (cantidadPaquete+1); index++) {
            var numPages = index; 
            
          }

          // const numPages = 5; // Número de veces que quieres repetir la página

          const generatePageContent = (peso, description, numPage, location, barcodeImage) => {
            return [

              {
                columns: [
                  {
                    stack: [
                      {
                        image: imgUrl,
                        fit: [400, 400],
                        colSpan: 2,
                        alignment: "right",
                        margin: [0, -20, 0, 20],
                      },
                      {}
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
                        margin: [-10, 0, 0, 0],
                        colSpan: 1,
                        fontSize: 12,
                        border: ['', 'top', 'top', 'top'],
                      },
                      {
                        text: [
                          `${data.shipperObj?.data?.obj?.name || ``
                          } \n \n`,
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
                        border: ['top', 'top', '', 'top'],
                        // lineWidth: 19,
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
                        border: ['', 'top', 'top', 'top'],
                      },
                      {
                        text: [
                          `${data.shipperObj?.data?.obj?.name || ``
                          } \n \n`,
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
                        // rowSpan: 2,
                        border: ['top', 'top', '', 'top'],
                        // lineWidth: 19,
                      },
                      {},
                      {},
                    ],

                    [
                      {
                        text: '',
                        border: ['', '', '', ''],
                      },

                      {
                        text: [
                          `${data.consigneeObj?.data?.obj?.city || ``}, 
                           ${data.consigneeObj?.data?.obj?.state || ``}`, ,
                        ],
                        colSpan: 2,
                        fontSize: 20,
                        bold: true,
                      },
                      {
                      },
                      {
                        text: pais,
                        fontSize: fontPais,
                        bold: true,
                        border: ['top', 'top', '', 'top'],
                        alignment: 'center',
                        margin: [0, 10, 0, 0],
                      },

                    ],
// ------------------------------------------------------------------}
                    [
                      {
                        text: `WATBILL NUMBER`,
                        alignment: `left`,
                        colSpan: 4,
                        bold: true,
                        border: ['', 'top', '', ''],
                        fontSize: 12,
                      },
                      {},
                      {}
                    ],

                    [
                      {
                        image: barcodeImage,
                        // fit: [550, 700],
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
                        border: ['', '', '', ''],
                        bold: true,
                        fontSize: 12,
                      },
                      {},
                      {},
                      {}
                    ],

                    [
                      {
                        // text: `${descrip}`, MIRAR
                        text: description,
                        margin: [20, 0, 0, 50],
                        colSpan: 4,
                        alignment: "left",
                        border: ['', '', '', ''],
                        fontSize: 16,
                      },
                      {},
                      {},
                      {}
                    ],

                    [
                      {
                        text: [`TRACKING`],
                        bold: true,
                        alignment: `left`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                        fontSize: 12,
                        border: ['', '', '', ''],
                      },
                      {},
                      {
                        text: `LOCATION`,
                        bold: true,
                        margin: [190, 0, 0, 0],
                        alignment: `left`,
                        colSpan: 2,
                        fontSize: 12,
                        border: ['', '', '', ''],
                      },
                      // {},
                    ],

                    [
                      {
                        text: [`HERE TRACKING`],
                        bold: true,
                        alignment: `left`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                        fontSize: 15,
                        border: ['', '', '', 'top'],
                      },
                      {},
                      {
                        text: location,
                        bold: true,
                        margin: [190, 0, 0, 0],
                        alignment: `left`,
                        colSpan: 2,
                        fontSize: 15,
                        border: ['', '', '', 'top'],
                      },
                    ],
                    [
                      {
                        text: '',
                        border: ['', '', '', ''],
                      },
                      {
                        // text: `COLLECT COD`,
                        text: ``,
                        bold: true,
                        margin: [0, 40, 0, 0],
                        alignment: `center`,
                        colSpan: 1,
                        rowSpan: 2,
                        fontSize: 15,
                        border: ['', '', '', ''],
                      },
                      {
                        text: 'TOTAL WEIGHT',
                        bold: true,
                        margin: [0, 0, 0, 0],
                        alignment: `center`,
                        colSpan: 1,
                        fontSize: 15,
                        border: ['top', 'top', 'top', ''],
                      },
                      {
                        text: 'PIECES',
                        bold: true,
                        margin: [0, 0, 0, 0],
                        alignment: `center`,
                        colSpan: 1,
                        fontSize: 15,
                        border: ['top', 'top', '', ''],
                      },
                    ],

                    [
                      {
                        text: '',
                        border: ['', '', '', ''],
                      },
                      {
                        text: '',
                        border: ['', '', 'top', ''],
                      },
                      {
                        text : peso + ' LB',
                        bold: true,
                        alignment: `center`,
                        fontSize: 25,
                        margin: [0, 10, 0, 25],
                        border: ['top', '', 'top', '']
                      },
                      {
                        text: numPage + '/' + numCon,
                        // text : "#Numero",
                        margin: [0, 0, 0, 20],
                        bold: true,
                        alignment: `center`,
                        fontSize: 40,
                        border: ['top', '', '', '']
                      },
                    ],
                       
                    
                    // -------------------------------------------------------------------
                  ],
                },
              },
// ----------------------------------------------------------------------------------------
            ];
          };
        
          const pdfContent = [];

          
          var contador = 0 ;
          data.commodities?.forEach((commodity) => {
            //------------------------------------------------
            contador++;
            console.log("contador = ", contador);
            //------------------------------------------------
            let canvas = null;
            let barcodeImage = null;
            canvas = document.createElement("canvas");
            var barra = data.commodities[0].id;
            console.log("barra = ",barra)
            const barcodeOptions = {
              bcid: "code128", // Barcode type (e.g., code128),
              text: `${data.consigneeObj?.data?.obj?.city.substring(0, 3)}` + data.number + 'P' + contador,
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

            const currentPageContent = generatePageContent(commodity.weight, commodity.description, contador, commodity.locationCode, barcodeImage);
            console.log("currentPageContent = ", currentPageContent);

            pdfContent.push(...currentPageContent);
        
              if (pdfContent.length / 3 < numPages) {
                pdfContent.push({ text: "", pageBreak: "after" });
            }
          });
        
          const pdfDefinition = {
            content: pdfContent,
            
            // Otros ajustes del PDF...
          };

          const pdfGenerator = pdfMake.createPdf(pdfDefinition);
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
