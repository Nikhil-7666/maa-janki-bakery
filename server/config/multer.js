import multer from "multer";
 
  const storage=multer.diskStorage({
    destination:"products",
      
    filename:(req,file,cb)=>{
   
      return cb(null,`${Date.now()}${file.originalname}`);
  },
    
 }); 

export const upload=multer({storage:storage});