import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import MaskedInput from "react-input-mask";
import { onlyNumbers } from "../utils";
import axios from "axios";
import CadastroHeader from "../components/CadastroHeader";
import { inputStyle, labelStyle, sumbitButtonStyle } from "../styles";
import { api } from "../api";
import { RequestCadastroEmpresa } from "../types";
import { ToastContainer, toast } from "react-toastify";

type Inputs = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

function CadsatroPage_03() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>();

  const params = useLocation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    criarEmpresa(data);
  };

  const criarEmpresa = (inputData: Inputs) => {
    const { cep, logradouro, numero, complemento, bairro, cidade, estado } =
      inputData;

    const formData = {
      ...params.state,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    };

    console.log(formData);

    const requestBody: RequestCadastroEmpresa = {
      canalCadastro: "SITE_PJ",
      nome: formData.nome,
      email: formData.email,
      idCliente: null,
      codigo: null,
      numeroDocumento: onlyNumbers(formData.cnpj),
      telefone: onlyNumbers(formData.telefoneParaContato),
      tipoDocumento: "CNPJ",
      senha: formData.senha,
      confirmacaoSenha: formData.confirmaSenha,
      idTipoPerfilCliente: 1,
      nrSeqEndereco: null,
      cep: onlyNumbers(formData.cep),
      numero: formData.numero,
      complemento: formData.complemento,
      logradouro: formData.logradouro,
      bairro: formData.bairro,
      cidade: formData.cidade,
      uf: formData.estado,
      tipoEndereco: { codigo: 1, descricao: "" },
      tipoLogradouro: { id: 1, descricao: "" },
      loading: false,
      refeicao: false,
      alimentacao: false,
      combustivel: false,
    };

    api
      .post("/cliente/pessoa-juridica", requestBody)
      .then(() => {
        toast.success("Empresa criada com sucesso", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/");
        }, 5000);
      })
      .catch(() =>
        toast.error("Erro ao criar empresa", {
          position: toast.POSITION.TOP_RIGHT,
        })
      );
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
    <>
      <ToastContainer />
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
                <span className="text-red-500 font-medium">
                  E-mail inválido
                </span>
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
    </>
  );
}

export default CadsatroPage_03;
