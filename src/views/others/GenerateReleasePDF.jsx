import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

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
      height: 3, // Height of the barcode
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
                columns: [
                  {
                    stack: [
                      {
                        image: imgUrl,
                        fit: [100, 100],
                      },
                      {
                        text: "Release to",
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                      {
                        text:[
                          `${data.consigneeObj.data.obj.name || ``} \n`,
                        ],
                        fontSize: 18,
                        bold: true,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                    ],
                  },
                  {
                    stack: [
                      {
                        text: [
                          `${data.issued_byObj?.name || ``} \n`,
                        ],
                      },
                      {
                        text: [
                          `${data.issued_byObj?.phone? `Tel: ${data.issued_byObj.phone},`: ``}
                          ${data.issued_byObj?.fax? `Fax: ${data.issued_byObj.fax}`: ``}\n`,
                          `${data.issued_byObj?.street_and_number || ``} \n`,
                          `${data.issued_byObj?.city || ``},
                           ${data.issuedBy?.state || ``} 
                           ${data.issued_byObj?.zip_code || ``} \n`,
                          `${data.issued_byObj?.country || ``}`,
                        ],
                      },
                      { text: `Released By \n` },
                      { text: `${data.issued_byObj?.name || ``} \n` },
                    ],
                  },
                  {
                    stack: [
                      {text: "CARGO RELEASE",
                        alignment: "center",
                        fontSize: 18,
                        border: ['', '', '', ''],
                        colSpan: 2,
                        bold: true,
                        margin: [0, 0, 0, 0],
                        }, 
                      {
                        image: barcodeImage,
                        fit: [1000, 50],
                        alignment: `center`,
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
                        // text: [
                        //   `${data.releasedToObj?.data?.obj?.name || ``} \n`,
                        //   `${data.releasedToObj?.data?.obj?.street_and_number ||``} \n`,
                        //   `${data.releasedToObj?.data?.obj?.city || ``}, 
                        //   ${data.releasedToObj?.data?.obj?.state || ``} 
                        //   ${data.releasedToObj?.data?.obj?.zip_code || ``} \n`,
                        //   `${data.releasedToObj?.data?.obj?.country || ``}`,
                        //   `${data.releasedToObj?.phone? `Tel: ${data.releasedToObj.phone},`:``}
                        //   ${data.releasedToObj?.fax? `Fax: ${data.releasedToObj.fax}`:``}\n`,
                        // ],
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
