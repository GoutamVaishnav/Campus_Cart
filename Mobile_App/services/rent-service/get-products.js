import api from "../api";
export const GetRentProducts = async ({ college }) => {
  console.log("reached");

  const response = await api.get(`/buy-rent/rent/products`, {
    timeout: 15000,
    params: { college },
  });
  return response.data;
};

export const myrentProducts = async ({ userid }) => {
  const response = await api.get(`/buy-rent/rent/my-products`, {
    timeout: 15000,
    params: { userid },
  });
  // console.log(response.data);

  return response.data;
};

export const GetRentProductById = async ({ productId }) => {
  const response = await api.get(`/buy-rent/rent/products/${productId}`, {
    timeout: 15000,
  });
  return response.data;
};
