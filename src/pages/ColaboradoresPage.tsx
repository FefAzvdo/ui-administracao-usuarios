import { Button, Modal, Table } from "flowbite-react";
import MainLayout from "../components/MainLayout";
import {
  formatarCPF,
  formatarParaBRL,
  formatarTelefone,
  isCpfValid,
  isDateDD_MM_YYYY_Valid,
} from "../utils";
import { PlusCircle } from "@phosphor-icons/react";
import { ChangeEvent, useState } from "react";
import MaskedInput from "react-input-mask";
import { SubmitHandler, useForm } from "react-hook-form";

const mock = [
  {
    idClientePrincipal: 636,
    idPerfilClientePrincipal: 1,
    idClienteFavorecido: 558,
    idPerfilClienteFavorecido: 2,
    dataInclusao: "2023-09-26T14:42:57",
    dataCancelamento: "2023-11-08T14:00:59",
    nome: "CPF Teste 1",
    email: "wfernandoaugusto01@gmail.com",
    sexo: "M",
    dataNascimento: null,
    telefone: "21966744479",
    numeroDocumento: "09301823080",
    solicitarSegundaVia: false,
    solicitarPrimeiraVia: false,
    pedidoCartao: false,
    matricula: "0003",
    valorUsoDiario: 10,
    valorUsoDiarioRefeicao: null,
    valorAlimentacao: null,
    valorCombustivel: null,
    numeroLogicoMidia: null,
  },
  {
    idClientePrincipal: 636,
    idPerfilClientePrincipal: 1,
    idClienteFavorecido: 635,
    idPerfilClienteFavorecido: 2,
    dataInclusao: "2023-09-26T14:21:37",
    dataCancelamento: "2023-11-08T14:01:07",
    nome: "CPF Teste 13",
    email: "wfernandoaugusto01@gmail.com",
    sexo: "M",
    dataNascimento: null,
    telefone: "21966734447",
    numeroDocumento: "62534237039",
    solicitarSegundaVia: false,
    solicitarPrimeiraVia: false,
    pedidoCartao: false,
    matricula: "0002",
    valorUsoDiario: 10,
    valorUsoDiarioRefeicao: null,
    valorAlimentacao: null,
    valorCombustivel: null,
    numeroLogicoMidia: null,
  },
  {
    idClientePrincipal: 636,
    idPerfilClientePrincipal: 1,
    idClienteFavorecido: 637,
    idPerfilClienteFavorecido: 2,
    dataInclusao: "2023-09-26T14:54:06",
    dataCancelamento: "2023-11-08T13:29:10",
    nome: "CPF Teste ",
    email: "wfernandoaugusto01@gmail.com",
    sexo: "M",
    dataNascimento: null,
    telefone: "21966744479",
    numeroDocumento: "51602127018",
    solicitarSegundaVia: false,
    solicitarPrimeiraVia: false,
    pedidoCartao: false,
    matricula: "0004",
    valorUsoDiario: 7,
    valorUsoDiarioRefeicao: null,
    valorAlimentacao: null,
    valorCombustivel: null,
    numeroLogicoMidia: null,
  },
  {
    idClientePrincipal: 636,
    idPerfilClientePrincipal: 1,
    idClienteFavorecido: 638,
    idPerfilClienteFavorecido: 2,
    dataInclusao: "2023-09-26T21:07:54",
    dataCancelamento: "2023-11-08T14:25:29",
    nome: "CPF Teste 3",
    email: "teste@teste.com",
    sexo: "M",
    dataNascimento: null,
    telefone: "21999999999",
    numeroDocumento: "91840697083",
    solicitarSegundaVia: false,
    solicitarPrimeiraVia: false,
    pedidoCartao: false,
    matricula: "0005",
    valorUsoDiario: 2.99,
    valorUsoDiarioRefeicao: null,
    valorAlimentacao: null,
    valorCombustivel: null,
    numeroLogicoMidia: null,
  },
  {
    idClientePrincipal: 636,
    idPerfilClientePrincipal: 1,
    idClienteFavorecido: 849,
    idPerfilClienteFavorecido: 2,
    dataInclusao: "2023-10-20T18:41:48",
    dataCancelamento: "2023-11-08T14:25:21",
    nome: "CPF Teste 15",
    email: "",
    sexo: "M",
    dataNascimento: null,
    telefone: "21999999999",
    numeroDocumento: "44202348060",
    solicitarSegundaVia: false,
    solicitarPrimeiraVia: false,
    pedidoCartao: false,
    matricula: "00015",
    valorUsoDiario: 5,
    valorUsoDiarioRefeicao: null,
    valorAlimentacao: null,
    valorCombustivel: null,
    numeroLogicoMidia: null,
  },
  {
    idClientePrincipal: 636,
    idPerfilClientePrincipal: 1,
    idClienteFavorecido: 958,
    idPerfilClienteFavorecido: 2,
    dataInclusao: "2023-11-08T14:03:52",
    dataCancelamento: "2023-11-08T14:25:13",
    nome: "aaaaaaaaaaaaaa",
    email: "teste@teste.com",
    sexo: "M",
    dataNascimento: null,
    telefone: "21999999999",
    numeroDocumento: "47400711008",
    solicitarSegundaVia: false,
    solicitarPrimeiraVia: false,
    pedidoCartao: false,
    matricula: "rrr123123asdsa",
    valorUsoDiario: 15,
    valorUsoDiarioRefeicao: null,
    valorAlimentacao: null,
    valorCombustivel: null,
    numeroLogicoMidia: null,
  },
];

