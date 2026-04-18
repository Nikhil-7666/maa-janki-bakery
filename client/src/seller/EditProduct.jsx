import { useState, useContext, useEffect } from "react";
import { assets, categories } from "../assets/assets";
import { AppContext } from "../AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { axios, backendUrl, fetchProducts } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isDealOfDay, setIsDealOfDay] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [tags, setTags] = useState("");
  const [stock, setStock] = useState(0);
  const [stockThreshold, setStockThreshold] = useState(10);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        if (data.success) {
          const p = data.product;
          setName(p.name);
          setPrice(p.price);
          setOfferPrice(p.offerPrice);
          setDescription(p.description);
          setCategory(p.category);
          setIsDealOfDay(p.isDealOfDay || false);
          setInStock(p.inStock !== undefined ? p.inStock : true);
          setTags(p.tags ? p.tags.join(", ") : "");
          setStock(p.stock || 0);
          setStockThreshold(p.stockThreshold || 10);
          setExistingImages(p.images || []);
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    };
    fetchProductDetails();
  }, [id, axios]);

  const handleRemoveExistingImage = (imgName) => {
    setExistingImages((prev) => prev.filter((img) => img !== imgName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("category", category);
      formData.append("isDealOfDay", isDealOfDay);
      formData.append("inStock", inStock);
      formData.append("tags", tags);
      formData.append("stock", stock);
      formData.append("stockThreshold", stockThreshold);
      
      // Send existing images as a JSON string or individual appends
      formData.append("keepImages", JSON.stringify(existingImages));

      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const { data } = await axios.put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        navigate("/seller/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-2xl font-medium">Edit Product</h2>
        
        <div>
          <p className="text-base font-medium">Current Images</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={`${backendUrl}/products/${img}`} className="w-20 h-20 object-cover border rounded" />
                <button 
                  type="button" 
                  onClick={() => handleRemoveExistingImage(img)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-base font-medium mt-4">Add New Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    id={`image${index}`}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                  />
                  <img
                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                    alt="uploadArea"
                    className="max-w-24 cursor-pointer"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label htmlFor="product-name" className="text-base font-medium">Product Name</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label htmlFor="product-description" className="text-base font-medium">Product Description</label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="category" className="text-base font-medium">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.path}>{cat.path}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label htmlFor="product-tags" className="text-base font-medium">Tags (Separate with comma)</label>
          <input
            id="product-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label htmlFor="product-price" className="text-base font-medium">Product Price</label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label htmlFor="offer-price" className="text-base font-medium">Offer Price</label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label htmlFor="product-stock" className="text-base font-medium">Inventory Stock</label>
            <input
              id="product-stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label htmlFor="stock-threshold" className="text-base font-medium">Stock Threshold</label>
            <input
              id="stock-threshold"
              type="number"
              value={stockThreshold}
              onChange={(e) => setStockThreshold(e.target.value)}
              placeholder="10"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-base font-medium">
            <input
                type="checkbox"
                checked={isDealOfDay}
                onChange={(e) => setIsDealOfDay(e.target.checked)}
                className="h-4 w-4"
            />
            Mark as Deal of the Day
            </label>

            <label className="flex items-center gap-3 text-base font-medium">
            <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4"
            />
            In Stock
            </label>
        </div>

        <div className="flex gap-4">
            <button type="submit" className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">UPDATE</button>
            <button type="button" onClick={() => navigate("/seller/product-list")} className="px-8 py-2.5 bg-gray-200 text-gray-700 font-medium rounded">CANCEL</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
