export const dadosEmpresa = JSON.parse(
  window.sessionStorage.getItem("DADOS_EMPRESA") ?? ""
);

export const token = window.sessionStorage.getItem("TOKEN");

export const decodedToken = JSON.parse(
  window.sessionStorage.getItem("DECODED_TOKEN") ?? ""
);
