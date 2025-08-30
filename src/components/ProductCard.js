import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div
        className="border rounded-lg shadow-md p-4 flex flex-col items-center 
                      bg-white dark:bg-gray-800 dark:border-gray-700 transition 
                      hover:shadow-xl hover:scale-105 duration-300"
      >
        <LazyLoad height={200} offset={100}>
          <img
            src={product.image}
            alt={product.title}
            className="h-40 object-contain mb-4"
          />
        </LazyLoad>

        <h2 className="text-sm font-semibold text-center mb-2 line-clamp-2">
          {product.title}
        </h2>

        <p className="text-lg font-bold text-green-600 dark:text-green-400">
          ${product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
