import api from "../api";
import { saveTokens, saveUser } from "../tokenService";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const { accessToken, refreshToken, user } = response.data;

  await saveTokens(accessToken, refreshToken);

  await saveUser(user);

  return response;
};
