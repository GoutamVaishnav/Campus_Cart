import { useEffect } from "react";
import useBuyStore from "../../store/useBuyStore";
import ProductListingScreen from "../../components/Products/product-listing";

export default function BuyPage() {
  const products = useBuyStore((s) => s.products);
  const isLoading = useBuyStore((s) => s.isLoading);
  const error = useBuyStore((s) => s.error);
  const fetchProducts = useBuyStore((s) => s.fetchProducts);

  // ✅ API called here — only when this screen mounts
  // ✅ If data is < 5 min old, the store skips the API call automatically
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductListingScreen
      PRODUCTS={products}
      page="buy"
      mode="browse"
      isLoading={isLoading}
      error={error}
      onRefresh={() => fetchProducts(true)} // force refresh on pull-to-refresh
    />
  );
}
