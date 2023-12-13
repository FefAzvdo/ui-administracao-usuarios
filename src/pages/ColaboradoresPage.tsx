import { Button, Modal, Tabs } from "flowbite-react";
import MainLayout from "../components/MainLayout";
import {
  formatarValorInputParaMoedaBRL,
  formatCurrencyToBRL,
  isCpfValid,
  isDateDD_MM_YYYY_Valid,
  isEmailValid,
  onlyNumbers,
  formatDateFromYYYY_MM_DD_To_DD_MM_YYYY,
  setMaskNumeroCelular,
  formatCurrencyBrlToFloat,
  formatDateFromDD_MM_YYYY_To_YYYY_MM_DD,
} from "../utils";
import {
  PlusCircle,
  Warning,
  MagnifyingGlass,
  Broom,
} from "@phosphor-icons/react";
import { ChangeEvent, useEffect, useState } from "react";
import MaskedInput from "react-input-mask";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ColaboratorType,
  RequestEditarColaborador,
  RequestNovoColaborador,
} from "../types";
import { inputStyle, labelStyle } from "../styles";
import { api } from "../api";
import { ColaboratorTable } from "../components/ColaboratorTable";
import { dadosEmpresa } from "../storage";
import { ToastContainer, toast } from "react-toastify";
type Inputs = {
  cpf: string;
  nome: string;
  numeroMatricula: string;
  dataNascimento: string;
  sexo: string;
  celular: string;
  email: string;
  valorDeUsoDiario: string;
  idClienteFavorecido: number;
};

