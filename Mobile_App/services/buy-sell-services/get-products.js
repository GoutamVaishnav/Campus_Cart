import api from "../api";

export const getSellProducts = async ({ college }) => {
  const response = await api.get(`/api/sell`, {
    timeout: 15000,
    params: { college },
  });
  return response.data;
};

export const mysellProducts = async ({ userid }) => {
  const response = await api.get(`/api/sell`, {
    timeout: 15000,
    params: { userid },
  });
  return response.data;
};
