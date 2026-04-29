import  {Routes,Route,useLocation} from "react-router-dom";
import Home from "./Home";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import NavBar from "./NavBar";
import {useContext } from "react";
import {AppContext} from "./AppContext";
import MyOrders   from "./MyOrders";
import Auth from "./models/Auth";
import ProductCategory from "./pages/ProductCategory";
import {Toaster} from "react-hot-toast";
import AppContextProvider from "./AppContext";
import AddAddress from "./pages/AddAddress";
import Footer from "./components/Footer";
import SellerLogin from "./seller/SellerLogin";
import SellerLayout from "./seller/SellerLayout";
import UserProfile from "./pages/UserProfile";
import Chatbot from "./components/chatbot";

import AddProduct from "./seller/AddProduct";
import EditProduct from "./seller/EditProduct";
import ProductList from "./seller/ProductList";
import Orders from "./seller/Orders";
import BakeSmartDashboard from "./pages/BakeSmartDashboard";



const App = () => {
    const {isSeller, isSellerLoading, showUserLogin, user, navigate}=useContext(AppContext);
   const isSellerPath=useLocation().pathname.includes("seller");
  return (
    <div className="text-default min-h-screen">
        {isSellerPath ? null : <NavBar/> }
        {showUserLogin ? <Auth/> : null }
    <Toaster/>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        {user && (!user.address || !user.phoneNumber || !user.dob) && !isSellerPath && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6 flex items-center justify-between shadow-sm animate-pulse">
            <div>
              <p className="text-indigo-900 font-medium">Complete Your Profile</p>
              <p className="text-indigo-600 text-sm">Please add your address and phone number for a faster checkout experience.</p>
            </div>
            <button 
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-full hover:bg-indigo-600 transition"
            >
              Complete Now
            </button>
          </div>
        )}
        <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/products" element={<Products/>}/>
         <Route path="/products/:category/:id" element={<ProductDetails/>}/>
         <Route path="/products/:category" element={<ProductCategory/>}/>

         <Route path="/cart" element={<Cart/>}/>
         <Route path="/my-orders" element={<MyOrders/>}/>
         <Route path="/add-address" element={<AddAddress/>}/>
         <Route path="/profile" element={<UserProfile/>}/>
         <Route path="/admin-dashboard" element={<BakeSmartDashboard />} />

    <Route path="/seller" 
        element={
          isSellerLoading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-lg">Loading...</div>
            </div>
          ) : isSeller ? (
            <SellerLayout/>
          ) : (
            <SellerLogin/>
          )
        }
         >   
               
          <Route index 
           element={isSeller? <Dashboard />:null } 
           />

          <Route path="add-product" 
           element={isSeller? <AddProduct />:null } 
           />

           <Route 
              path="product-list"  
              element={isSeller? <ProductList />:null }
            />
          <Route 
              path="edit-product/:id"  
              element={isSeller? <EditProduct />:null }
            />
          <Route 
          path="orders" 
        element={isSeller ? <Orders/>:null}
                              
          />
      </Route> 

 
        </Routes>
      </div>
       {isSellerPath? null :<Footer/>}
       <Chatbot />
   </div>
  );
};

export default App;
