import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const baseUrl = () => {
  return window.config.baseUrl;
};

export const loginUrl = () => {
  return window.config.loginUrl;
};

export const api = axios.create({
  baseURL: "https://api.dev.billingpay.com.br",
});

// Adicione um interceptor de solicitação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Faça algo antes de enviar a solicitação, como adicionar cabeçalhos personalizados
    // console.log("Request Interceptor:", config);
    config.headers["Authorization"] = window.sessionStorage.getItem("TOKEN");
    return config;
  },
  (error) => {
    // Faça algo com erros de solicitação
    return Promise.reject(error);
  }
);

// Adicione um interceptor de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Faça algo com os dados de resposta, como manipular erros globais
    // console.log("Response Interceptor:", response);
    return response;
  },
  (error) => {
    // Faça algo com erros de resposta
    return Promise.reject(error);
  }
);
