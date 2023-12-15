import banner from "../assets/mulher-rh.jpg";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { api, baseUrl } from "../api";
import axios from "axios";

function MainPage() {
  const navigate = useNavigate();

  async function autenticar() {
    api
      .post(`/autenticacao`, {
        senha: "#Trocar123",
        usuario: "16949928000157",
      })
      .then((res_1) => {
        const token = res_1.data.token;
        window.sessionStorage.setItem("TOKEN", token);

        const decodedToken = jwtDecode(token);

        window.sessionStorage.setItem(
          "DECODED_TOKEN",
          JSON.stringify(decodedToken)
        );

        console.log("🚀 ~ token:", token);
        axios
          .get(baseUrl() + `/cliente/conta-acesso/${decodedToken.jti}`, {
            headers: { Authorization: token },
          })
          .then((res_2) => {
            window.sessionStorage.setItem(
              "DADOS_EMPRESA",
              JSON.stringify(res_2.data)
            );

            const isEmpresa = res_2.data.tiposDePerfis.find(
              (perfil: string) => (perfil === "EMPRESA") !== undefined
            );

            if (isEmpresa) {
              navigate("/colaboradores");
            }
          });
      })
      .catch((err) => {
        console.log("🚀 ~ err:", err);
      });
  }

  return (
    <div className="flex">
      <div className="bg-black absolute top-0 left-0 w-full h-full bg-opacity-50" />
      <img
        src={banner}
        alt="Mulher que trabalha no RH de uma empresa"
        className="w-full h-screen"
      />
      <div className="absolute w-full h-5/6 flex justify-around items-end flex-col pr-32 pt-32">
        <h1
          className="text-white text-5xl italic"
          style={{ textShadow: "2px 2px black" }}
        >
          Bem vindo(a) ao Jaé empresa.
        </h1>
        <div className="flex flex-col items-end">
          <p className="text-white">Primeira vez aqui ?</p>
          <Link
            to={"/cadastro-01"}
            className="text-white font-black text-3xl underline"
          >
            Abrir conta
          </Link>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-white">Já possui cadastro ?</p>
          <p
            onClick={autenticar}
            className="text-white font-black text-3xl underline cursor-pointer"
          >
            Entrar
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
