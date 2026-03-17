import { useEffect } from "react";
import useMyListingsStore from "@/store/useMyListingsStore";
import useUserStore from "@/store/useUserStore";
import ProductListingScreen from "../../components/Products/product-listing";

export default function MyListingsLostFoundPage() {
  const userId = useUserStore((s) => s.getUserId());
  const lostFoundListings = useMyListingsStore((s) => s.lostFoundListings);
  const isLoading = useMyListingsStore((s) => s.isLoading);
  const error = useMyListingsStore((s) => s.error);
  const fetchMyListings = useMyListingsStore((s) => s.fetchMyListings);

  useEffect(() => {
    if (userId) fetchMyListings(userId);
  }, [userId]);

  return (
    <ProductListingScreen
      PRODUCTS={lostFoundListings}
      page="lost-found"
      mode="manage"
      isLoading={isLoading}
      error={error}
      onRefresh={() => fetchMyListings(userId, true)}
    />
  );
}
