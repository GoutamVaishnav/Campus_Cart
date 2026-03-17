import { useEffect } from "react";
import useRentStore from "@/store/useRentStore";
import ProductListingScreen from "../../components/Products/product-listing";

export default function RentPage() {
  const products = useRentStore((s) => s.products);
  const isLoading = useRentStore((s) => s.isLoading);
  const error = useRentStore((s) => s.error);
  const fetchProducts = useRentStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductListingScreen
      PRODUCTS={products}
      page="rent"
      mode="browse"
      isLoading={isLoading}
      error={error}
      onRefresh={() => fetchProducts(true)}
    />
  );
}
