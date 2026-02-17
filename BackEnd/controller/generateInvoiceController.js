// Import required modules
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import fs from "fs";                     // File system to read HTML template
import path from "path";                 // Path module to handle file paths
import { fileURLToPath } from "url";     // Needed to define __dirname in ESM
import invoiceModel from "../models/invoiceModel.js";
import UserModel from "../models/userModel.js";
import crypto from "crypto";

// ------------------------
// Define __dirname in ESM mode
// ------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------
// Exported function to generate invoice PDF
// ------------------------
export const generateInvoice = async (req, res) => {
  let browser = null;
  try {
    const { items, formData, template, status, discountAmount, sendOptions } = req.body;
    
    // Log environment info for debugging
    console.log("📂 Current working directory:", process.cwd());
    console.log("📂 __dirname:", __dirname);

    // Try multiple path strategies for Vercel
    const strategies = [
      path.join(process.cwd(), "BackEnd", "utils", `${template}.html`),
      path.join(process.cwd(), "utils", `${template}.html`),
      path.join(__dirname, "..", "utils", `${template}.html`)
    ];

    let templatePath = "";
    for (const p of strategies) {
      if (fs.existsSync(p)) {
        templatePath = p;
        break;
      }
    }

    if (!templatePath) {
      console.error("❌ Template not found in strategies:", strategies);
      return res.status(400).send(`Template not found. Checked: ${strategies.join(", ")}`);
    }

    console.log("✅ Using template at:", templatePath);
    let html = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders
    html = html.replace("{{clientName}}", formData.clientName)
               .replace("{{clientEmail}}", formData.clientEmail)
               .replaceAll("{{invoiceId}}", formData.invoiceNumber)
               .replace("{{date}}", formData.dueDate);
    
    const user = await UserModel.findById(req.user._id);
    const senderName = user ? user.name : "Sender";
    const senderEmail = user ? user.email : "";

    html = html.replace("{{senderName}}", senderName)
               .replace("{{senderEmail}}", senderEmail);

    let subTotal = 0;
    let itemsHtml = items.map(i => {
      const qty = Number(i.quantity);
      const price = Number(i.price);
      const rowTotal = qty * price;
      subTotal += rowTotal;
      return `
        <tr class="border-thin">
          <td class="py-4 px-4 font-medium">${i.description}</td>
          <td class="py-4 px-4 text-center">${qty}</td>
          <td class="py-4 px-4 text-center">$${price.toFixed(2)}</td>
          <td class="py-4 px-4 text-right font-bold">$${rowTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join("");

    const discount = Number(discountAmount || 0);
    const grandTotal = subTotal - discount;

    html = html
      .replace("{{items}}", itemsHtml)
      .replace("{{subTotal}}", subTotal.toFixed(2))
      .replace("{{discount}}", discount.toFixed(2))
      .replace("{{grandTotal}}", grandTotal.toFixed(2));

    // Launch settings for Node 20+ (Vercel AL2023)
    try {
      if (process.env.NODE_ENV === "production") {
        browser = await puppeteer.launch({
          args: [
            ...chromium.args,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--no-zygote",
            "--disable-gpu",
            "--single-process",
          ],
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
      } else {
        console.log("🛠️ Launching Local Puppeteer...");
        browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          headless: true,
        });
      }
      console.log("✅ Browser launched successfully");
    } catch (launchError) {
      console.error("❌ Browser launch failed:", launchError);
      throw launchError;
    }

    
    const page = await browser.newPage();            
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const pdfBuffer = await page.pdf({               
      format: 'A4',
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" } 
    });

    await browser.close();  

    await invoiceModel.create({
      user: req.user._id,
      invoiceId: crypto.randomUUID(),
      clientName: formData.clientName,
      invoiceNumber: formData.invoiceNumber,
      totalAmount: grandTotal,
      status,
      dueDate: formData.dueDate,
    });
    
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=Invoice_${formData.invoiceNumber}.pdf`,
    });
    
    res.send(pdfBuffer);

  } catch (err) {
    console.error("🔥 Error in generateInvoice:", err);
    if (browser) await browser.close();
    res.status(500).send(`Error generating PDF: ${err.message}`);
  }
};

export const downloadSavedInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await invoiceModel.findOne({ _id: id, user: req.user._id });

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        // Try multiple path strategies for Vercel
        const strategies = [
            path.join(process.cwd(), "BackEnd", "utils", "template1.html"),
            path.join(process.cwd(), "utils", "template1.html"),
            path.join(__dirname, "..", "utils", "template1.html")
        ];

        let templatePath = "";
        for (const p of strategies) {
            if (fs.existsSync(p)) {
                templatePath = p;
                break;
            }
        }

        if (!templatePath) {
            console.error("❌ Template not found in strategies:", strategies);
            return res.status(404).send(`Template not found. Checked: ${strategies.join(", ")}`);
        }

        console.log("✅ Using template at:", templatePath);
        let html = fs.readFileSync(templatePath, "utf-8");


        // Mock items since we don't save them
        const items = [{
            description: "Invoice Services (Summary)",
            quantity: 1,
            price: invoice.totalAmount
        }];

        // Replace placeholders
        // Note: We might be missing clientEmail if not saved, so fallback to empty
        html = html.replace("{{clientName}}", invoice.clientName)
                   .replace("{{clientEmail}}", "") 
                   .replaceAll("{{invoiceId}}", invoice.invoiceNumber)
                   .replace("{{date}}", new Date(invoice.createdAt).toLocaleDateString());

        // Fetch sender details
        const user = await UserModel.findById(req.user._id);
        const senderName = user ? user.name : "Sender";
        const senderEmail = user ? user.email : "";
 
        html = html.replace("{{senderName}}", senderName)
                   .replace("{{senderEmail}}", senderEmail);

        let subTotal = 0;
        let itemsHtml = items.map(i => {
            const qty = Number(i.quantity);
            const price = Number(i.price);
            const rowTotal = qty * price;
            subTotal += rowTotal;
            return `
                <tr class="border-thin">
                <td class="py-4 px-4 font-medium">${i.description}</td>
                <td class="py-4 px-4 text-center">${qty}</td>
                <td class="py-4 px-4 text-center">$${price.toFixed(2)}</td>
                <td class="py-4 px-4 text-right font-bold">$${rowTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join("");

        const discount = 0; // Not saved
        const grandTotal = subTotal; // Already total

        html = html
            .replace("{{items}}", itemsHtml)
            .replace("{{subTotal}}", subTotal.toFixed(2))
            .replace("{{discount}}", discount.toFixed(2))
            .replace("{{grandTotal}}", grandTotal.toFixed(2));

        // Launch settings for Node 20+ (Vercel AL2023)
        try {
            if (process.env.NODE_ENV === "production") {
                browser = await puppeteer.launch({
                    args: [
                        ...chromium.args,
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--no-zygote",
                        "--disable-gpu",
                        "--single-process",
                    ],
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath(),
                    headless: chromium.headless,
                });
            } else {
                console.log("🛠️ Launching Local Puppeteer...");
                browser = await puppeteer.launch({
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                    headless: true,
                });
            }
            console.log("✅ Browser launched successfully");
        } catch (launchError) {
            console.error("❌ Browser launch failed:", launchError);
            throw launchError;
        }


        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
        });
        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=${invoice.invoiceNumber}.pdf`,
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("🔥 Error downloading PDF:", err);
        if (browser) await browser.close();
        res.status(500).send(`Error downloading PDF: ${err.message}`);
    }
};
