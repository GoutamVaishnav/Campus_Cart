import api from "../api";

export const GetLostFoundProducts = async ({ college }) => {
  const response = await api.get(`/api/lost-found`, {
    timeout: 15000,
    params: { college },
  });
  return response.data;
};

export const mylostfoundProducts = async ({ userid }) => {
  const response = await api.get(`/api/lost-found`, {
    timeout: 15000,
    params: { userid },
  });
  return response.data;
};
