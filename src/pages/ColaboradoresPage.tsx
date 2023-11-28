import { Button, Table } from "flowbite-react";
import MainLayout from "../components/MainLayout";
import { formatarCPF, formatarParaBRL, formatarTelefone } from "../utils";
import { PlusCircle } from "@phosphor-icons/react";

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

export default function ColaboradoresPage() {
  return (
    <div>
      <MainLayout pageTitle="Colaboradores">
        <div className="flex justify-end py-4">
          <Button>
            <PlusCircle size={20} className="mx-2" /> Novo colaborador
          </Button>
        </div>
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
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100 font-semibold">
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
