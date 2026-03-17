import api from "../api";

export const editRentProduct = async ({ formData, id }) => {
  // Implementation for editing a rent product
  const response = await api.put(`/buy-rent/rent/products/${id}`, formData);
  return response.data;
};

export const deleteRentProduct = async ({ id }) => {
  // Implementation for deleting a rent product
  await api.delete(`/buy-rent/rent/products/${id}`);
};
