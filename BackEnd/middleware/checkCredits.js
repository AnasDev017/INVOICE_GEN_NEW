import userModel from "../models/userModel.js"

export const checkCredits = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (user.credits < 5) {
        return res.status(401).json({
          message: "Not enough credits",
          success: false,
        });
      }
  
      user.credits -= 5;
      await user.save(); 
  
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error!" });
    }
  };
  