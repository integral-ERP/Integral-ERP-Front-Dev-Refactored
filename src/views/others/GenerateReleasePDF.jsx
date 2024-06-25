import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";
import { BorderColor } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

pdfMake.vfs = pdfFonts;

const GenerateReleasePDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  
  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;
    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128)
      text: data.number + '', // Barcode data
      scale: 4, // Scale factor for the barcode size
      height: 5, // Height of the barcode
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
    let totalVolumeM = 0.0;
    let longboard = 440.0;

    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText    = "";
      let secondRowText   = "";
      let thirdRowText    = "";
      let fourthRowText   = "";
      let fifthRowText    = "";
      let sixthRowText    = "";
      let seventhRowText  = "";
      let eigthRowText    = "";
      let ninenthRowText  = "";
      data.commodities?.forEach((commodity, index) => {
        firstRowText    += `1 \n`;
        secondRowText   = data.warehouseReceiptObj?.number || "";
        thirdRowText    += `${commodity.locationCode} \n`;
        fourthRowText   += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fifthRowText    += `${"Box"} \n`;
        sixthRowText    += `${commodity.description} \n`;
        seventhRowText  += `${commodity.weight} lb \n`;
        eigthRowText    += `${commodity.volumen} ft3 \n`;
        ninenthRowText  += `${commodity.volumetricWeight} Vlb \n`;
        totalWeight     += parseFloat(commodity.weight);
        totalVolume     += parseFloat(commodity.volumen);
        totalVolumeM    += parseFloat(commodity.volumetricWeight);
        longboard       -= 21;
      });
      const commodityRow = [
        {
          text: firstRowText,
        },
        {
          text: secondRowText,
        },
        {
          text: thirdRowText,
        },
        {
          text: fourthRowText,
        },
        {
          text: fifthRowText,
        },
        {
          text: sixthRowText,
        },
        {
          text: seventhRowText,
        },
        {
          text: eigthRowText,
        },
        {
          text: ninenthRowText,
          margin: [0, 0, 0, longboard],
        },
      ];
      commodityRows.push(commodityRow);
    }
    const chargeRows = [];

    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {

        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;


          const pdf = {
            content: [
              {
                table:{
                  widths: [`20%`, `50%`,`30%`],
                  body:[
                    [
                      {
                        border: ['', '', '', 'top'],
                        borderColor: ['#000000', '#000000', '#000000', '#006BAD'],
                        margin: [0, 0, 0, 0],
                        stack: [
                          {
                            image: imgUrl,
                            fit: [100, 100],
                          },
                        ],
                      },
                      {
                        border: ['', '', '', 'top'],
                        borderColor: ['#000000', '#000000', '#000000', '#006BAD'],
                        margin: [0, 0, 0, 0],
                        stack:[
                          {
                                  text: `${data.issued_byObj?.name || ``}`,
                                  margin: [0, 0, 0, 0],
                                  bold: true,
                                  fontSize: 12,
                                },
                                {
                                  text: `${data.issued_byObj?.street_and_number || ``}` + " , " +
                                        `${data.issued_byObj?.city || ``}`+ " , " + 
                                        `${data.issued_byObj?.state || ``}` + " , " +
                                        `${data.issued_byObj?.zip_code || ``}`,
                                  margin: [0, 0, 0, 0],
                                  fontSize: 9,
                                },
                                {
                                  text: `${data.issued_byObj?.country || ``}\n` +
                                        " Tel: " + `${data.issued_byObj?.phone || ``}\n` +
                                        " Fax: " + `${data.issued_byObj?.fax || ``} \n \n \n \n \n`,
                                  margin: [0, 0, 0, 0],
                                  fontSize: 9,
                                },
                                {
                                  text:"Released By",
                                  fontSize: 9,
                                },
                                {
                                  text:data.employeeObj.name,
                                  bold: true,
                                  fontSize: 11,
                                },
                        ]
                      },
                      {
                        border: ['', '', '', 'top'],
                        borderColor: ['#000000', '#000000', '#000000', '#006BAD'],
                        margin: [0, 0, 0, 0],
                        stack:[
                          [
                            {text: "CARGO RELEASE",
                            alignment: "center",
                            fontSize: 18,
                            border: ['', '', '', ''],
                            colSpan: 2,
                            bold: true,
                            margin: [0, 0, 0, 0],
                            }, 
                            {}
                          ],
                          [
                            {
                              border: ['', '', '', ''],
                              colSpan: 2,
                              stack: [
                                {
                                  image: barcodeImage,
                                  fit: [1000, 75],
                                  alignment: `center`,
                                },
                                {
                                  text: data.creation_date ,
                                  margin: [0, 12, 0, 0],
                                  fontSize: 12,
                                  alignment: "center",
                                  bold: true,
                                },
                              ],
                            },
                            {}
                          ],
                        ]
                      },
                    ],
                  ]
                }
              },
              // -------------------------
              {
                table:{
                  widths: [`20%`, `50%`,`30%`],
                  body:[
                    [
                      {
                        border: ['', '', '', ''],
                        margin: [0, 0, 0, 0],
                        stack:[
                          {
                            text: "Release to:",
                            margin: [0, 0, 0, 0],
                            fontSize: 9,
                          },
                          {
                            text: data.consigneeObj.data.obj.name,
                            margin: [0, 0, 0, 0],
                            bold: true,
                            fontSize: 11,
                          },
                        ],
                      },
                      {
                        border: ['', '', '', ''],
                        margin: [0, 0, 0, 0],
                        stack:[
                          {
                          text: "Carrier",
                          fontSize: 9,
                          },
                          {
                            text: data.main_carrierObj.name,
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Driver",
                          fontSize: 9,
                          },
                          {
                            text: "- - - - - - - - -",
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Driver License",
                          fontSize: 9,
                          },
                          {
                            text: "- - - - - - - - -",
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Pro Number",
                          fontSize: 9,
                          },
                          {
                            text: data.pro_number,
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Tracking Number",
                          fontSize: 9,
                          },
                          {
                            text: data.tracking_number,
                            fontSize: 11,
                            bold: true,
                            },
                        ],
                      },
                      {
                        border: ['', '', '', ''],
                        fillColor: `#CCCCCC`,
                        text: "Release to:",
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                      },
                    ],
                  ]
                }
              },
              {
                table: {
                  widths: [
                    `auto`,
                    `auto`,
                    `auto`,
                    `auto`,
                    `*`,
                    `*`,
                    `auto`,
                    `auto`,
                    `auto`,
                  ],
                  body: [
                    [
                      {
                        text: `Pcs`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `WHR No`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Location`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Dimensions`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Package`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Description`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Weight`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        alignment: "center",
                      },
                      {
                        text: `Volume`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        alignment: "center",
                      },
                      {
                        text: `Vol Weight`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        alignment: "center",
                      },
                    ],
                    ...commodityRows,
                    
                    [
                      {
                        text: `Note:`,
                        colSpan: 5,
                        rowSpan: 2,
                      },
                      {},
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
                        text: `Volume`,
                      },
                        {
                          text: [`Vol Weight`],
                        },
                    ],
                    [
                      {},
                      {},
                      {},
                      {},
                      {},
                      {
                        text: totalPieces,
                        alignment: "right"
                      },
                      {
                        text: [
                          `${(totalWeight ).toFixed(2)} lb`,
                          ],
                          alignment: "right"
                      },
                      {
                        text: [
                          `${totalVolume.toFixed(2)} ft3\n`,
                        ],
                        alignment: "right"
                      },
                      {
                        text: [
                          `${totalVolumeM.toFixed(2)} Vlb\n`,
                        ],
                        alignment: "right"
                      },
                    ],
                  ],
                },
                margin: [0, 10, 0, 20],
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
                margin: [20, 20, 20, 5],
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

export default GenerateReleasePDF;
