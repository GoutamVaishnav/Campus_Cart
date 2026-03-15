import api from "../api";

// const API = {
//   SELL: "/api/sell",
//   RENT: "/api/rent",
//   LOST: "/api/lost-found",
//   FOUND: "/api/lost-found",
// };

// const LISTING_TYPES = ["SELL", "RENT", "LOST", "FOUND"];

export const postLostFoundProduct = async (productData) => {
  // if (!LISTING_TYPES.includes(listingType)) {
  //   throw new Error("Invalid listing type");
  // }

  //   const url = API[listingType];

  await api.post("/lost-found", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 15000,
  });
};
