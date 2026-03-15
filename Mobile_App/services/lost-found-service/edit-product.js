import api from "../api";

export const editLostFoundProduct = async ({ formData }) => {
  // Implementation for editing a sell product
  await api.put("/lost-found", formData);
};

export const deleteLostFoundProduct = async ({ id }) => {
  // Implementation for deleting a sell product
  await api.delete(`/lost-found`, { id });
};
