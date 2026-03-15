import api from "../api";

export const editSellProduct = async ({ formData }) => {
  // Implementation for editing a sell product
  await api.put("/sell", formData);
};

export const deleteSellProduct = async ({ id }) => {
  // Implementation for deleting a sell product
  await api.delete(`/sell`, { id });
};
