import axios from "axios";
import { setupInterceptors } from "./interceptors";

export const http = axios.create({
  baseURL: "/api", // même si mock, on garde une base propre
  timeout: 8000,
});

setupInterceptors(http);
