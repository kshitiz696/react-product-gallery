import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(" Failed to load product details. Please try again.");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-gray-500 p-6">Loading product...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!product) return <p className="text-gray-500 p-6">Product not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/" className="text-blue-500 hover:underline">
        ← Back
      </Link>

      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <img
          src={product.image}
          alt={product.title}
          className="h-60 mx-auto mb-6 object-contain"
        />
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {product.description}
        </p>
        <p className="text-lg font-bold text-green-600 mb-2">
          ${product.price}
        </p>
        <p className="italic">Category: {product.category}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
