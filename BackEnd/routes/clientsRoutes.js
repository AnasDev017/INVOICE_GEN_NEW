import  express  from "express";
import { saveClient, getClients } from "../controller/clientsController.js";
const clientsRouts = express.Router()
import { tokenVerifcation } from "../middleware/tokenVerifcation.js";

clientsRouts.post("/saveClient",tokenVerifcation,saveClient)
clientsRouts.get("/getClients",tokenVerifcation,getClients)



export default clientsRouts