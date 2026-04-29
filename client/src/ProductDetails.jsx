import { useState, useEffect, useContext } from "react";
import { AppContext } from "./AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "./assets/assets";
import RecommendationSection from "./components/RecommendationSection";
import { getImageUrl } from "./utils/imageUrl";

const ProductDetails = () => {
  const { products, navigate, addToCart, trackInteraction, axios, backendUrl } = useContext(AppContext);
  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  const product = products.find((product) => product._id === id);

  // Set initial thumbnail
  useEffect(() => {
    if (product?.images?.[0]) {
      const firstImage = product.images[0];
      setThumbnail(getImageUrl(firstImage, backendUrl));
    } else {
      setThumbnail(null);
    }

    if (product) {
        trackInteraction(product._id, "view");
        
        // Fetch similar products
        const fetchSimilar = async () => {
            try {
                const { data } = await axios.get(`/api/recommend/similar/${product._id}`);
                if (data.success) {
                    setSimilarProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch similar products", error);
            }
        };
        fetchSimilar();
    }
  }, [product, id]);

  if (!product) return <p>Product not found</p>;

  return (
    <div className="mt-16">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {" "}
          {product.category}
        </Link>{" "}
        / <span className="text-indigo-500"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Thumbnails and main image */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.images?.map((image, index) => (
              <div
                key={index}
                onClick={() =>
                  setThumbnail(getImageUrl(image, backendUrl))
                }
                className="border w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img
                  src={getImageUrl(image, backendUrl)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Product details */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  src={i < product.rating ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  key={i}
                  className="w-3.5 md:w-4"
                />
              ))}
            <p className="text-base ml-2">({product.rating})</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">MRP: ₹{product.price}</p>
            <p className="text-2xl font-medium">MRP: ₹{product.offerPrice}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {Array.isArray(product.description)
              ? product.description.map((desc, index) => <li key={index}>{desc}</li>)
              : product.description
              ? product.description
                  .split("\n")
                  .map((line, i) => <li key={i}>{line}</li>)
              : <li>No description available</li>}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
      <RecommendationSection title="Similar Products" products={similarProducts} />
    </div>
  );
};

export default ProductDetails;
