import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { ThemeContext } from "../context/ThemeContext";
import SearchBar from "../components/SearchBar";
import ProductList from "../components/ProductList";
import useDebounce from "../hooks/useDebounce";
import axios from "axios";

const Home = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // reset error before fetch
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        setAllProducts(res.data);
        setVisibleProducts(res.data.slice(0, 6)); // show first 6 initially
      } catch (err) {
        console.error("Error fetching products", err);
        setError(" Failed to load products. Please try again.");
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter products when search changes
  useEffect(() => {
    if (!debouncedSearch) {
      setVisibleProducts(allProducts.slice(0, 6));
      setPage(1);
      return;
    }

    const filtered = allProducts.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setVisibleProducts(filtered.slice(0, 6));
    setPage(1);
  }, [debouncedSearch, allProducts]);

  // Load more products
  const loadMore = useCallback(() => {
    const filtered = debouncedSearch
      ? allProducts.filter((item) =>
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : allProducts;

    const nextPage = page + 1;
    const nextProducts = filtered.slice(0, nextPage * 6);
    setVisibleProducts(nextProducts);
    setPage(nextPage);
  }, [page, allProducts, debouncedSearch]);

  // IntersectionObserver for infinite scroll
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadMore]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold"> Product Gallery</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchBar onSearch={setSearchTerm} />
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-blue-500 text-white dark:bg-yellow-500"
          >
            {theme === "light" ? " Dark" : " Light"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 flex flex-col items-center">
        {/* Error Message */}
        {error && (
          <div className="text-center my-6">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Products */}
        {!error && visibleProducts.length === 0 && !loading && (
          <p className="text-gray-500">No products found</p>
        )}

        {/* Product List */}
        {!error && <ProductList products={visibleProducts} />}

        {/* Sentinel for Infinite Scroll */}
        {!error && <div ref={lastProductRef} className="h-10"></div>}

        {/* Loading */}
        {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      </main>
    </div>
  );
};

export default Home;
