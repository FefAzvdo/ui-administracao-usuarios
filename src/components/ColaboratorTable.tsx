import { Table } from "flowbite-react";
import { ColaboratorType } from "../types";
import { formatCurrencyToBRL, formatarCPF, formatarTelefone } from "../utils";

type ColaboratorTableType = {
  type: "ATIVOS" | "INATIVOS";
  activeColaborators: ColaboratorType[];
  inactiveColaborators: ColaboratorType[];
  onClickEditar: (colaborador: ColaboratorType) => void;
  onClickActionButton: (colaborador: ColaboratorType) => void;
};

export const ColaboratorTable = ({
  type,
  activeColaborators,
  inactiveColaborators,
  onClickEditar,
  onClickActionButton,
}: ColaboratorTableType) => {
  const arrayColabs =
    type === "ATIVOS" ? activeColaborators : inactiveColaborators;

  return (
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
          {arrayColabs.map((colaborador) => (
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
                {colaborador.telefone !== undefined
                  ? formatarTelefone(colaborador.telefone)
                  : ""}
              </Table.Cell>
              <Table.Cell>
                {formatCurrencyToBRL(colaborador.valorUsoDiario)}
              </Table.Cell>
              <Table.Cell>{colaborador.nome ? "Não" : "Sim"}</Table.Cell>
              <Table.Cell className="flex gap-3">
                <a
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    onClickEditar(colaborador);
                  }}
                >
                  Editar
                </a>
                {type === "ATIVOS" ? (
                  <a
                    className="font-medium text-red-600  hover:underline cursor-pointer"
                    onClick={() => {
                      onClickActionButton(colaborador);
                    }}
                  >
                    Desassociar
                  </a>
                ) : (
                  <a
                    className="font-medium text-green-600  hover:underline cursor-pointer"
                    onClick={() => {
                      onClickActionButton(colaborador);
                    }}
                  >
                    Associar
                  </a>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
