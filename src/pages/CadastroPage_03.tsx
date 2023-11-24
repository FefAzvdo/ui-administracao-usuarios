import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation } from "react-router-dom";
import MaskedInput from "react-input-mask";
import { onlyNumbers } from "../utils";
import axios from "axios";
import CadastroHeader from "../components/CadastroHeader";

type Inputs = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

const inputStyle =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

const labelStyle =
  "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

const sumbitButtonStyle =
  "cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700";

function CadsatroPage_03() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>();

  const params = useLocation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    navigateToPage(data);
  };

  const navigateToPage = (inputData: Inputs) => {
    const { cep, logradouro, numero, complemento, bairro, cidade, estado } =
      inputData;

    const body = {
      ...params.state,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    };

    console.log(body);
  };

  const requestCep = () => {
    const cep = onlyNumbers(watch("cep", ""));
    const url = `https://api.postmon.com.br/v1/cep/${cep}`;

    axios
      .get(url)
      .then((data) => {
        const { logradouro, bairro, cidade, estado } = data.data;
        setValue("logradouro", logradouro);
        setValue("bairro", bairro);
        setValue("cidade", cidade);
        setValue("estado", estado);
      })
      .catch((error) => {
        // Manipula erros durante a requisição
        console.error("Erro na requisição:", error);
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <CadastroHeader
        title="E pra finalizar preciso do endereço empresarial"
        subtitle="Esse endereço será usado para a entrega dos cartões"
      />
      <div className="flex justify-center items-center h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-xl w-11/12"
        >
          <div className="my-4">
            <label htmlFor="cep" className={labelStyle}>
              Cep
            </label>
            <MaskedInput
              mask={"99999-999"}
              id="cep"
              {...register("cep", {
                required: { value: true, message: "Campo obrigatório" },
                // validate: (email) => isEmailValid(email),
              })}
              className={inputStyle}
              onBlur={requestCep}
            />
            {errors.cep && (
              <span className="text-red-500 font-medium">
                {errors.cep.message}
              </span>
            )}
            {errors.cep?.type === "validate" && (
              <span className="text-red-500 font-medium">E-mail inválido</span>
            )}
          </div>

          <div className="my-4">
            <label htmlFor="logradouro" className={labelStyle}>
              Logradouro
            </label>
            <input
              id="logradouro"
              {...register("logradouro", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              className={inputStyle}
            />
            {errors.logradouro && (
              <span className="text-red-500 font-medium">
                {errors.logradouro.message}
              </span>
            )}
          </div>

          <div className="my-4">
            <label htmlFor="numero" className={labelStyle}>
              Número
            </label>
            <input
              id="numero"
              {...register("numero", {
                required: false,
              })}
              className={inputStyle}
            />
          </div>

          <div className="my-4">
            <label htmlFor="complemento" className={labelStyle}>
              Complemento
            </label>
            <input
              id="complemento"
              {...register("complemento", {
                required: false,
              })}
              className={inputStyle}
            />
          </div>

          <div className="my-4">
            <label htmlFor="numero" className={labelStyle}>
              Bairro
            </label>
            <input
              id="bairro"
              {...register("bairro", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              className={inputStyle}
            />
            {errors.bairro && (
              <span className="text-red-500 font-medium">
                {errors.bairro.message}
              </span>
            )}
          </div>

          <div className="my-4">
            <label htmlFor="cidade" className={labelStyle}>
              Cidade
            </label>
            <input
              id="cidade"
              {...register("cidade", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              className={inputStyle}
            />
            {errors.cidade && (
              <span className="text-red-500 font-medium">
                {errors.cidade.message}
              </span>
            )}
          </div>

          <div className="my-4">
            <label htmlFor="estado" className={labelStyle}>
              UF
            </label>
            <input
              id="estado"
              {...register("estado", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              className={inputStyle}
            />
            {errors.estado && (
              <span className="text-red-500 font-medium">
                {errors.estado.message}
              </span>
            )}
          </div>

          <input
            type="submit"
            value={"Finalizar cadastro"}
            className={sumbitButtonStyle}
          />
        </form>
      </div>
    </div>
  );
}

export default CadsatroPage_03;
