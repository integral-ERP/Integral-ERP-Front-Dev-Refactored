import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../img/logo.png";
import barcode from "../../img/bars.png";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const GeneratePickUpPDF = (data) => {
  return new Promise((resolve, reject) => {
    let imgUrl = null;
    let barcodeUrl = null;

    const commodityRows = [];
    let totalPieces = 0;
    let totalWeight = 0;
    let totalVolume = 0;
    // Loop through the commodities array and create a table row for each item
    if(data.commodities){
      totalPieces = data.commodities.length;
      data.commodities?.forEach((commodity, index) => {
        const commodityRow = [
          {
            text: `${index + 1}; Pallet \n`,
            colSpan: 2,
            margin: [0, 0, 0, 200],
          },
          {},
          {
            text: `${commodity.length}x${commodity.width}x${commodity.height} in`,
          },
          {
            text: 'adhesives', // You may replace this with the actual description
            colSpan: 2,
            margin: [0, 0, 0, 40],
          },
          {},
          {
            text: `${commodity.weight} lb`,
            margin: [0, 0, 0, 40],
          },
          {
            text: [`${commodity.volumetricWeight} ft3 \n`, `${commodity.chargedWeight} Vlb`],
            margin: [0, 0, 0, 40],
          },
        ];
        totalWeight += commodity.weight;
        totalVolume += commodity.volumetricWeight;
        // Add the commodity row to the array
        commodityRows.push(commodityRow);
      });
    }


    // Fetch the logo image dynamically
    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {
        // Convert the image blob to a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          imgUrl = event.target.result;

          // Fetch the barcode image dynamically
          fetch(barcode)
            .then((response) => response.blob())
            .then((barcodeBlob) => {
              // Convert the barcode image blob to a data URL
              const barcodeReader = new FileReader();
              barcodeReader.onload = (barcodeEvent) => {
                barcodeUrl = barcodeEvent.target.result;

                // Create the PDF document
                const pdf = {
                  content: [
                    {
                      columns: [
                        {
                          stack: [
                            {
                              image: imgUrl,
                              fit: [100, 100]
                            },
                            {
                              text: "Pick-up Order",
                              fontSize: 18,
                              bold: true,
                              margin: [0, 10, 0, 0] // Adjust margin as needed
                            }
                          ],
                        },
                        {
                          text: [
                            `Issued By \n`,
                            `${data.issued_byObj?.name || ``} \n`,
                            `Tel: ${data.issued_byObj?.phone || ``}, Fax: ${data.issued_byObj?.fax || ``} \n`,
                            `${data.issued_byObj?.street_and_number || ``} \n`,
                            `${data.issued_byObj?.city || ``}, ${data.issuedBy?.state || ``} ${data.issued_byObj?.zipCode || ``} \n`,
                            `${data.issued_byObj?.country || ``}`,
                          ],
                        },
                        {
                          stack: [
                            { image: barcodeUrl, fit: [100, 200], alignment: `right` },
                            {
                              text: `${data.number || ``}`,
                              bold: true,
                              alignment: `right`,
                              fontSize: 20,
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
                          style: `tableExample`,
                          table: {
                            width: `*`,
                            body: [[`Received By:`, `${data.employeeObj?.name || ``}`]],
                          },
                        },
                        {
                          style: `tableExample`,
                          table: {
                            width: `*`,
                            body: [[`Received Date`, `${data.creation_date || ``}`]],
                            margin: [5, 0, 5, 0],
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
                            body: [[`Pickup Date`, `${data.pick_up_date || ``}`]],
                          },
                        },
                        {
                          style: `tableExample`,
                          table: {
                            width: `*`,
                            body: [[`Delivery Date`, `${data.delivery_date || ``}`]],
                          },
                        },
                        {
                          style: `tableExample`,
                          table: {
                            width: `*`,
                            body: [[`Carrier`, `${data.main_carrierObj?.name || ``}`]],
                          },
                        },
                      ],
                    },
                    {
                      table: {
                        widths: [`33%`, `33%`, `33%`],
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
                              text: `${data.pickUpLocationObj?.data?.obj?.name || ``}`,
                            },
                            {
                              text: `${data.deliveryLocationObj?.data?.obj?.name || ``}`,
                            },
                            {
                              text: `${data.pro_number || ``}`,
                            },
                          ],
                          [
                            {
                              text: [
                                `${data.pickUpLocationObj?.data?.obj?.name || ``} \n`,
                            `${data.pickUpLocationObj?.data?.obj?.streetNumber || ``} \n`,
                            `${data.pickUpLocationObj?.data?.obj?.city || ``}, ${data.pickUpLocationObj?.data?.obj?.state || ``} ${data.pickUpLocationObj?.data?.obj?.zipCode || ``} \n`,
                            `${data.pickUpLocationObj?.data?.obj?.country || ``}`,
                            `Tel: ${data.pickUpLocationObj?.data?.obj?.phone || ``}, Fax: ${data.pickUpLocationObj?.data?.obj?.fax || ``} \n`,
                              ],
                              margin: [0, 0, 0, 20],
                            },
                            {
                              text: [
                                `${data.deliveryLocation?.data?.obj?.name || ``} \n`,
                            `${data.deliveryLocation?.data?.obj?.streetNumber || ``} \n`,
                            `${data.deliveryLocation?.data?.obj?.city || ``}, ${data.deliveryLocation?.data?.obj?.state || ``} ${data.deliveryLocation?.data?.obj?.zipCode || ``} \n`,
                            `${data.deliveryLocation?.data?.obj?.country || `USA`}`,
                            `Tel: ${data.deliveryLocation?.data?.obj?.phone || ``}, Fax: ${data.deliveryLocation?.data?.obj?.fax || ``} \n`,
                              ],
                              margin: [0, 0, 0, 10],
                            },
                            {
                              text: [`Tracking Number: \n`, `${data.tracking_number || ``}`],
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
                            },
                            {
                              text: `${data.consigneeObj?.data?.obj?.name || ``}`,
                            },
                            {
                            },
                          ],
                          [
                            {
                              text: `Driver: Juan Felipe Jaramillo.`,
                            },
                            {
                              text: `Invoice: ${data.invoice_number || ``}`,
                            },
                            {
                              style: `tableExample`,
                              table: {
                                width: `100%`,
                                body: [
                                  [`Description`, `Price`],
                                  [`Delivery`, `50`],
                                  [`Taxes`, `25`],
                                ],
                                rowSpan: 2
                              },
                            },
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
                            },
                            {
                              text: `Volume`,
                              fillColor: `#CCCCCC`,
                              margin: [0, 0, 0, 0],
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
                              text: `Volume Weight`,
                              fillColor: `#CCCCCC`,
                              margin: [0, 0, 0, 0],
                            },
                          ],
                          [
                            {
                              text: [`1; Pallet \n`],
                              colSpan: 2,
                              margin: [0, 0, 0, 200],
                            },
                            {},
                            {
                              text: `48.00x32.00x48.00 in`,
                            },
                            {
                              text: `adhesives`,
                              colSpan: 2,
                              margin: [0, 0, 0, 40],
                            },
                            {},
                            {
                              text: `1,416.00 lb`,
                              margin: [0, 0, 0, 40],
                            },
                            {
                              text: [`42.67 ft3 \n`, `444.18 Vlb`],
                              margin: [0, 0, 0, 40],
                            },
                          ],
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
                              text: [`${totalWeight} kg\n`, `${totalWeight / 2.205} lb`],
                            },
                            {
                              text: [`${totalVolume} ft3\n`, `${totalVolume /  35.315} m3`],
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

              barcodeReader.readAsDataURL(barcodeBlob);
            })
            .catch((error) => {
              reject(error);
            });
        };

        reader.readAsDataURL(imageBlob);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default GeneratePickUpPDF;
