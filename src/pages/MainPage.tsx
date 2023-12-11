import axios from "axios";
import banner from "../assets/mulher-rh.jpg";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MainPage() {
  function autenticar() {
    axios
      .post(
        `https://api.dev.billingpay.com.br/autenticacao`,
        {
          senha: "#Trocar123",
          usuario: "15355251773",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const token = res.data.token;
        window.sessionStorage.setItem("TOKEN", token);

        const decodedToken = jwtDecode(token);
        window.sessionStorage.setItem(
          "DECODED_TOKEN",
          JSON.stringify(decodedToken)
        );
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
          <Link
            to={"/colaboradores"}
            className="text-white font-black text-3xl underline"
          >
            Entrar
          </Link>
          <button className="text-white" onClick={autenticar}>
            Autenticar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
