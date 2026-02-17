import PDFDocument from 'pdfkit';

export const createInvoicePDF = (data, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Stream to response
  doc.pipe(res);

  // --- Design Constants ---
  const colors = {
    primary: '#1a1a1a',
    secondary: '#4b5563',
    accent: '#f3f4f6', // Table header bg
    border: '#e5e7eb',
    waves: {
        w1: '#7d7d7d',
        w2: '#4a4a4a',
        w3: '#c0c0c0'
    }
  };

  const pageWidth = 595; // A4 width in points
  const margin = 50;
  const contentWidth = pageWidth - (margin * 2);

  // --- 1. Header (Logo & Number) ---
  doc.fillColor('#6b7280')
     .fontSize(9)
     .font('Helvetica-Bold')
     .text('YOUR LOGO', margin, 50, { align: 'left', characterSpacing: 2 })
     .text(`NO. ${data.invoiceNumber || 'INV-001'}`, margin, 50, { align: 'right', characterSpacing: 2 });

  // --- 2. Main Title & Date ---
  doc.moveDown(2);
  doc.fillColor(colors.primary)
     .fontSize(50) // Simulating the huge 80px font scaled down for PDF
     .font('Helvetica-Bold')
     .text('INVOICE', margin, 90, { characterSpacing: 1 });

  doc.moveDown(0.5);
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .fillColor(colors.primary)
     .text('Date: ', { continued: true })
     .fillColor('#9ca3af') // lighter gray
     .text(new Date(data.date || Date.now()).toLocaleDateString());

  // --- 3. Billing Info ---
  const detailsTop = 220;
  const col2X = 300;

  // Billed To
  doc.fontSize(10).fillColor(colors.primary).font('Helvetica-Bold').text('Billed to:', margin, detailsTop);
  doc.fontSize(11).font('Helvetica-Bold').text(data.clientName, margin, detailsTop + 15);
  doc.fontSize(10).font('Helvetica').fillColor(colors.secondary).text(data.clientEmail, margin, detailsTop + 30);

  // From
  doc.fontSize(10).fillColor(colors.primary).font('Helvetica-Bold').text('From:', col2X, detailsTop);
  doc.fontSize(11).font('Helvetica-Bold').text(data.senderName || 'Anas Hussain', col2X, detailsTop + 15);
  doc.fontSize(10).font('Helvetica').fillColor(colors.secondary).text(data.senderEmail || 'anastahirhussain7@gmail.com', col2X, detailsTop + 30);

  // --- 4. Table ---
  const tableTop = 320;
  const rowHeight = 35;
  
  // Columns
  const c1 = margin;        // Item
  const c2 = 300;           // Qty
  const c3 = 380;           // Price
  const c4 = 480;           // Amount (Right aligned anchor)

  // Header Background
  doc.rect(margin, tableTop - 10, contentWidth, 25).fill(colors.accent);

  // Header Text
  const headerY = tableTop - 3;
  doc.fillColor(colors.secondary).fontSize(9).font('Helvetica-Bold');
  doc.text('ITEM', c1 + 10, headerY);
  doc.text('QTY', c2, headerY, { width: 50, align: 'center' });
  doc.text('PRICE', c3, headerY, { width: 70, align: 'right' });
  doc.text('AMOUNT', c4, headerY, { width: 60, align: 'right' });

  // Rows
  let y = tableTop + 30;
  doc.font('Helvetica').fontSize(10).fillColor(colors.primary);

  (data.items || []).forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const amount = qty * price;

    doc.text(item.description || item.name || 'Item', c1 + 10, y);
    doc.text(qty.toString(), c2, y, { width: 50, align: 'center' });
    doc.text(`$${price.toFixed(2)}`, c3, y, { width: 70, align: 'right' });
    doc.text(`$${amount.toFixed(2)}`, c4, y, { width: 60, align: 'right' });

    // Border bottom
    doc.moveTo(margin, y + 15).lineTo(pageWidth - margin, y + 15).strokeColor(colors.border).lineWidth(0.5).stroke();
    
    y += rowHeight;
  });

  // --- 5. Totals ---
  const totalsTop = y + 20;
  const totalsLabelX = 350;
  const totalsValueX = 490;

  // Subtotal
  doc.font('Helvetica-Bold').fillColor(colors.secondary).fontSize(10);
  doc.text('Subtotal', totalsLabelX, totalsTop);
  doc.font('Helvetica').fillColor(colors.primary);
  doc.text(`$${Number(data.subTotal || 0).toFixed(2)}`, totalsValueX, totalsTop, { align: 'right', width: 50 });

  // Discount
  if (data.discount > 0) {
    doc.font('Helvetica-Bold').fillColor('#dc2626'); // Red for discount label
    doc.text('Discount', totalsLabelX, totalsTop + 20);
    doc.font('Helvetica');
    doc.text(`-$${Number(data.discount).toFixed(2)}`, totalsValueX, totalsTop + 20, { align: 'right', width: 50 });
  }

  // Grand Total
  const grandTotalY = data.discount > 0 ? totalsTop + 45 : totalsTop + 25;
  
  // Separator above total
  doc.moveTo(totalsLabelX, grandTotalY - 10).lineTo(pageWidth - margin, grandTotalY - 10).strokeColor(colors.border).stroke();

  doc.font('Helvetica-Bold').fillColor(colors.primary).fontSize(12);
  doc.text('Total', totalsLabelX, grandTotalY);
  doc.fontSize(16).font('Helvetica-Bold'); // Bigger font for total value
  doc.text(`$${Number(data.grandTotal || data.totalAmount || 0).toFixed(2)}`, totalsValueX, grandTotalY - 4, { align: 'right', width: 50 });


  // --- 6. Footer Waves ---
  // We use SVG paths. PDFKit coordinate system is 0,0 at top-left.
  // The provided vectors are ViewBox 0 0 850 250.
  // We need to scale them to fit the page width (595).
  // Scale X = 595 / 850 = ~0.7
  // We place them at the bottom.
  
  const bottomY = doc.page.height - 180; // Start waves ~180pts from bottom
  const waveScale = 595 / 850;

  doc.save();
  doc.translate(0, bottomY);
  doc.scale(waveScale);

  // Wave 1 (Opacity 0.8)
  doc.path("M0 150C200 100 400 250 850 150V250H0V150Z")
     .fillColor(colors.waves.w1)
     .fillOpacity(0.8)
     .fill();

  // Wave 2 (Opacity 1.0) - Note: In HTML order matters.
  doc.path("M0 200C300 120 600 280 850 180V250H0V200Z")
     .fillColor(colors.waves.w2)
     .fillOpacity(1)
     .fill();

  // Wave 3 (Opacity 0.5)
  doc.path("M0 180C150 220 450 100 850 200V250H0V180Z")
     .fillColor(colors.waves.w3)
     .fillOpacity(0.5)
     .fill();

  doc.restore();

  doc.end();
};
