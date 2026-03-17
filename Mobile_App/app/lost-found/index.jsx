import { useEffect } from "react";
import useLostFoundStore from "@/store/useLostFoundStore";
import ProductListingScreen from "../../components/Products/product-listing";

export default function LostFoundPage() {
  const items = useLostFoundStore((s) => s.items);
  const isLoading = useLostFoundStore((s) => s.isLoading);
  const error = useLostFoundStore((s) => s.error);
  const fetchItems = useLostFoundStore((s) => s.fetchItems);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ProductListingScreen
      PRODUCTS={items}
      page="lost-found"
      mode="browse"
      isLoading={isLoading}
      error={error}
      onRefresh={() => fetchItems(true)}
    />
  );
}
