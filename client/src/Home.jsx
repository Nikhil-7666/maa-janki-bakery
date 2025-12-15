import Hero from "./components/Hero";
import Category from "./components/Category";
import BestSeller from "./components/BestSeller";
import ProductCard from "./components/ProductCard";
import NewsLetter from "./components/NewsLetter";


const Home =()=>
{
 return(
   <div className="mt-10">
  <Hero/>
  <Category/>
  <BestSeller/>
  <ProductCard/>  
  <NewsLetter/>
     </div>
 );
}
export default Home;




