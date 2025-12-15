import {useContext} from "react";
import {AppContext} from "../AppContext";
import ProductCard from "./ProductCard";


 const BestSeller=()=>{
    const {products}=useContext(AppContext);  
  return(
     <div className="mt-16">
     <p className="text-2xl font-semibold md:text-3xl">Deal of the day</p>
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {
     products.filter((product)=>product.inStock && product.isDealOfDay)
     .slice(0,8)
     .map((product,index)=>
    (
      <ProductCard key={index} product={product}/> 
    ))
    }
   </div>
    

</div>
   );
 };
export default BestSeller;