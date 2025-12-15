import jwt from "jsonwebtoken";

///// logout seller : /api/seller/login

export const sellerLogin = async(req, res) => {
  try  {
    const { email, password } = req.body;
    if (
      email !== process.env.SELLER_EMAIL || 
      password !== process.env.SELLER_PASSWORD
    ) {
      return res
        .status(401)
        .json({ message: "Invalid seller credentials", success: false });
    }

    const token = jwt.sign(
      { email, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", success: true });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


///// logout seller : /api/seller/logout

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({message: "Logout successful", success: true });
  } catch (error) {
    console.error("Error in sellerLogout:", error);
    res.status(500).json({message: "Internal server error" });
  }
};


//check auth seller : /api/seller/is-auth

export const isAuthSeller = async(req, res) => {
  try {
      res.status(200).json({
      success:true,
     });     
    } catch (error) {
      console.error("Error in sellerLogout:", error);
      res.status(500).json({message: "Internal server error" });
  }
};










