import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const GenerateReleasePDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  console.log(barcodeImage);

  //ctx.drawImage(bwipjs.toCanvas(barcodeOptions),0 ,0);

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
        thirdRowText = commodity.locationCode || "";
        fourthRowText += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fifthRowText = "Box";
        sixthRowText += `${commodity.description} \n`;
        seventhRowText += `${commodity.weight} lbs \n`;
        eigthRowText += `${commodity.volumetricWeight} ft3 \n`;
        ninenthRowText = `${commodity.chargedWeight} Vlb \n`;
        totalWeight += parseFloat(commodity.weight);
        totalVolume += parseFloat(commodity.volumetricWeight);

        if (commodity.containsCommodities && commodity.internalCommodities) {
          commodity.internalCommodities.forEach((internalCommodity) => {
            // Add the information for each internal commodity
            thirdRowText += commodity.locationCode || "";
            fourthRowText += `${internalCommodity.length}x${internalCommodity.width}x${internalCommodity.height} in \n`;
            fifthRowText += `${internalCommodity.package_type_description} \n`;
            sixthRowText += `${internalCommodity.description} lbs \n`;
            seventhRowText += `${internalCommodity.weight} lbs \n`;
            eigthRowText += `${internalCommodity.volumetricWeight} ft3 \n`;
            ninenthRowText = `${internalCommodity.chargedWeight} Vlb \n`;
            totalWeight += parseFloat(internalCommodity.weight);
            totalVolume += parseFloat(internalCommodity.volumetricWeight);
          });
        }
      });
      const commodityRow = [
        {
          // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
          text: firstRowText,
        },
        {
          // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
          text: secondRowText,
        },
        {
          text: thirdRowText,
        },
        {
          text: fourthRowText,
        },
        {
          // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
          text: fifthRowText,
        },
        {
          text: sixthRowText,
        },
        {
          text: seventhRowText,
        },
        {
          // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
          text: eigthRowText,
        },
        {
          // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
          text: ninenthRowText,
        },
      ];
      commodityRows.push(commodityRow);
    }
    const chargeRows = [];
    /*
    if (data.warehouseReceiptObj?.charges) {
        console.log("CARGOS", data.warehouseReceiptObj?.charges);
      data.warehouseReceiptObj?.charges?.forEach((charge) => {
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
    */
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

export default GenerateReleasePDF;
