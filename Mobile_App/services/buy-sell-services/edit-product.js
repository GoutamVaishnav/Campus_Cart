import api from "../api";

export const editSellProduct = async ({ formData, id }) => {
  // Implementation for editing a sell product
  console.log(id);

  const response = await api.put(`/buy-rent/buy/products/${id}`, formData, {
    timeout: 15000,
  });
  return response.data;
};

export const deleteSellProduct = async ({ id }) => {
  // Implementation for deleting a sell product
  await api.delete(`/buy-rent/buy/products/${id}`);
};
