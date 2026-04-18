
import { useContext } from "react";
import { AppContext } from "../AppContext";
import { Link } from "react-router-dom";

const RecommendationSection = ({ title, products: recommendedProducts }) => {
  const { navigate, backendUrl } = useContext(AppContext);

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-medium mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {recommendedProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => {
              navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
              window.scrollTo(0, 0);
            }}
            className="group cursor-pointer border border-gray-500/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
          >
            <div className="h-48 bg-gray-50 overflow-hidden">
              <img
                src={`${backendUrl}/products/${product.images?.[0]}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <p className="text-gray-500 text-xs mt-1">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold text-indigo-600">₹{product.offerPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
