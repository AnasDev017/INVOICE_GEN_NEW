import express from "express"
import { updateCreditsInfo } from "../services/updateCreditsInfo.js"
import { tokenVerifcation } from "../middleware/tokenVerifcation.js"
import updateCredits from "../services/creditsUpdater.js"
import { getAllSavedInvoices, deleteInvoice, getNextInvoiceNumber } from "../controller/invoicesController.js"
const serviesRoutes = express.Router()

serviesRoutes.get("/getCreditInfo",tokenVerifcation,updateCreditsInfo)
serviesRoutes.get("/updateCredits",tokenVerifcation,updateCredits)
serviesRoutes.get("/getAllSavedInvoices",tokenVerifcation,getAllSavedInvoices)
serviesRoutes.delete("/deleteInvoice/:id",tokenVerifcation,deleteInvoice)
serviesRoutes.get("/getNextInvoiceNumber",tokenVerifcation,getNextInvoiceNumber)
export default serviesRoutes