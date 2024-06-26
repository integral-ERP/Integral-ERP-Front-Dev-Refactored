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
    let totalVolumeM = 0.0;
    let longboard = 340.0;

    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText = "";
      let thirdRowText = "";
      let fourthRowText = "";
      let sixthRowText = "";
      let seventhRowText = "";
      data.commodities?.forEach((commodity, index) => {
        firstRowText    += `1; Pallet \n \n \n`;
        thirdRowText    += `${commodity.length}x${commodity.width}x${commodity.height} in \n \n \n`;
        fourthRowText   += `${commodity.description} \n \n \n`;
        sixthRowText    += `${commodity.weight} lbs \n` +`${(commodity.weight / 2.205).toFixed(2)} Kg \n \n`;
        seventhRowText  += `${commodity.volumetricWeight} Vlb \n` +`${commodity.volumen} ft3 \n \n`;
        totalWeight     += parseFloat(commodity.weight);
        totalVolume     += parseFloat(commodity.volumetricWeight);
        totalVolumeM    += parseFloat(commodity.volumen);
        longboard       -= 35;
      });
      const commodityRow = [
        {
          text: firstRowText,
          colSpan: 2,
        },
        {},
        {
          text: thirdRowText,
        },
        {
          text: fourthRowText,
          colSpan: 2,
        },
        {},
        {
          text: sixthRowText,
        },
        {
          text: seventhRowText,
          margin: [0, 0, 0, longboard],
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
                    margin: [0, 0, -10, 0],
                    stack: [
                      {
                        image: imgUrl,
                        fit: [100, 100],
                      },
                      
                    ],
                  },
                  {
                    stack: [
                      {
                        margin: [-65, 0, 10, 0],
                        bold: true,
                        text: [
                          `${data.issued_byObj?.name || ``} \n`,
                          `${data.issued_byObj?.phone? `Tel: ${data.issued_byObj.phone || ``}, \n `: ``}
                          ${data.issued_byObj?.fax? `Fax: ${data.issued_byObj.fax || ``}`: ``}\n`,
                          `${data.issued_byObj?.street_and_number || ``} \n`,
                          `${data.issued_byObj?.country || ``} \n`,
                          `${data.issued_byObj?.state || ``} \n`,
                          `${data.issued_byObj?.city || ``} \n`,
                          `${data.issued_byObj?.zip_code || ``} \n`,   
                        ],
                      },
                      
                    ],
                  
                  },
                  { 
                    style: `tableExample`,
                    margin: [-30, 0, 0, 5],
                    table: {
                      widths: [`45%`, `55%`],
                      body: [
                            [
                              {text: "Pickup Order",
                              alignment: "center",
                              fontSize: 18,
                              border: ['', '', '', ''],
                              colSpan: 2,
                              bold: true,
                              margin: [29, 0, 28, 0],
                              },
                              {}
                            ],
                            [
                              {
                                text: "Number",
                                bold: true,
                              }, 
                              {
                                text: `${data.number || ``}`,
                                fontSize: 10,
                              }
                            ],
                            [
                              {
                                text: "Pickup Date",
                                bold: true,
                              }, 
                              {
                                text: `${data.pick_up_date || ``}`,
                                fontSize: 10,
                              }
                            ],
                            [
                              {
                                text: "Creation Date/Time",
                                bold: true,
                              }, 
                              {
                                text: `${data.creation_date || ``}`,
                                fontSize: 10,
                              }
                            ],
                            [
                              {
                                text: "Delivery Date",
                                bold: true,
                              }, 
                              {
                                text: `${data.delivery_date || ``}`,
                                fontSize: 10,
                              }
                            ],
                            [
                              {
                                text: "Employe",
                                bold: true,
                              }, 
                              {
                                text: `${data.employeeObj.name || ``}, `,
                                fontSize: 10,
                              }
                            ],
                      ],
                    },
                  },
                ],
              },
              {
                table: {
                  widths: [`50%`, `50%`],
                  body: [
                    [
                      {
                        text: `Pickup Company`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        fontSize: 11,
                      },
                      {
                        text: `Delivery Company`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        fontSize: 11,
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
                    ],
                  ],
                },
              },
              {
                table: {
                  widths: [`20%`, `30%`,`20%`, `30%`],
                  body: [
                    [
                      {
                        text: `Shipper`,
                        bold: true,
                        fontSize: 11,
                        border: ['top', '', 'top', ''],
                      },
                      {
                        text: `${data.shipperObj?.data?.obj?.name || ``}`,
                        bold: true,
                        border: ['top', '', 'top', ''],
                      },
                      {
                        text: `Consignee`,
                        bold: true,
                        fontSize: 11,
                        border: ['top', '', 'top', ''],
                      },
                      {
                        text: `${data.consigneeObj?.data?.obj?.name || ``}`,
                        bold: true,
                        border: ['top', '', 'top', ''],
                      },
                    ],
                  ]
                }
              },
              {
                table: {
                  widths: [`20%`, `30%`,`20%`, `30%`],
                  body: [
                    [
                      {
                        text: `Inland Carrier and Supplier Information`,
                        bold: true,
                        fontSize: 13,
                        fillColor: `#CCCCCC`,
                        // margin: [0, 0, 0, 0],
                        colSpan: 4,
                        alignment: "center"
                      },
                      {},
                      {},
                      {},
                    ],
                    [
                      {
                        text: `Carrier Name`,
                        bold: true,
                        fontSize: 11,
                      },
                      {
                        text: `${data.main_carrierObj?.name || ``}`,
                        bold: true,
                      },
                      {
                        text: `P.O. Number`,
                        bold: true,
                        fontSize: 11,
                      },
                      {
                        text: `${data.purchase_order_number || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                    [
                      {
                        text: `PRO Number`,
                        bold: true,
                        fontSize: 11,
                      },
                      {
                        text: `${data.pro_number || ``}`,
                        bold: true,
                      },
                      {
                        text: `Supplier Name`,
                        bold: true,
                        fontSize: 11,
                      },
                      {
                        text: `${data.pickUpLocationObj?.data?.obj.name || ``}`,
                        bold: true,
                      },
                    ],
                    [
                      {
                        text: `Tracking Number`,
                        bold: true,
                        fontSize: 11,
                        border: ['top', '', 'top', ''],
                      },
                      {
                        text: `${data.tracking_number || ``}`,
                        bold: true,
                        border: ['top', '', 'top', ''],
                      },
                      {
                        text: `Invoice Number`,
                        bold: true,
                        fontSize: 11,
                        border: ['top', '', 'top', ''],
                      },
                      {
                        text: `${data.invoice_number || ``}`,
                        bold: true,
                        border: ['top', '', 'top', ''],
                      },
                    ],
                  ]
                }
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
                          `${totalWeight.toFixed(2)} lb\n`,
                          `${(totalWeight / 2.205).toFixed(2)} kg`,
                        ],
                      },
                      {
                        text: [
                          `${totalVolume.toFixed(2)} Vlb\n`,
                          `${(totalVolumeM).toFixed(2)} ft3`,
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
