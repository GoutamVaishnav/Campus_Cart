import api from "../api";

export const getSellProducts = async ({ college }) => {
  console.log("api hit");
  const response = await api.get(`/buy-rent/buy/products`, {
    timeout: 15000,
    params: { college },
  });
  console.log(response);
  console.log("heelp");
  return response.data;
};

export const mysellProducts = async ({ userid }) => {
  console.log("API HIT");
  const response = await api.get(`/buy-rent/buy/my-products`, {
    timeout: 15000,
    params: { userid },
  });
  // console.log(response.data);
  return response.data;
};

export const getProductById = async ({ id }) => {
  console.log(id);
  console.log("api");

  const response = await api.get(`/buy-rent/buy/products/${id}`, {
    timeout: 15000,
  });
  return response.data;
};
