import { colleges } from "@/constants/userData";
import api from "../api";

export const signupUser = async ({ name, email, phone, password, college }) => {
  const response = await api.post("/auth/signup", {
    name,
    email,
    phone,
    password,
    college,
  });

  return response;
};
