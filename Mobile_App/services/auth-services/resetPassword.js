import api from "../api";

export const resetPassword = async ({
  email,
  newPassword,
  confirmPassword,
}) => {
  const response = await api.post("/auth/reset-password", {
    email,
    newPassword,
    confirmPassword,
  });

  return response;
};
