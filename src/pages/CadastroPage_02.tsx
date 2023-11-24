import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  hasLowerCase,
  hasNumber,
  hasSpecialChar,
  hasUpperCase,
  isEmailValid,
} from "../utils";
import { Eye, EyeSlash, Pen } from "@phosphor-icons/react";
import CadastroHeader from "../components/CadastroHeader";

type Inputs = {
  email: string;
  senha: string;
  confirmaSenha: string;
};

const inputStyle =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

const labelStyle =
  "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

const sumbitButtonStyle =
  "cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700";

function CadsatroPage_02() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const params = useLocation();

  const [showPass, setShowPass] = useState({
    senha: false,
    confirmaSenha: false,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    navigateToPage(data);
  };

  const navigateToPage = (inputData: Inputs) => {
    const { email, senha, confirmaSenha } = inputData;

    navigate("/cadastro-03", {
      state: {
        ...params.state,
        email,
        senha,
        confirmaSenha,
      },
    });
  };

  const isPasswordValid = (senha: string) => {
    return (
      senha.length > 8 &&
      hasLowerCase(senha) &&
      hasUpperCase(senha) &&
      hasNumber(senha) &&
      hasSpecialChar(senha)
    );
  };

  console.log("errors: ", errors);

  const getEyeIcon = (show: boolean, field: string) => {
    const onClickFunc =
      field === "SENHA"
        ? () => setShowPass({ ...showPass, senha: !showPass.senha })
        : () =>
            setShowPass({
              ...showPass,
              confirmaSenha: !showPass.confirmaSenha,
            });

    if (show) {
      return (
        <EyeSlash size={32} onClick={onClickFunc} className="cursor-pointer" />
      );
    } else {
      return <Eye size={32} onClick={onClickFunc} className="cursor-pointer" />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <CadastroHeader
        title="Agora preciso de um e-mail e senha de acesso"
        subtitle="Por favor, não compartilhe essa senha com ninguém, é pro bem da empresa :)"
      />
      <div className="flex justify-center items-center h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-xl"
          style={{ minWidth: "50%" }}
        >
          <div className="my-8">
            <label htmlFor="email" className={labelStyle}>
              E-mail
            </label>
            <input
              id="email"
              type={"email"}
              {...register("email", {
                required: { value: true, message: "Campo obrigatório" },
                validate: (email) => isEmailValid(email),
              })}
              className={inputStyle}
            />
            {errors.email && (
              <span className="text-red-500 font-medium">
                {errors.email.message}
              </span>
            )}
            {errors.email?.type === "validate" && (
              <span className="text-red-500 font-medium">E-mail inválido</span>
            )}
          </div>

          <div className="my-8">
            <ul className="mb-6">
              <li
                className={
                  watch("senha", "").length > 8
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                <span className="flex justify-start items-center">
                  {<Pen className="mr-3" />} Sua senha deve conter mais de 8
                  caracteres
                </span>
              </li>
              <li
                className={
                  hasLowerCase(watch("senha", ""))
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                <span className="flex justify-start items-center">
                  {<Pen className="mr-3" />} Deve possuir pelo menos um
                  caractere minúsculo
                </span>
              </li>
              <li
                className={
                  hasNumber(watch("senha", ""))
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                <span className="flex justify-start items-center">
                  {<Pen className="mr-3" />} Deve possuir pelo menos um número
                </span>
              </li>
              <li
                className={
                  hasUpperCase(watch("senha", ""))
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                <span className="flex justify-start items-center">
                  {<Pen className="mr-3" />} Deve possuir pelo menos um
                  caractere maiúsculo
                </span>
              </li>
              <li
                className={
                  hasSpecialChar(watch("senha", ""))
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                <span className="flex justify-start items-center">
                  {<Pen className="mr-3" />} Deve possuir pelo menos um
                  caractere especial. Exemplo: #, $, @,
                </span>
              </li>
            </ul>
            <label
              htmlFor="senha"
              className={labelStyle}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Senha
              {getEyeIcon(showPass.senha, "SENHA")}
            </label>

            <input
              id="senha"
              type={showPass.senha ? "text" : "password"}
              {...register("senha", {
                required: { value: true, message: "Campo obrigatório" },
                validate: (senha) => isPasswordValid(senha),
              })}
              className={inputStyle}
            />
            {errors.senha && (
              <span className="text-red-500 font-medium">
                {errors.senha.message}
              </span>
            )}
            {errors.senha?.type === "validate" && (
              <span className="text-red-500 font-medium">Senha inválida</span>
            )}
          </div>

          <div className="my-8">
            <label
              htmlFor="confirmaSenha"
              className={labelStyle}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Confirmar senha
              {getEyeIcon(showPass.confirmaSenha, "CONFIRMA_SENHA")}
            </label>
            <input
              id="confirmaSenha"
              type={showPass.confirmaSenha ? "text" : "password"}
              {...register("confirmaSenha", {
                required: { value: true, message: "Campo obrigatório" },
                validate: () =>
                  watch("senha", "") === watch("confirmaSenha", ""),
              })}
              className={inputStyle}
            />
            {errors.confirmaSenha && (
              <span className="text-red-500 font-medium">
                {errors.confirmaSenha.message}
              </span>
            )}
            {errors.confirmaSenha?.type === "validate" && (
              <span className="text-red-500 font-medium">
                As senhas não são iguais
              </span>
            )}
          </div>

          <input
            type="submit"
            value={"Continuar"}
            className={sumbitButtonStyle}
          />
        </form>
      </div>
    </div>
  );
}

export default CadsatroPage_02;
