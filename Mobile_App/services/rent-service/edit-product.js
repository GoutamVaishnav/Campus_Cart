import api from "../api";

export const editRentProduct = async ({ formData }) => {
  // Implementation for editing a rent product
  await api.put("/rent", formData);
};

export const deleteRentProduct = async ({ id }) => {
  // Implementation for deleting a rent product
  await api.delete(`/rent`, { id });
};
