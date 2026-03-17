import lostFoundApi from "../lostFoundApi";

export const editLostFoundProduct = async ({ formData }) => {
  // Implementation for editing a sell product
  const response = await lostFoundApi.put("/lost-found", formData);
  return response.data;
};

export const deleteLostFoundProduct = async ({ id }) => {
  // Implementation for deleting a sell product
  await lostFoundApi.delete(`/lost-found`, { id });
};
