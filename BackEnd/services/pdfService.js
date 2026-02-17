import PDFDocument from 'pdfkit';

export const createInvoicePDF = (data, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Stream to response
  doc.pipe(res);

  // --- Helper Functions ---
  const generateHeader = (doc) => {
    doc
      .fillColor('#6b7280') // Gray-500
      .fontSize(10)
      .text('YOUR LOGO', 50, 57, { align: 'left' }) 
      .text(`NO. ${data.invoiceNumber}`, 200, 57, { align: 'right' })
      .moveDown();
  };

  const generateTitle = (doc) => {
    doc
      .fillColor('#1a1a1a')
      .fontSize(40)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, 100);
  };

  const generateDate = (doc) => {
    doc
      .fillColor('#000000')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Date: ', 50, 160, { continued: true })
      .font('Helvetica')
      .text(data.date);
  };

  const generateCustomerInformation = (doc) => {
    const customerInfoTop = 200;

    // Billed To
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Billed to:', 50, customerInfoTop);
    
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.clientName, 50, customerInfoTop + 15)
      .font('Helvetica')
      .fillColor('#4b5563')
      .text(data.clientEmail, 50, customerInfoTop + 30);

    // From
    const rightColX = 350;
    doc
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('From:', rightColX, customerInfoTop);
    
    doc
      .font('Helvetica-Bold')
      .text(data.senderName, rightColX, customerInfoTop + 15)
      .font('Helvetica')
      .fillColor('#4b5563')
      .text(data.senderEmail, rightColX, customerInfoTop + 30);
  };

  const generateInvoiceTable = (doc) => {
    let i;
    const invoiceTableTop = 300;
    const tableHeaderY = invoiceTableTop;

    doc.font('Helvetica-Bold');
    generateTableRow(
      doc,
      tableHeaderY,
      'Item',
      'Qty',
      'Price',
      'Amount'
    );
    
    // Draw thick line below header
    generateHr(doc, tableHeaderY + 20);
    doc.font('Helvetica');

    let position = 0;
    for (i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const amount = quantity * price;

      position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.description,
        quantity,
        `$${price.toFixed(2)}`,
        `$${amount.toFixed(2)}`
      );

      generateHr(doc, position + 20);
    }
    
    return position;
  };

  const generateFooter = (doc, currentY) => {
    const footerTop = currentY + 30;

    // Subtotal
    doc
        .fontSize(10)
        .text('Subtotal', 350, footerTop, { align: 'left' })
        .text(`$${Number(data.subTotal).toFixed(2)}`, 350, footerTop, { align: 'right' });
    
    // Discount
    doc
        .fillColor('#ff0000') // Red
        .text('Discount', 350, footerTop + 15, { align: 'left' })
        .text(`-$${Number(data.discount).toFixed(2)}`, 350, footerTop + 15, { align: 'right' });

    // Total
    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Total', 350, footerTop + 35, { align: 'left' })
        .text(`$${Number(data.grandTotal).toFixed(2)}`, 350, footerTop + 35, { align: 'right' });

    // Waves (Decorative)
    addWaves(doc);
  };
  
  const generateTableRow = (doc, y, item, qty, price, lineTotal) => {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(qty, 280, y, { width: 90, align: 'center' })
      .text(price, 370, y, { width: 90, align: 'center' })
      .text(lineTotal, 0, y, { align: 'right' });
  };
  
  const generateHr = (doc, y) => {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  };

  const addWaves = (doc) => {
      // Simple visual representation of waves at the bottom
      const bottomY = doc.page.height - 100;
      
      doc.save();
      // Wave 1
      doc.path(`M0,${bottomY + 50} C200,${bottomY} 400,${bottomY + 150} 850,${bottomY + 50} V${doc.page.height} H0 Z`)
         .fillOpacity(0.8)
         .fillColor('#7d7d7d');
      
      // Wave 2   
      doc.path(`M0,${bottomY + 100} C300,${bottomY + 20} 600,${bottomY + 180} 850,${bottomY + 80} V${doc.page.height} H0 Z`)
         .fillOpacity(1)
         .fillColor('#4a4a4a');
         
      doc.restore();
  };

  // --- Execute ---
  generateHeader(doc);
  generateTitle(doc);
  generateDate(doc);
  generateCustomerInformation(doc);
  const finalY = generateInvoiceTable(doc);
  generateFooter(doc, finalY);

  doc.end();
};
