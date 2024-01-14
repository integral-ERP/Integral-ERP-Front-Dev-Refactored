import pdfMake from "pdfmake/build/pdfmake";
//import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfFonts from "./vfs_fonts";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js"; 
import { BarcodeGenerator } from "barcode-generator";

pdfMake.vfs = pdfFonts;

const GenerateBillPDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  
  

  //ctx.drawImage(bwipjs.toCanvas(barcodeOptions),0 ,0);

  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;
    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128)
      text: data.number + '', // Barcode data
      scale: 3, // Scale factor for the barcode size
      height: 10, // Height of the barcode
      includetext: true, // Include human-readable text below the barcode
      textxalign: "center",
    };
    try {
      // Generate the barcode as a canvas
      canvas = bwipjs.toCanvas(canvas, barcodeOptions);
      barcodeImage = canvas.toDataURL();
    } catch (error) {
      reject(error);
    }

//--------------------------------------------------------------------------------
    const chargesAmount = [];
    const chargesQuantity = [];
    const chargesTotalAmount = [];
    const chargesDescription = [];
    let totalAmount = 0;
    // Loop through the billCharges array and create a table row for each item
    if (data.billCharges) {
      totalAmount = data.billCharges.leng;
      let chargeAmount = "";
      let chargeQuantity = "";
      let chargeTotalAmount = "";
      let chargeDescription = "";

      data.billCharges?.forEach((chargeses, index) => {
        chargeAmount += `${chargeses.amount}  \n`;
        chargeQuantity += `${chargeses.quantity}  \n`;
        chargeTotalAmount += `${chargeses.totalAmount} \n`;
        chargeDescription += `${chargeses.typeByCode} \n`;
      });
      const chargesRow = [
        // TODO: CHANGE INDEX FOR PIECES AND GET PACKTYPE
        {
          text: chargeAmount,
        },
      ];
      //------------------------------
      const chargesAmoun = [
        {
          text: chargeQuantity,
        },
      ];
      //------------------------------
      const chargesTotalAmoun = [
        {
          text: chargeTotalAmount,
        },
      ];
      //------------------------------
      const chargeDescript = [
        {
          text: chargeDescription,
        },
      ];

      chargesAmount.push(chargesRow);
      chargesQuantity.push(chargesAmoun);
      chargesTotalAmount.push(chargesTotalAmoun);
      chargesDescription.push(chargeDescript);
    }
    // const ChargeAmount = [];

    if (data.billCharges) {
      data.billCharges.forEach((charge) => {
        if (charge.show && charge.type !== "expense") {
          // Check if the charge should be shown based on the "show" property
          
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
              text: `${parseInt(charge.totalAmount)}`, // Display the totalAmount and currency
              margin: [0, 0, 0, 0],
            },
          ];
          
          // Add the charge row to the array
          // ChargeAmount.push(chargeRow);
        }
      });
      // 
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
                        text: "Bill",
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 0], // Adjust margin as needed
                      },
                    ],
                  },
                  {
                    text: [
                      //  `Ver \n`,
                       `${data.issuedByName || ``} \n`,
                      ``,
                      ``,
                      ``,
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
                    style: `tableExample`,
                    table: {
                      width: `*`,
                      body: [[`Payment Terms`, `${data.paymentByDesc || ``}`]],
                      margin: [5, 0, 5, 0],
                    },
                  },
                  {
                    style: `tableExample`,
                    table: {
                      width: `*`,
                      body: [[`Due Date`, `${data.due || ``}`]],
                      margin: [5, 0, 5, 0],
                    },
                  },
                  {
                    style: `tableExample`,
                    table: {
                      width: `*`,
                      body: [[`Transaction Date`, `${data.trasaDate || ``}`]],   
                    },
                  },
                ],
              },
              {
                columns: [
                  {
                    style: `tableExample`,
                    table: {
                      width: `*`,
                      body: [
                        [
                          [
                            {
                              text: `Bill To`,
                              fillColor: `#CCCCCC`,
                              alignment: `left`,
                            },
                          ],
                          [
                            {
                              text: `${data.billCharges[0].typeByCode || ``} - ${data.billCharges[0].issuedByInfo || ``}` ,
                              fillColor: `#CCCCCC`,
                              margin: [0, 0, 0, 0],
                              lignment: `left`,
                            },
                          ],
                        ],
                    ],
                    },
                  },
                ],
              },
              {
                table: {
                  widths: [`40%`, `20%`, `20%`, `20%`],
                  body: [
                    [
                      {
                        text: `Description of Charges`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Quantity`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Price`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      
                      {
                        text: `Amount`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                  
                    [
                      [chargesDescription,],
                      [chargesQuantity,],
                      [chargesTotalAmount],
                      [chargesAmount,],
                      
                    ],
                    [
                      
                      {
                      },
                      {
                      },
                      {
                      },
                      {
                        text: 
                        `${data.account || ``}`,
                      },
                    ],
                    
       
                    ],
                },
              },
              {
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

export default GenerateBillPDF;


