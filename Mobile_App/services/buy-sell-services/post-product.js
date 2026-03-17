import api from "../api";

// const API = {
//   SELL: "/api/sell",
//   RENT: "/api/rent",
//   LOST: "/api/lost-found",
//   FOUND: "/api/lost-found",
// };

// const LISTING_TYPES = ["SELL", "RENT", "LOST", "FOUND"];

export const postSellProduct = async (productData) => {
  console.log(productData._parts);

  const response = await api.post("/buy-rent/buy/products", productData, {
    // transformRequest: (data, headers) => {
    //   delete headers["Content-Type"]; // Let axios/RN set it with boundary
    //   return data;
    // },
    timeout: 15000,
  });
  return response.data;
};
