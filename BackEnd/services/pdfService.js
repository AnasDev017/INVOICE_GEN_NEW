import PDFDocument from 'pdfkit';

export const createInvoicePDF = (data, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Stream to response
  doc.pipe(res);

  // --- Design Constants ---
  const primaryColor = '#000000'; // Black
  const secondaryColor = '#444444'; // Dark Gray for secondary text
  const lineColor = '#E0E0E0'; // Light Gray for dividers

  // --- 1. Header Section ---
  doc.fillColor(primaryColor)
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('INVOICE', 50, 50, { align: 'right' });

  doc.fontSize(10)
     .font('Helvetica')
     .text(`Invoice Number: ${data.invoiceNumber}`, 50, 75, { align: 'right' })
     .text(`Date: ${new Date(data.date).toLocaleDateString()}`, 50, 90, { align: 'right' });

  // Logo Placeholder (Text-based for now)
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('YOUR BRAND', 50, 50, { align: 'left' });

  // Separator Line
  doc.moveTo(50, 115).lineTo(545, 115).strokeColor(lineColor).lineWidth(1).stroke();

  // --- 2. Client & Sender Details ---
  const detailsTop = 130;

  // "Billed To" Column
  doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor).text('Billed To:', 50, detailsTop);
  doc.font('Helvetica').fillColor(secondaryColor)
     .text(data.clientName, 50, detailsTop + 15)
     .text(data.clientEmail, 50, detailsTop + 28);
     // Add Address if available in data, mostly likely plain text

  // "From" Column
  doc.font('Helvetica-Bold').fillColor(primaryColor).text('From:', 300, detailsTop);
  doc.font('Helvetica').fillColor(secondaryColor)
     .text('Anas Hussain', 300, detailsTop + 15) // Hardcoded sender for now, or use data if passed
     .text('anastahirhussain7@gmail.com', 300, detailsTop + 28);

  // --- 3. Items Table ---
  const tableTop = 200;
  
  // Table Header Background (Optional: Black bar for high contrast)
  // doc.rect(50, tableTop, 495, 20).fill(primaryColor);
  
  // Table Headers
  const itemX = 50;
  const qtyX = 350;
  const priceX = 420;
  const amountX = 490;

  doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('Item Description', itemX, tableTop + 5);
  doc.text('Qty', qtyX, tableTop + 5);
  doc.text('Price', priceX, tableTop + 5);
  doc.text('Amount', amountX, tableTop + 5, { align: 'right', width: 55 });

  // Header bottom border
  doc.moveTo(50, tableTop + 20).lineTo(545, tableTop + 20).strokeColor(primaryColor).lineWidth(1.5).stroke();

  // Table Rows
  let y = tableTop + 30;
  doc.font('Helvetica').fontSize(10).fillColor(secondaryColor);

  data.items.forEach((item, i) => {
    const amount = Number(item.quantity) * Number(item.price);
    
    doc.text(item.description || item.name || "Item", itemX, y); // Fallback for description/name
    doc.text(item.quantity.toString(), qtyX, y);
    doc.text(`$${Number(item.price).toFixed(2)}`, priceX, y);
    doc.text(`$${amount.toFixed(2)}`, amountX, y, { align: 'right', width: 55 });

    // Light row separator
    y += 20;
    doc.moveTo(50, y - 5).lineTo(545, y - 5).strokeColor(lineColor).lineWidth(0.5).stroke();
  });

  // --- 4. Totals Section ---
  const totalsTop = y + 20;
  const totalsLabelX = 350;
  const totalsValueX = 490;

  // Subtotal
  doc.font('Helvetica').fillColor(secondaryColor).text('Subtotal:', totalsLabelX, totalsTop);
  doc.text(`$${Number(data.subTotal || 0).toFixed(2)}`, totalsValueX, totalsTop, { align: 'right', width: 55 });

  // Discount (if any)
  if (data.discount > 0) {
      doc.text('Discount:', totalsLabelX, totalsTop + 15);
      doc.text(`-$${Number(data.discount).toFixed(2)}`, totalsValueX, totalsTop + 15, { align: 'right', width: 55 });
  }

  // Total (Bold/Black)
  const totalY = data.discount > 0 ? totalsTop + 35 : totalsTop + 20;
  
  doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(12)
     .text('Total:', totalsLabelX, totalY);
  doc.text(`$${Number(data.grandTotal || data.totalAmount).toFixed(2)}`, totalsValueX, totalY, { align: 'right', width: 55 });

  // --- 5. Footer ---
  // Stick to bottom
  const bottom = doc.page.height - 50;
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
     .text('Thank you for your business.', 50, bottom, { align: 'center', width: 495 });

  doc.end();
};
