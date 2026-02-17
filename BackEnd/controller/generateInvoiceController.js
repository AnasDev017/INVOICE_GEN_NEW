// Import required modules
import invoiceModel from "../models/invoiceModel.js";
import UserModel from "../models/userModel.js";
import crypto from "crypto";
import { createInvoicePDF } from "../services/pdfService.js";

// ------------------------
// Exported function to generate invoice PDF
// ------------------------
export const generateInvoice = async (req, res) => {
  try {
    const { items, formData, template, status, discountAmount, sendOptions } = req.body;
    
    // Calculate totals
    let subTotal = 0;
    items.forEach(i => {
      const qty = Number(i.quantity);
      const price = Number(i.price);
      subTotal += qty * price;
    });

    const discount = Number(discountAmount || 0);
    const grandTotal = subTotal - discount;

    // Fetch sender details
    const user = await UserModel.findById(req.user._id);
    const senderName = user ? user.name : "Sender";
    const senderEmail = user ? user.email : "";

    // Prepare data for PDF
    const pdfData = {
      invoiceNumber: formData.invoiceNumber,
      date: formData.dueDate,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      senderName,
      senderEmail,
      items,
      subTotal,
      discount,
      grandTotal
    };

    // Save invoice to DB first
    await invoiceModel.create({
      user: req.user._id,
      invoiceId: crypto.randomUUID(),
      clientName: formData.clientName,
      invoiceNumber: formData.invoiceNumber,
      totalAmount: grandTotal,
      status,
      dueDate: formData.dueDate,
    });
    
    // Set headers and generate PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=Invoice_${formData.invoiceNumber}.pdf`,
    });

    createInvoicePDF(pdfData, res);

  } catch (err) {
    console.error("🔥 Error in generateInvoice:", err);
    if (!res.headersSent) {
      res.status(500).send(`Error generating PDF: ${err.message}`);
    }
  }
};

export const downloadSavedInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await invoiceModel.findOne({ _id: id, user: req.user._id });

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        // Mock items since we don't save them in DB (based on previous logic)
        // Previous logic:
        /*
        const items = [{
            description: "Invoice Services (Summary)",
            quantity: 1,
            price: invoice.totalAmount
        }];
        */
        const items = [{
            description: "Invoice Services (Summary)",
            quantity: 1,
            price: invoice.totalAmount
        }];

        // Fetch sender details
        const user = await UserModel.findById(req.user._id);
        const senderName = user ? user.name : "Sender";
        const senderEmail = user ? user.email : "";

        const pdfData = {
            invoiceNumber: invoice.invoiceNumber,
            date: new Date(invoice.createdAt).toLocaleDateString(),
            clientName: invoice.clientName,
            clientEmail: "", // Not saved in DB
            senderName,
            senderEmail,
            items,
            subTotal: invoice.totalAmount, // Assuming no discount saved/restorable perfectly
            discount: 0,
            grandTotal: invoice.totalAmount
        };

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=${invoice.invoiceNumber}.pdf`,
        });

        createInvoicePDF(pdfData, res);

    } catch (err) {
        console.error("🔥 Error downloading PDF:", err);
        if (!res.headersSent) {
            res.status(500).send(`Error downloading PDF: ${err.message}`);
        }
    }
};
