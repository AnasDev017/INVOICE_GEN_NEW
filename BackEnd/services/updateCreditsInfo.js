import userModel from "../models/userModel.js"

export const updateCreditsInfo = async(req,res)=>{
try {
    const user = await userModel.findById(req.user._id)
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({
        credits: user.credits
      });
} catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
}
}