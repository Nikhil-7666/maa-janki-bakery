import {useState,useEffect,useContext} from "react";
import {dummyOrders,assets} from "../assets/assets";
import {AppContext} from "../AppContext";

const Orders = () => {
    const [orders, setOrders] = useState(null); // Initialize with null for loading check
    const { axios, backendUrl } = useContext(AppContext);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/seller", { withCredentials: true });
            console.log("Orders API response:", data);
            if (data.success) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            // toast.error(error.message); // toast might not be imported, use console
            setOrders([]);
        }
    };

    const statusHandler = async (orderId, status) => {
        try {
            const { data } = await axios.post("/api/order/status", { orderId, status }, { withCredentials: true });
            if (data.success) {
                await fetchOrders();
            }
        } catch (error) {
            console.error("Status update error:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (orders === null) {
        return <div className="p-10 text-center">Loading orders...</div>;
    }

    return (
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders?.map((order, index) => {
                    console.log("Rendering order:", order);
                    return (
                        <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                            <div className="flex gap-5">
                                <img
                                    className="w-12 h-12 object-cover opacity-60"
                                    src={order.items?.[0]?.product?.images?.[0] 
                                        ? `${backendUrl}/products/${order.items[0].product.images[0]}` 
                                        : "/placeholder.png"}
                                    alt="Product"
                                />
                                <div className="flex flex-col gap-1">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex flex-col justify-center">
                                            <p className="font-medium">
                                                {item.product?.name || "Unknown Product"} 
                                                <span className={`text-indigo-500 ${item.quantity < 2 ? "hidden" : ""}`}> x {item.quantity}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm">
                                <p className='font-medium mb-1'>{order.userId?.name || order.address?.firstName || "Unknown"} {order.userId?.name ? "" : (order.address?.lastName || "")}</p>
                                <p>
                                    {order.address?.street}, {order.address?.city}, {order.address?.state}, 
                                    {order.address?.zipcode}, {order.address?.country}
                                </p>
                            </div>

                            <p className="font-medium text-base my-auto text-black/70">₹{order.amount}</p>

                            <div className="flex flex-col text-sm">
                                <p>Method: {order.paymentType}</p>
                                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                                <select 
                                    onChange={(e) => statusHandler(order._id, e.target.value)} 
                                    value={order.status} 
                                    className="p-1 border border-gray-300 rounded mt-2 text-xs"
                                >
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Packing">Packing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for delivery">Out for delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

//   <p>Date: {new Date().toLocaleString().orderDate}</p>


export default Orders;