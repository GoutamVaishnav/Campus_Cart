import api from "../api";

export const verifyOtp = async ({ email, otpString }) => {
  const response = await api.post("/auth/verify-otp", {
    email,
    otp: otpString,
  });

  return response;
};