export default function ColaboradoresPage() {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isAssocOrDesassocModalOpened, setIsAssocOrDesassocModalOpened] =
    useState({ isOpened: false, type: "" });
  const [date, setDate] = useState("");
  const [valorDeUsoDiario, setValorDeUsoDiario] = useState("");
  const [modalType, setModalType] = useState("NOVO_COLABORADOR");
  const [inputSearch, setInputSearch] = useState({
    cpf: "",
    nome: "",
  });
  const [activeColaborators, setActiveColaborators] = useState<
    ColaboratorType[]
  >([]);

  const [inactiveColaborators, setInactiveColaborators] = useState<
    ColaboratorType[]
  >([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const codigoEmpresa = dadosEmpresa.codigo;

  const fetchDataColaboradores = () => {
    setIsSearchLoading(true);

    api
      .get(`/cliente/${codigoEmpresa}/favorecidos?page=1&size=500&idProduto=2`)
      .then((res) => setActiveColaborators(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsSearchLoading(false));

    api
      .get(`/cliente/favorecido/inativos/${codigoEmpresa}`)
      .then((res) => setInactiveColaborators(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsSearchLoading(false));
  };

  useEffect(() => {
    fetchDataColaboradores();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (modalType === "NOVO_COLABORADOR") {
      handleClickCriarColaborador(data);
    } else {
      handleClickEditarColaborador(data);
    }
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.replace(/\D/g, "");

    const day = input.slice(0, 2);
    const month = input.slice(2, 4);
    const year = input.slice(4, 8);

    const firstBar = day.length === 2 && month.length !== 0 ? "/" : "";
    const secondBar = month.length === 2 && year.length !== 0 ? "/" : "";

    const formattedValue = `${day}${firstBar}${month}${secondBar}${year}`;

    if (Number.parseInt(day[0]) > 3) {
      return;
    }

    if (Number.parseInt(day[0]) === 3 && Number.parseInt(day[1]) > 1) {
      return;
    }

    if (Number.parseInt(month[0]) > 1) {
      return;
    }

    if (Number.parseInt(month[0]) > 1 && Number.parseInt(month[1]) > 2) {
      return;
    }

    if (Number.parseInt(month[0]) === 0 && Number.parseInt(month[1]) === 0) {
      return;
    }

    if (Number.parseInt(day[0]) === 0 && Number.parseInt(day[1]) === 0) {
      return;
    }

    setDate(formattedValue);
  };

  const handleChangeValorUsoDiario = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const valorFormatado = formatarValorInputParaMoedaBRL(inputValue);

    if (valorFormatado === "R$ NaN") {
      setValorDeUsoDiario("R$ 0,00");
    } else {
      setValorDeUsoDiario(valorFormatado);
    }
  };

  const setColaboratorValues = (colaborador: ColaboratorType) => {
    setValue("cpf", colaborador.numeroDocumento);
    setValue("nome", colaborador.nome);
    setValue("numeroMatricula", colaborador.matricula);
    setValue(
      "dataNascimento",
      formatDateFromYYYY_MM_DD_To_DD_MM_YYYY(colaborador.dataNascimento)
    );
    setValue("sexo", colaborador.sexo);
    setValue("celular", setMaskNumeroCelular(colaborador.telefone));
    setValue("email", colaborador.email);
    setValue(
      "valorDeUsoDiario",
      formatCurrencyToBRL(colaborador.valorUsoDiario)
    );
    setValue("idClienteFavorecido", colaborador.idClienteFavorecido);
  };

  const closeAndCleanModal = () => {
    setIsModalOpened(false);
    setIsAssocOrDesassocModalOpened({ isOpened: false, type: "" });
    clearErrors();
    setValue("cpf", "");
    setValue("nome", "");
    setValue("numeroMatricula", "");
    setValue("dataNascimento", "");
    setValue("sexo", "M");
    setValue("celular", "");
    setValue("email", "");
    setValue("valorDeUsoDiario", "");
    setValue("idClienteFavorecido", 0);
  };

  const buscarColaborador = () => {
    setIsSearchLoading(true);

    let url = "";
    const cpf = onlyNumbers(inputSearch.cpf);

    if (inputSearch.nome !== "" && inputSearch.cpf === "") {
      url = `/cliente/${codigoEmpresa}/favorecidos?nome=${inputSearch.nome}&idProduto=2`;
    } else if (inputSearch.cpf !== "" && inputSearch.nome === "") {
      url = `/cliente/${codigoEmpresa}/favorecidos?cpf=${cpf}&idProduto=2`;
    } else {
      url = `/cliente/${codigoEmpresa}/favorecidos?cpf=${cpf}&nome=${inputSearch.nome}&idProduto=2`;
    }

    api
      .get(url)
      .then((res) => setActiveColaborators(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsSearchLoading(false));
  };

  const limparColaboradores = () => {
    setInputSearch({
      cpf: "",
      nome: "",
    });

    setIsSearchLoading(true);

    api
      .get(`/cliente/${codigoEmpresa}/favorecidos?page=1&size=500&idProduto=2`)
      .then((res) => setActiveColaborators(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsSearchLoading(false));
  };

  const handleClickCriarColaborador = (inputs: Inputs) => {
    const bodyNovoColab: RequestNovoColaborador = {
      matricula: inputs.numeroMatricula,
      idClientePrincipal: codigoEmpresa,
      colaborador: {
        email: inputs.email,
        sexo: inputs.sexo,
        numeroDocumento: onlyNumbers(inputs.cpf),
        nome: inputs.nome,
        tipoDocumento: "CPF",
        canalCadastro: "SITE_PJ",
        idTiposPerfisCliente: [2],
        idClienteFavorecido: 0,
        telefone: onlyNumbers(inputs.celular),
        dataNascimento: formatDateFromDD_MM_YYYY_To_YYYY_MM_DD(
          inputs.dataNascimento
        ),
      },
      valorUsoDiario: formatCurrencyBrlToFloat(inputs.valorDeUsoDiario),
    };

    api
      .post(`/cliente/pessoa-juridica/colaborador`, bodyNovoColab)
      .then(() => {
        toast.success("Colaborador criado com sucesso", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch(() => {
        toast.error("Erro ao criar colaborador", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        closeAndCleanModal();
        fetchDataColaboradores();
      });
  };

  const handleClickEditarColaborador = (inputs: Inputs) => {
    const bodyEditarColab: RequestEditarColaborador = {
      nome: inputs.nome,
      matricula: inputs.numeroMatricula,
      email: inputs.email,
      sexo: inputs.sexo,
      dataNascimento: formatDateFromDD_MM_YYYY_To_YYYY_MM_DD(
        inputs.dataNascimento
      ),
      telefone: onlyNumbers(inputs.celular),
      valorUsoDiario: formatCurrencyBrlToFloat(inputs.valorDeUsoDiario),
      numeroDocumento: onlyNumbers(inputs.cpf),
      idClientePrincipal: codigoEmpresa,
      idClienteFavorecido: getValues("idClienteFavorecido"),
    };

    api
      .put(`/cliente/pessoa-juridica/colaborador`, bodyEditarColab)
      .then(() => {
        toast.success("Colaborador editado com sucesso", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch(() => {
        toast.error("Erro ao editar colaborador", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        closeAndCleanModal();
        fetchDataColaboradores();
      });
  };

  const handleClickDesassociarOuAssociarColaborador = (
    isDesativando: boolean
  ) => {
    const body = {
      idClienteFavorecido: getValues("idClienteFavorecido"),
      idClientePrincipal: codigoEmpresa,
    };

    const type = isDesativando ? "inativar" : "reativar";
    const word = isDesativando ? "desassociado" : "ativado";

    api
      .put(`/cliente/favorecido/${type}`, body)
      .then(() => {
        toast.success(`Colaborador ${word} com sucesso`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch(() => {
        toast.error("Erro ao desassociar colaborador", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        closeAndCleanModal();
        fetchDataColaboradores();
      });
  };

  return (
    <>
      <ToastContainer />
      <MainLayout pageTitle="Colaboradores">
        <div className="flex justify-between md:items-end py-4 flex-col md:flex-row">
          <div className="flex gap-4 w-full md:max-w-3xl flex-col md:flex-row md:items-end">
            <div className="flex flex-col md:w-1/2">
              <label htmlFor="cpfBusca" className={labelStyle}>
                CPF
              </label>
              <MaskedInput
                id="cpfBusca"
                mask={"999.999.999-99"}
                placeholder="000.000.000-00"
                alwaysShowMask={false}
                type={"text"}
                className={inputStyle}
                value={inputSearch.cpf}
                onChange={(e) =>
                  setInputSearch({ ...inputSearch, cpf: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col md:w-1/2">
              <label htmlFor="nomeBusca" className={labelStyle}>
                Nome
              </label>
              <input
                id="nomeBusca"
                placeholder="Nome do colaborador"
                type={"text"}
                className={inputStyle}
                value={inputSearch.nome}
                onChange={(e) =>
                  setInputSearch({ ...inputSearch, nome: e.target.value })
                }
              />
            </div>
            <div className="flex ">
              <Button className="mt-2 mr-2" onClick={buscarColaborador}>
                <MagnifyingGlass size={20} className="mx-2" /> Buscar
              </Button>
              <Button className="mt-2" onClick={limparColaboradores}>
                <Broom size={20} className="mx-2" /> Limpar
              </Button>
            </div>
          </div>
          <div className="flex justify-end w-full md:max-w-xs">
            <Button
              className="mt-2"
              onClick={() => {
                setIsModalOpened(true);
                setModalType("NOVO_COLABORADOR");
              }}
            >
              <PlusCircle size={20} className="mx-2" /> Novo colaborador
            </Button>
          </div>
        </div>
        <Modal
          show={isAssocOrDesassocModalOpened.isOpened}
          size="sm"
          onClose={closeAndCleanModal}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <Warning
                size={32}
                className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
              />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Tem certeza que deseja{" "}
                {isAssocOrDesassocModalOpened.type === "ATIVOS"
                  ? "desassociar"
                  : "associar"}{" "}
                o(a) colaborador(a) {getValues("nome")} ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color={
                    isAssocOrDesassocModalOpened.type === "ATIVOS"
                      ? "failure"
                      : "success"
                  }
                  onClick={() => {
                    isAssocOrDesassocModalOpened.type === "ATIVOS"
                      ? handleClickDesassociarOuAssociarColaborador(true)
                      : handleClickDesassociarOuAssociarColaborador(false);
                  }}
                >
                  Sim, eu tenho
                </Button>
                <Button color="gray" onClick={closeAndCleanModal}>
                  Não, cancelar
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={isModalOpened} onClose={closeAndCleanModal} size="5xl">
          <Modal.Header>
            {modalType === "NOVO_COLABORADOR"
              ? "Novo colaborador"
              : "Editar colaborador"}
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              {modalType === "NOVO_COLABORADOR" && (
                <>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Caso seu colaborador não possua nenhum registro na
                    plataforma, basta inserir os dados abaixo para criar uma
                    conta e associá-lo a sua empresa.
                  </p>

                  <hr />
                </>
              )}
              <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                {modalType === "NOVO_COLABORADOR" && (
                  <>
                    <div className="my-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col w-1/2">
                          <label htmlFor="cpf" className={labelStyle}>
                            CPF
                          </label>
                          <MaskedInput
                            id="cpf"
                            mask={"999.999.999-99"}
                            placeholder="000.000.000-00"
                            alwaysShowMask={false}
                            type={"text"}
                            {...register("cpf", {
                              required: {
                                value: true,
                                message: "Campo obrigatório",
                              },
                              validate: (cpf) => isCpfValid(cpf),
                            })}
                            className={inputStyle}
                          />
                          {errors.cpf && (
                            <span className="text-red-500 font-medium">
                              {errors.cpf.message}
                            </span>
                          )}
                          {errors.cpf?.type === "validate" && (
                            <span className="text-red-500 font-medium">
                              CPF inválido
                            </span>
                          )}
                        </div>
                        <Button>Consultar</Button>
                      </div>
                    </div>

                    <hr />
                  </>
                )}

                <div className="flex justify-between gap-8 my-4">
                  <div className="w-full">
                    <label htmlFor="nome" className={labelStyle}>
                      Nome
                    </label>
                    <input
                      id="nome"
                      placeholder="Seu nome"
                      {...register("nome", {
                        required: { value: true, message: "Campo obrigatório" },
                      })}
                      className={inputStyle}
                    />
                    {errors.nome && (
                      <span className="text-red-500 font-medium">
                        {errors.nome.message}
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="numeroMatricula" className={labelStyle}>
                      Matrícula
                    </label>
                    <input
                      placeholder="Matrícula colaborador"
                      id="numeroMatricula"
                      {...register("numeroMatricula", {
                        required: { value: true, message: "Campo obrigatório" },
                      })}
                      className={inputStyle}
                    />
                    {errors.numeroMatricula && (
                      <span className="text-red-500 font-medium">
                        {errors.numeroMatricula.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-8 mb-4">
                  <div className="w-full">
                    <label htmlFor="dataNascimento" className={labelStyle}>
                      Data de Nascimento
                    </label>
                    <input
                      placeholder="DD/MM/YYYY"
                      id="dataNascimento"
                      {...register("dataNascimento", {
                        required: { value: true, message: "Campo obrigatório" },
                        validate: (data) => isDateDD_MM_YYYY_Valid(data),
                      })}
                      value={date}
                      onChange={(e) => handleDateChange(e)}
                      className={inputStyle}
                    />
                    {errors.dataNascimento && (
                      <span className="text-red-500 font-medium">
                        {errors.dataNascimento.message}
                      </span>
                    )}
                    {errors.dataNascimento?.type === "validate" && (
                      <span className="text-red-500 font-medium">
                        Data de nascimento inválida
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="sexo" className={labelStyle}>
                      Sexo
                    </label>
                    <select
                      id="sexo"
                      {...register("sexo", {
                        required: { value: true, message: "Campo obrigatório" },
                      })}
                      className={inputStyle}
                    >
                      <option value={"M"}>Masculino</option>
                      <option value={"F"}>Feminino</option>
                      <option value={""}>Outro</option>
                    </select>
                    {errors.sexo && (
                      <span className="text-red-500 font-medium">
                        {errors.sexo.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-8 mb-4">
                  <div className="w-full">
                    <label htmlFor="celular" className={labelStyle}>
                      Celular
                    </label>
                    <MaskedInput
                      placeholder="(00) 00000-0000"
                      mask="(99) 99999-9999"
                      id="celular"
                      {...register("celular", {
                        required: { value: true, message: "Campo obrigatório" },
                        validate: (celular) =>
                          onlyNumbers(celular).length === 11 &&
                          onlyNumbers(celular)[2] === "9",
                      })}
                      className={inputStyle}
                    />
                    {errors.celular && (
                      <span className="text-red-500 font-medium">
                        {errors.celular.message}
                      </span>
                    )}
                    {errors.celular?.type === "validate" && (
                      <span className="text-red-500 font-medium">
                        Celular inválido
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="email" className={labelStyle}>
                      E-mail
                    </label>
                    <input
                      placeholder="Seu e-mail"
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
                </div>

                <div className="flex justify-between gap-8 mb-4">
                  <div className="w-full">
                    <label htmlFor="valorDeUsoDiario" className={labelStyle}>
                      Valor de uso diário
                    </label>
                    <input
                      placeholder="R$ 0,00"
                      id="valorDeUsoDiario"
                      {...register("valorDeUsoDiario", {
                        required: { value: true, message: "Campo obrigatório" },
                      })}
                      onChange={handleChangeValorUsoDiario}
                      value={valorDeUsoDiario}
                      className={inputStyle}
                    />
                    {errors.valorDeUsoDiario && (
                      <span className="text-red-500 font-medium">
                        {errors.valorDeUsoDiario.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full"></div>
                </div>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button type="submit" form="hook-form">
              {modalType === "NOVO_COLABORADOR" ? "Criar" : "Editar"}
            </Button>
          </Modal.Footer>
        </Modal>
        <Tabs>
          <Tabs.Item title="Ativos">
            <ColaboratorTable
              isLoading={isSearchLoading}
              type="ATIVOS"
              activeColaborators={activeColaborators}
              inactiveColaborators={inactiveColaborators}
              onClickEditar={(colaborador: ColaboratorType) => {
                setModalType("EDITAR");
                setIsModalOpened(true);
                setColaboratorValues(colaborador);
              }}
              onClickActionButton={(colaborador) => {
                setIsAssocOrDesassocModalOpened({
                  isOpened: true,
                  type: "ATIVOS",
                });
                setColaboratorValues(colaborador);
              }}
            />
          </Tabs.Item>
          <Tabs.Item title="Inativos">
            <ColaboratorTable
              isLoading={isSearchLoading}
              type="INATIVOS"
              activeColaborators={activeColaborators}
              inactiveColaborators={inactiveColaborators}
              onClickEditar={(colaborador: ColaboratorType) => {
                setModalType("EDITAR");
                setIsModalOpened(true);
                setColaboratorValues(colaborador);
              }}
              onClickActionButton={(colaborador) => {
                setIsAssocOrDesassocModalOpened({
                  isOpened: true,
                  type: "INATIVOS",
                });
                setColaboratorValues(colaborador);
              }}
            />
          </Tabs.Item>
        </Tabs>
      </MainLayout>
    </>
  );
}
