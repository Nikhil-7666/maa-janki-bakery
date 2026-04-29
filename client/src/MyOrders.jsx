import {useContext, useState, useEffect } from "react";
import { dummyOrders } from "./assets/assets";
import {AppContext} from "./AppContext";
import toast from "react-hot-toast";
import BackButton from "./components/BackButton";
import { getImageUrl } from "./utils/imageUrl";

function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const {axios,user, backendUrl}=useContext(AppContext);

  const fetchOrders = async() => {
    try{
          const {data}=await axios.get("/api/order/user");
      console.log("data",data);
       if(data.success){
          setMyOrders(data.orders);   
      }
   else{
           toast.error(data.message);
     
    }
    } 
    catch(error){
        toast.error(error.message);
   }  
  };


  useEffect(() => {
    if(user){
    fetchOrders();
  }
  }, []);

  return (
    <div className="mt-4 pb-16">
      <BackButton />
      <div className="mt-8">
        <p className="text-2xl font-medium md:text-3xl">My Orders</p>
      </div>

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between items-center gap-6">
             <span>Order ID: {order._id}</span>
             <span>Payment: {order.paymentType}</span>
             {order.address && (
               <span className="text-sm text-gray-500">
                 Delivery to: {order.address.street || order.address.address}, {order.address.city}
               </span>
             )}
             <span>Total Amount: ₹{order.amount}</span>
           </p>

          {order.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={`relative bg-white text-gray-800 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl ${
                itemIndex !== order.items.length - 1 ? "border-b border-gray-300" : ""
              }`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg">
                  <img
                    src={getImageUrl(item.product.images?.[0], backendUrl)}
                    alt={item.product.name}
                    className="w-16 h-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium">{item.product.name}</h2>
                  <p>{item.product.category}</p>
                </div>
              </div>

              <div className="text-lg font-medium">
                <p>Quantity: {item.quantity || 1}</p>
                <p>Status: {order.status }</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <p className="text-lg">
                Amount: ₹{item.product.offerPrice * (item.quantity || 1)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
