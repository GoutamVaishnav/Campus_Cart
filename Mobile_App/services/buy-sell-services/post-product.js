import api from "../api";

// const API = {
//   SELL: "/api/sell",
//   RENT: "/api/rent",
//   LOST: "/api/lost-found",
//   FOUND: "/api/lost-found",
// };

// const LISTING_TYPES = ["SELL", "RENT", "LOST", "FOUND"];

export const postSellProduct = async (productData) => {
  await api.post("/sell", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 15000,
  });
};
