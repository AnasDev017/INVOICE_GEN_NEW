import clientsModel from "../models/clientsModel.js";
import UserModel from "../models/userModel.js";


// Save Client

export const saveClient = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!email || !name || !phone || !address) {
      return res.status(400).json({ success: false, message: "All fields required!" });
    }

    // Get user and current client count
    const user = await UserModel.findById(req.user._id);
    const clientCount = await clientsModel.countDocuments({ user: req.user._id });

    // Check if free slot available
    if (clientCount >= user.clientStorage) {
      return res.status(403).json({
        success: false,
        message: `Cannot add more clients! limit: ${user.clientStorage}`
      });
    }

    // Check if client already exists
    const existsClient = await clientsModel.findOne({ email, user: req.user._id });
    if (existsClient) {
      return res.status(400).json({ success: false, message: "Client already exists!" });
    }

    // Save client
    const newClient = new clientsModel({
      user: req.user._id,
      name,
      email,
      phone,
      address
    });

    await newClient.save();
    res.status(200).json({ success: true, message: "Client saved successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};


//  Get Clients Data

export const getClients = async (req, res) => {
  try {
    const clients = await clientsModel
      .find({ user: req.user._id })
      .lean(); 

    res.status(200).json({
      success: true,
      clients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
