import { Eye, House, Pencil, PlusCircle, User } from "@phosphor-icons/react";
import MainLayout from "../components/MainLayout";
import { Button, Modal, Tabs } from "flowbite-react";
import {
  convertPhosphorIcon,
  isCnpjValid,
  isEmailValid,
  onlyNumbers,
} from "../utils";
import { inputStyle, labelStyle, sumbitButtonStyle } from "../styles";
import { SubmitHandler, useForm } from "react-hook-form";
import MaskedInput from "react-input-mask";
import { mockUsuario } from "./mock";
import { useEffect, useState } from "react";
import { EnderecoType } from "../types";
import axios from "axios";

type InputsPerfil = {
  nome: string;
  cnpj: string;
  telefoneParaContato: string;
  email: string;
};

type InputsEndereco = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

const EnderecoContainerMeuPerfil = ({
  endereco,
  onClickEditar,
}: {
  endereco: EnderecoType;
  onClickEditar: () => void;
}) => {
  const { cep, logradouro, numero, complemento, bairro, cidade, uf } = endereco;

  const enderecoArr = [
    { label: "Logradouro", value: logradouro },
    { label: "Número", value: numero },
    { label: "Complemento", value: complemento },
    { label: "Bairro", value: bairro },
    { label: "Cidade", value: cidade },
    { label: "Uf", value: uf },
  ];

  return (
    <div className="border-2 p-4 text-lg" style={{ width: "33rem" }}>
      <div className="flex justify-between items-center">
        <div className="flex flex-row font-semibold">
          <div>
            <House size={25} className="mr-2" />
          </div>
          <div>CEP: {cep}</div>
        </div>
        <div>
          <Pencil
            size={25}
            className="cursor-pointer"
            onClick={() => onClickEditar()}
          />
        </div>
      </div>
      <hr className="my-2" />
      {enderecoArr.map((end) => {
        return (
          <div className="flex justify-between">
            {end.label}: <span className="font-semibold">{end.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function EditarPerfilPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InputsPerfil>();

  const {
    register: registerNovoEndereco,
    handleSubmit: handleSubmitNovoEndereco,
    formState: { errors: errorsNovoEndereco },
    watch: watchNovoEndereco,
    setValue: setValueNovoEndereco,
  } = useForm<InputsEndereco>();

  const {
    register: registerEditarEndereco,
    handleSubmit: handleSubmitEditarEndereco,
    formState: { errors: errorsEditarEndereco },
    watch: watchEditarEndereco,
    setValue: setValueEditarEndereco,
  } = useForm<InputsEndereco>();

  const onSubmitAlterarPerfil: SubmitHandler<InputsPerfil> = (data) => {
    console.log("🚀 ~ data:", data);
    alert("CHAMAR API ALTERAR DADOS EMPRESA");
  };

  const onSubmitEndereco: SubmitHandler<InputsEndereco> = (data) => {
    console.log("🚀 ~ data:", data);
    alert("CHAMAR API CADASTRAR ENDERECO");
  };

  const onSubmitEditarEndereco: SubmitHandler<InputsEndereco> = (data) => {
    console.log("🚀 ~ data:", data);
    alert("CHAMAR API ALTERAR DADOS ENDEREÇO");
  };

  const { nome, numeroDocumento, telefone, email, enderecos } = mockUsuario;

  const [showEditAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    setValue("nome", nome);
    setValue("cnpj", numeroDocumento);
    setValue("telefoneParaContato", telefone);
    setValue("email", email);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestCep = (isNewAddress: boolean) => {
    const cep = isNewAddress
      ? onlyNumbers(watchNovoEndereco("cep", ""))
      : onlyNumbers(watchEditarEndereco("cep", ""));

    const url = `https://api.postmon.com.br/v1/cep/${cep}`;

    axios
      .get(url)
      .then((data) => {
        const { logradouro, bairro, cidade, estado } = data.data;
        setValueNovoEndereco("logradouro", logradouro);
        setValueNovoEndereco("bairro", bairro);
        setValueNovoEndereco("cidade", cidade);
        setValueNovoEndereco("estado", estado);
      })
      .catch((error) => {
        // Manipula erros durante a requisição
        console.error("Erro na requisição:", error);
      });
  };

  const handleClickEditarEndereco = (endereco: EnderecoType) => {
    setShowAddressModal(true);
    setValueEditarEndereco("cep", endereco.cep);
    setValueEditarEndereco("logradouro", endereco.logradouro);
    setValueEditarEndereco("numero", endereco.numero);
    setValueEditarEndereco("complemento", endereco.complemento);
    setValueEditarEndereco("bairro", endereco.bairro);
    setValueEditarEndereco("cidade", endereco.cidade);
    setValueEditarEndereco("estado", endereco.uf);
  };

  return (
    <MainLayout pageTitle="Editar perfil">
      <Modal
        dismissible
        show={showEditAddressModal}
        onClose={() => setShowAddressModal(false)}
      >
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="flex justify-center items-center h-full">
            <form
              onSubmit={handleSubmitEditarEndereco(onSubmitEditarEndereco)}
              className="flex flex-col max-w-xl w-11/12"
            >
              <div className="my-4">
                <label htmlFor="cep" className={labelStyle}>
                  Cep
                </label>
                <MaskedInput
                  mask={"99999-999"}
                  id="cep"
                  {...registerEditarEndereco("cep", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                  onBlur={() => requestCep(false)}
                />
                {errorsEditarEndereco.cep && (
                  <span className="text-red-500 font-medium">
                    {errorsEditarEndereco.cep.message}
                  </span>
                )}
                {errorsEditarEndereco.cep?.type === "validate" && (
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
                  {...registerEditarEndereco("logradouro", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsEditarEndereco.logradouro && (
                  <span className="text-red-500 font-medium">
                    {errorsEditarEndereco.logradouro.message}
                  </span>
                )}
              </div>

              <div className="my-4">
                <label htmlFor="numero" className={labelStyle}>
                  Número
                </label>
                <input
                  id="numero"
                  {...registerEditarEndereco("numero", {
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
                  {...registerEditarEndereco("complemento", {
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
                  {...registerEditarEndereco("bairro", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsEditarEndereco.bairro && (
                  <span className="text-red-500 font-medium">
                    {errorsEditarEndereco.bairro.message}
                  </span>
                )}
              </div>

              <div className="my-4">
                <label htmlFor="cidade" className={labelStyle}>
                  Cidade
                </label>
                <input
                  id="cidade"
                  {...registerEditarEndereco("cidade", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsEditarEndereco.cidade && (
                  <span className="text-red-500 font-medium">
                    {errorsEditarEndereco.cidade.message}
                  </span>
                )}
              </div>

              <div className="my-4">
                <label htmlFor="estado" className={labelStyle}>
                  UF
                </label>
                <input
                  id="estado"
                  {...registerEditarEndereco("estado", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsEditarEndereco.estado && (
                  <span className="text-red-500 font-medium">
                    {errorsEditarEndereco.estado.message}
                  </span>
                )}
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowAddressModal(false)}>
            Alterar endereço
          </Button>
          <Button color="gray" onClick={() => setShowAddressModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Tabs>
        <Tabs.Item
          title="Editar perfil"
          icon={convertPhosphorIcon(<User size={25} />)}
        >
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit(onSubmitAlterarPerfil)}
              className="flex flex-col max-w-xl w-11/12"
            >
              <div className="my-4">
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
              <div className="my-4">
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
                  <span className="text-red-500 font-medium">
                    Cnpj inválido
                  </span>
                )}
              </div>
              <div className="my-4">
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
                  <span className="text-red-500 font-medium">
                    E-mail inválido
                  </span>
                )}
              </div>
              <input
                type="submit"
                value={"Alterar"}
                className={sumbitButtonStyle}
              />
            </form>
          </div>
        </Tabs.Item>
        <Tabs.Item
          title="Alterar senha"
          icon={convertPhosphorIcon(<Eye size={25} />)}
        >
          <div className="flex justify-center">
            <p className="font-semibold text-gray-500">
              Caso não tenha aberto uma aba,{" "}
              <span
                className="cursor-pointer font-bold text-blue-500 underline"
                onClick={() => alert("NAVEGAR PARA PÁGINA DE MUDAR SENHA")}
              >
                clique aqui para alterar sua senha.
              </span>
            </p>
          </div>
        </Tabs.Item>
        <Tabs.Item
          title="Meus endereços"
          icon={convertPhosphorIcon(<House size={25} />)}
        >
          <div className="flex justify-center">
            {enderecos.map((endereco) => {
              return (
                <EnderecoContainerMeuPerfil
                  //@ts-expect-error mock
                  endereco={endereco}
                  //@ts-expect-error mock
                  onClickEditar={() => handleClickEditarEndereco(endereco)}
                />
              );
            })}
          </div>
        </Tabs.Item>
        <Tabs.Item
          title="Novo endereço"
          icon={convertPhosphorIcon(<PlusCircle size={25} />)}
        >
          <div className="flex justify-center items-center h-full">
            <form
              onSubmit={handleSubmitNovoEndereco(onSubmitEndereco)}
              className="flex flex-col max-w-xl w-11/12"
            >
              <div className="my-4">
                <label htmlFor="cep" className={labelStyle}>
                  Cep
                </label>
                <MaskedInput
                  mask={"99999-999"}
                  id="cep"
                  {...registerNovoEndereco("cep", {
                    required: { value: true, message: "Campo obrigatório" },
                    // validate: (email) => isEmailValid(email),
                  })}
                  className={inputStyle}
                  onBlur={() => requestCep(true)}
                />
                {errorsNovoEndereco.cep && (
                  <span className="text-red-500 font-medium">
                    {errorsNovoEndereco.cep.message}
                  </span>
                )}
                {errorsNovoEndereco.cep?.type === "validate" && (
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
                  {...registerNovoEndereco("logradouro", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsNovoEndereco.logradouro && (
                  <span className="text-red-500 font-medium">
                    {errorsNovoEndereco.logradouro.message}
                  </span>
                )}
              </div>

              <div className="my-4">
                <label htmlFor="numero" className={labelStyle}>
                  Número
                </label>
                <input
                  id="numero"
                  {...registerNovoEndereco("numero", {
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
                  {...registerNovoEndereco("complemento", {
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
                  {...registerNovoEndereco("bairro", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsNovoEndereco.bairro && (
                  <span className="text-red-500 font-medium">
                    {errorsNovoEndereco.bairro.message}
                  </span>
                )}
              </div>

              <div className="my-4">
                <label htmlFor="cidade" className={labelStyle}>
                  Cidade
                </label>
                <input
                  id="cidade"
                  {...registerNovoEndereco("cidade", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsNovoEndereco.cidade && (
                  <span className="text-red-500 font-medium">
                    {errorsNovoEndereco.cidade.message}
                  </span>
                )}
              </div>

              <div className="my-4">
                <label htmlFor="estado" className={labelStyle}>
                  UF
                </label>
                <input
                  id="estado"
                  {...registerNovoEndereco("estado", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                  className={inputStyle}
                />
                {errorsNovoEndereco.estado && (
                  <span className="text-red-500 font-medium">
                    {errorsNovoEndereco.estado.message}
                  </span>
                )}
              </div>

              <input
                type="submit"
                value={"Cadstrar endereço"}
                className={sumbitButtonStyle}
              />
            </form>
          </div>
        </Tabs.Item>
      </Tabs>
    </MainLayout>
  );
}