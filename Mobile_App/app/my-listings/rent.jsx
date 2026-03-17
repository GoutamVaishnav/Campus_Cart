import { useEffect } from "react";
import useMyListingsStore from "@/store/useMyListingsStore";
import useUserStore from "@/store/useUserStore";
import ProductListingScreen from "../../components/Products/product-listing";

export default function MyListingsRentPage() {
  const userId = useUserStore((s) => s.getUserId());
  const rentListings = useMyListingsStore((s) => s.rentListings);
  const isLoading = useMyListingsStore((s) => s.isLoading);
  const error = useMyListingsStore((s) => s.error);
  const fetchMyListings = useMyListingsStore((s) => s.fetchMyListings);

  useEffect(() => {
    if (userId) fetchMyListings(userId);
  }, [userId]);

  return (
    <ProductListingScreen
      PRODUCTS={rentListings}
      page="rent"
      mode="manage"
      isLoading={isLoading}
      error={error}
      onRefresh={() => fetchMyListings(userId, true)}
    />
  );
}
