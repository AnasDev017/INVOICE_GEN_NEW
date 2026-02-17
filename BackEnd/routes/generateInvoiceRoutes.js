import  express  from "express";
import { generateInvoice, downloadSavedInvoice } from "../controller/generateInvoiceController.js";
import { checkCredits } from "../middleware/checkCredits.js";
import {tokenVerifcation} from "../middleware/tokenVerifcation.js"

const generateInvoiceRoutes = express.Router()

generateInvoiceRoutes.post('/generateInvoice',tokenVerifcation,checkCredits,generateInvoice)
generateInvoiceRoutes.get('/downloadInvoice/:id',tokenVerifcation,downloadSavedInvoice)

export default generateInvoiceRoutes