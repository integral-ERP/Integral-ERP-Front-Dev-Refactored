import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts;
pdfMake.vfs = pdfFonts;

const GenerateReleasePDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  



  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;
    canvas = document.createElement("canvas");
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128),
      text: data.number + "",
      scale: 2, // Scale factor for the barcode size
      height: 10, // Height of the barcode,
      includeText: true,
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
      let secondRowText = "";
      let thirdRowText = "";
      let fourthRowText = "";
      let fifthRowText = "";
      let sixthRowText = "";
      let seventhRowText = "";
      let eigthRowText = "";
      let ninenthRowText = "";
      data.commodities?.forEach((commodity) => {
        firstRowText += `1 \n`;
        secondRowText = data.warehouseReceiptObj?.number || "";
        thirdRowText += `${commodity.locationCode} \n`;
        fourthRowText += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fifthRowText += `${"Box"} \n`;
        sixthRowText += `${commodity.description} \n`;
        seventhRowText += `${commodity.weight} lbs \n`;
        eigthRowText += `${commodity.volumetricWeight} ft3 \n`;
        // ninenthRowText = `${commodity.chargedWeight} Vlb \n`;
        totalWeight += parseFloat(commodity.weight);
        totalVolume += parseFloat(commodity.volumetricWeight);

        // if (commodity.containsCommodities && commodity.internalCommodities) {
        //   commodity.internalCommodities.forEach((internalCommodity) => {

        //     thirdRowText += commodity.locationCode || "";
        //     fourthRowText += `${internalCommodity.length}x${internalCommodity.width}x${internalCommodity.height} in \n`;
        //     fifthRowText += `${internalCommodity.package_type_description} \n`;
        //     sixthRowText += `${internalCommodity.description} lbs \n`;
        //     seventhRowText += `${internalCommodity.weight} lbs \n`;
        //     eigthRowText += `${internalCommodity.volumetricWeight} ft3 \n`;
        //     ninenthRowText = `${internalCommodity.chargedWeight} Vlb \n`;
        //     totalWeight += parseFloat(internalCommodity.weight);
        //     totalVolume += parseFloat(internalCommodity.volumetricWeight);
        //   });
        // }
      });
      const commodityRow = [
        {

          text: firstRowText,
          margin: [0, 0, 0, 300],
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
        // {

        //   text: ninenthRowText,
        // },
      ];
      commodityRows.push(commodityRow);
    }
    const chargeRows = [];
    /*
    if (data.warehouseReceiptObj?.charges) {
        
      data.warehouseReceiptObj?.charges?.forEach((charge) => {
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
    */

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
                        text: "CARGO RELEASE",
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                    ],
                  },
                  {
                    stack: [
                      {
                        text: [
                          `Issued By \n`,
                          `${data.issued_byObj?.name || ``} \n`,
                        ],
                      },
                      {
                        text: [
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
                      { text: `Released By \n` },
                      { text: `${data.issued_byObj?.name || ``} \n` },
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
                  {
                    stack: [
                      {
                        text: [
                          `${data.releasedToObj?.data?.obj?.name || ``} \n`,
                          `${
                            data.releasedToObj?.data?.obj?.street_and_number ||
                            ``
                          } \n`,
                          `${data.releasedToObj?.data?.obj?.city || ``}, ${
                            data.releasedToObj?.data?.obj?.state || ``
                          } ${
                            data.releasedToObj?.data?.obj?.zip_code || ``
                          } \n`,
                          `${data.releasedToObj?.data?.obj?.country || ``}`,
                          `${
                            data.releasedToObj?.phone
                              ? `Tel: ${data.releasedToObj.phone}, `
                              : ``
                          }${
                            data.releasedToObj?.fax
                              ? `Fax: ${data.releasedToObj.fax}`
                              : ``
                          }\n`,
                        ],
                      },
                    ],
                  },
                  {
                    stack: [
                      { text: "Carrier" },
                      { text: data.carrierObj?.name },
                      { text: "PRO Number" },
                      { text: data.pro_number },
                      { text: "Tracking Number" },
                      { text: data.tracking_number },
                    ],
                  },
                  {
                    style: `tableExampleLeft`,
                    table: {
                      widths: ["28%", "40%", "32%"],
                      body: [["Type", `Description`, `Price`], ...chargeRows],
                    },
                  },
                ],
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
                    // `auto`,
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
                      // {
                      //   text: `Vol Weight`,
                      //   fillColor: `#CCCCCC`,
                      //   margin: [0, 0, 0, 0],
                      //   alignment: "center",
                      // },
                    ],
                    ...commodityRows,
                    
                    [
                      {
                        text: `Signature:`,
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
                        // {
                        //   text: [`Volume Weight`],
                        // },
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
                      // {
                      //   text:"WWW",
                      //   alignment: "right"
                      // },
                    ],
                  ],
                },
                margin: [0, 50, 0, 20],
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
