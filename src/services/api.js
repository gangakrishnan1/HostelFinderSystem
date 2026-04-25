import axios from "axios";
import fallbackHostels from "../data/hostels.json";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

export async function loginUser({ username, password }) {
  const response = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  return response.data;
}

export async function getHostels() {
  return fallbackHostels;
}
