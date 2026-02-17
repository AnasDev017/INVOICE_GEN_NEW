import userModel from "../models/userModel.js";


const updateCredits = async(req,res)=>{
    try {
        const user = await userModel.findById(req.user._id);
  
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.maxCreditsLimit === 300) {
          user.credits = 300;
        } else if (user.maxCreditsLimit === 100) {
          user.credits = 100;
        } else if (user.maxCreditsLimit === 20) {
          user.credits = 20;
        }
      await user.save(); 
      
    res.status(200).json({
      success: true,
      message: "Successfuly Updates Credits!"
      
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error!" });
    }
}
export default updateCredits