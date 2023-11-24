import { useForm, SubmitHandler } from "react-hook-form";
import MaskedInput from "react-input-mask";
import { isCnpjValid } from "../utils";
import { useNavigate } from "react-router-dom";
import CadastroHeader from "../components/CadastroHeader";

type Inputs = {
  nome: string;
  cnpj: string;
  telefoneParaContato: string;
};

const inputStyle =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

const labelStyle =
  "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

const sumbitButtonStyle =
  "cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700";

function CadsatroPage_01() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    navigateToPage(data);
  };

  const navigateToPage = (inputData: Inputs) => {
    const { cnpj, nome, telefoneParaContato } = inputData;

    navigate("/cadastro-02", {
      state: {
        cnpj,
        nome,
        telefoneParaContato,
      },
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <CadastroHeader
        title="Abrir a conta empresa é muito simples"
        subtitle="Comece preenchendo os dados da sua empresa"
      />
      <div className="flex justify-center items-center h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-xl"
          style={{ minWidth: "50%" }}
        >
          <div className="my-16">
            <label htmlFor="nome" className={labelStyle}>
              Nome da empresa
            </label>
            <input
              id="nome"
              {...register("nome", {
                required: { value: true, message: "Campo requerido" },
              })}
              className={inputStyle}
            />
            {errors.nome && (
              <span className="text-red-500 font-medium">
                {errors.nome.message}
              </span>
            )}
          </div>
          <div className="my-16">
            <label htmlFor="cnpj" className={labelStyle}>
              CNPJ
            </label>
            <MaskedInput
              id="cnpj"
              mask={"99.999.999/9999-99"}
              alwaysShowMask={false}
              type={"text"}
              {...register("cnpj", {
                required: { value: true, message: "Campo obrigatório" },
                validate: (cnpj) => isCnpjValid(cnpj),
              })}
              className={inputStyle}
            />
            {errors.cnpj && (
              <span className="text-red-500 font-medium">
                {errors.cnpj.message}
              </span>
            )}
            {errors.cnpj?.type === "validate" && (
              <span className="text-red-500 font-medium">Cnpj inválido</span>
            )}
          </div>
          <div className="my-16">
            <label htmlFor="telefone" className={labelStyle}>
              Telefone para contato
            </label>
            <MaskedInput
              id="telefone"
              mask={
                watch("telefoneParaContato", "")[5] === "9"
                  ? "(99) 99999-9999"
                  : "(99) 9999-9999"
              }
              alwaysShowMask={false}
              type={"text"}
              {...register("telefoneParaContato", {
                required: { value: true, message: "Campo requerido" },
              })}
              className={inputStyle}
            />
            {errors.telefoneParaContato && (
              <span className="text-red-500 font-medium">
                {errors.telefoneParaContato.message}
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

export default CadsatroPage_01;