const inputStyle =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

const labelStyle =
  "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

type Inputs = {
  cpf: string;
  nome: string;
  numeroMatricula: string;
  dataNascimento: string;
  sexo: { masculino: "M"; feminino: "F"; outro: "" };
};

export default function ColaboradoresPage() {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [date, setDate] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("🚀 ~ data:", data);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.replace(/\D/g, "");

    const day = input.slice(0, 2);
    const month = input.slice(2, 4);
    const year = input.slice(4, 8);

    const firstBar = day.length === 2 && month.length !== 0 ? "/" : "";
    const secondBar = month.length === 2 && year.length !== 0 ? "/" : "";

    const formattedValue = `${day}${firstBar}${month}${secondBar}${year}`;

    console.log("🚀 ~ formattedValue:", formattedValue);

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

  return (
    <div>
      <MainLayout pageTitle="Colaboradores">
        <div className="flex justify-end py-4">
          <Button onClick={() => setIsModalOpened(true)}>
            <PlusCircle size={20} className="mx-2" /> Novo colaborador
          </Button>
        </div>
        <Modal
          show={isModalOpened}
          onClose={() => setIsModalOpened(false)}
          size="5xl"
        >
          <Modal.Header>Novo colaborador</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Caso seu colaborador não possua nenhum registro na plataforma,
                basta inserir os dados abaixo para criar uma conta e associá-lo
                a sua empresa.
              </p>

              <hr />
              <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-16">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col w-1/2">
                      <label htmlFor="cpf" className={labelStyle}>
                        CPF
                      </label>
                      <MaskedInput
                        id="cpf"
                        mask={"999.999.999-99"}
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

                <div className="flex justify-between gap-8 mb-4">
                  <div className="w-full">
                    <label htmlFor="nome" className={labelStyle}>
                      Nome
                    </label>
                    <input
                      id="nome"
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

                <div className="flex justify-between gap-8">
                  <div className="w-full">
                    <label htmlFor="dataNascimento" className={labelStyle}>
                      Data de Nascimento
                    </label>
                    <input
                      // mask={"99/99/9999"}
                      // alwaysShowMask={false}
                      id="dataNascimento"
                      {...register("dataNascimento", {
                        required: { value: true, message: "Campo obrigatório" },
                        validate: (data) => isDateDD_MM_YYYY_Valid(data),
                      })}
                      className={inputStyle}
                      value={date}
                      onChange={(e) => handleDateChange(e)}

                      // onChange={(e) => {
                      //   setDate(() => onlyNumbers(e.target.value));
                      // }}
                      // onChange={(e) => {
                      //   const newDate = onlyNumbers(e.target.value);

                      //   console.log("🚀 ~ newDate:", newDate);
                      //   console.log("🚀 ~ newDate[0]:", newDate[0]);

                      //   if (Number.parseInt(newDate[0], 10) > 3) {
                      //     return;
                      //   }

                      //   // Atualizar o estado com o novo valor
                      //   setDate(newDate);
                      // }}
                      // onKeyDown={(e) => {
                      //   setDate((prevDate) => {
                      //     const newDate = onlyNumbers(e.key);

                      //     console.log("🚀 ~ prevDate:", prevDate)

                      //     if (Number.parseInt(newDate, 10) > 3) {
                      //       e.preventDefault();
                      //     }

                      //     return newDate;
                      //   });
                      // }}
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
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button
              type="submit"
              form="hook-form"
              onClick={() => {
                // setIsModalOpened(false);
                console.log("🚀 ~ errors:", errors);
              }}
            >
              Criar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Nome</Table.HeadCell>
              <Table.HeadCell>CPF</Table.HeadCell>
              <Table.HeadCell>E-mail</Table.HeadCell>
              <Table.HeadCell>Telefone</Table.HeadCell>
              <Table.HeadCell>Valor de uso diário</Table.HeadCell>
              <Table.HeadCell>Possui primeira via ?</Table.HeadCell>
              <Table.HeadCell>Ações</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {mock.map((colaborador) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100 font-semibold"
                  key={colaborador.numeroDocumento}
                >
                  <Table.Cell>{colaborador.nome}</Table.Cell>
                  <Table.Cell>
                    {formatarCPF(colaborador.numeroDocumento)}
                  </Table.Cell>
                  <Table.Cell>{colaborador.email}</Table.Cell>
                  <Table.Cell>
                    {formatarTelefone(colaborador.telefone)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatarParaBRL(colaborador.valorUsoDiario)}
                  </Table.Cell>
                  <Table.Cell>
                    {colaborador.solicitarPrimeiraVia ? "Não" : "Sim"}
                  </Table.Cell>
                  <Table.Cell className="flex gap-3">
                    <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                      Editar
                    </a>
                    <a className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">
                      Desassociar
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </MainLayout>
    </div>
  );
}
