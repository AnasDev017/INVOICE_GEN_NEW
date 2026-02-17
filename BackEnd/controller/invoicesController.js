import invoiceModel from "../models/invoiceModel.js"

const getAllSavedInvoices = async(req,res)=>{
    try {
        console.log("USERID",req.user._id);

        // --- AUTO-UPDATE OVERDUE STATUS ---
        // If current date >= due date (and status is pending), mark as Overdue.
        // We use $lte: new Date() which compares with current timestamp.
        // This covers cases where due date was yesterday or earlier.
        const today = new Date();
        // normalizing today to start of day might be safer if due dates are just dates, 
        // but typically 'dueDate' implies end of that day. 
        // If user set due date to today, is it overdue? 
        // "match hojaye" -> if matches. So yes.
        
        await invoiceModel.updateMany(
            { 
                user: req.user._id, 
                status: { $regex: /^pending$/i }, // Case-insensitive check just in case
                dueDate: { $ne: null, $lt: today } 
            },
            { $set: { status: "Overdue" } }
        );

        const user = await invoiceModel.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        if(!user){
            return res.status(400).json({
                success: false,
                massege: "User Not Found!"
        })
    }
    res.status(200).json({
        user,
        success: true,
        massege:"Successfuly Fetch All Saved Invoices"
    })
    console.log("USER",user)
    } catch (error) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
}



export const deleteInvoice = async(req,res)=>{
    const {id} = req.params;
    try {
        const deletedInvoice = await invoiceModel.findOneAndDelete({ _id: id, user: req.user._id });
        if(!deletedInvoice){
            return res.status(404).json({ success: false, message: "Invoice not found or unauthorized" });
        }
        res.status(200).json({ success: true, message: "Invoice deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const getNextInvoiceNumber = async(req, res) => {
    try {
        const lastInvoice = await invoiceModel.findOne({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select("invoiceNumber");

        let nextId = "INV-001";

        if (lastInvoice && lastInvoice.invoiceNumber) {
            const parts = lastInvoice.invoiceNumber.split("-");
            if (parts.length === 2 && !isNaN(parts[1])) {
                const lastNum = parseInt(parts[1], 10);
                const nextNum = lastNum + 1;
                nextId = `INV-${String(nextNum).padStart(3, '0')}`;
            }
        }

        res.status(200).json({ success: true, nextId });
    } catch (error) {
        console.log("Error fetching next invoice number:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { getAllSavedInvoices }