import jwt from "jsonwebtoken";

export const authSeller = (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;
    const tokenHeader = req.headers.token;
    const authHeader = req.headers.authorization;

    let token = sellerToken || tokenHeader;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    console.log("Seller Auth - Cookies:", req.cookies ? Object.keys(req.cookies) : "None");
    console.log("Seller Auth - Token in Header:", !!tokenHeader);
    console.log("Seller Auth - Authorization Header:", !!authHeader);

    if (!token) {
      console.log("Seller Auth - No token found in cookies or headers");
      return res.status(401).json({ message: "Unauthorised - No token provided", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller" || decoded.email !== process.env.SELLER_EMAIL) {
      console.log("Seller Auth - Invalid role or email:", decoded.role, decoded.email);
      return res.status(401).json({ message: "Unauthorised - Invalid credentials", success: false });
    }

    req.seller = decoded.email;
    next();
  } catch (error) {
    console.error("Seller Authentication error:", error.message);
    return res.status(401).json({ message: "Unauthorised - Invalid or expired token", success: false });
  }
};