import fs from 'fs';
import { createInvoicePDF } from './services/pdfService.js';

const dummyData = {
  invoiceNumber: 'INV-12345',
  date: '2023-10-27',
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  senderName: 'Jane Smith',
  senderEmail: 'jane@example.com',
  items: [
    { description: 'Web Development', quantity: 1, price: 1000 },
    { description: 'Hosting', quantity: 12, price: 20 },
  ],
  subTotal: 1240,
  discount: 40,
  grandTotal: 1200
};

const writeStream = fs.createWriteStream('test_invoice.pdf');
createInvoicePDF(dummyData, writeStream);

console.log('PDF generation started. Check test_invoice.');
console.log('PDF generation started. Check test_invoice.');
