import api from "../api";

export const GetRentProducts = async ({ college }) => {
  const response = await api.get(`/api/rent`, {
    timeout: 15000,
    params: { college },
  });
  return response.data;
};

export const myrentProducts = async ({ userid }) => {
  const response = await api.get(`/api/rent`, {
    timeout: 15000,
    params: { userid },
  });
  return response.data;
};
