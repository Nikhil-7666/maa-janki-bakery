import jwt from "jsonwebtoken";

export const authSeller=(req,res,next)=>{
 try{
     const {sellerToken}=req.cookies;
    if(!sellerToken){
      return res.status(401).json({message:"Unauthorised",success:false});
  }
  const decoded =jwt.verify(sellerToken,process.env.JWT_SECRET);
     if(decoded.role !== "seller" || decoded.email!==process.env.SELLER_EMAIL){
      return res.status(401).json({message:"Unauthorised",success:false});
     }
    req.seller = decoded.email;
     next();
   }
    catch(error){
     console.error("Authentication error",error);
     return res.status(401).json({message:"Unauthorised",success:false});
  }
};