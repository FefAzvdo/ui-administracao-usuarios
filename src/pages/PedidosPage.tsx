import { useState, ChangeEvent } from "react";
import MainLayout from "../components/MainLayout";
import { Checkbox, Table } from "flowbite-react";
import { mockColaboradores } from "./mock";
import { formatarCPF } from "../utils";
import { ColaboratorType } from "../types";

// function Switch({ colaborador }: { colaborador: ColaboratorType }) {
//   const podePedirPrimeiraVia = colaborador.solicitarPrimeiraVia;

//   return (
//     <label
//       className={`relative mb-5 ${
//         podePedirPrimeiraVia ? "cursor-pointer" : "cursor-not-allowed"
//       }`}
//       style={{ display: "-webkit-flex" }}
//     >
//       <input
//         type="checkbox"
//         className="sr-only peer"
//         // checked={isChecked}
//         disabled={!podePedirPrimeiraVia}
//       />
//       <div
//         className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}
//       ></div>
//       {podePedirPrimeiraVia ? (
//         <span className="ms-3 text-sm font-medium text-gray-90">
//           Recarca + cartão
//         </span>
//       ) : (
//         <span className="ms-3 text-sm font-medium text-gray-300">Recarga</span>
//       )}
//     </label>
//   );
// }

export default function PedidosPage() {
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    ColaboratorType[]
  >([]);

  function handleChangeCheckbox(
    event: ChangeEvent<HTMLInputElement>,
    colaborador: ColaboratorType
  ) {
    const isChecking = event.target.checked;

    if (isChecking) {
      setSelectedColaboradores([...selectedColaboradores, colaborador]);
    } else {
      const withoutColaboratorSelected = selectedColaboradores.filter(
        (colab) => colab.numeroDocumento !== colaborador.numeroDocumento
      );

      setSelectedColaboradores(withoutColaboratorSelected);
    }
  }

  return (
    <MainLayout pageTitle="Pedidos">
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Selecionar colaborador</Table.HeadCell>
            <Table.HeadCell>CPF</Table.HeadCell>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Já possui cartão</Table.HeadCell>
            <Table.HeadCell>Tipo de Uso</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {mockColaboradores.map((colaborador) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100"
                key={colaborador.numeroDocumento}
              >
                <Table.Cell className="w-10 text-center">
                  <Checkbox
                    onChange={(e) => handleChangeCheckbox(e, colaborador)}
                  />
                </Table.Cell>
                <Table.Cell>
                  {formatarCPF(colaborador.numeroDocumento)}
                </Table.Cell>
                <Table.Cell>{colaborador.nome}</Table.Cell>
                <Table.Cell>
                  {/* <Switch colaborador={colaborador} /> */}
                  {colaborador.solicitarPrimeiraVia ? "Não" : "Sim"}
                </Table.Cell>
                <Table.Cell>$2999</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <button onClick={() => console.log(selectedColaboradores)}>ver</button>
      </div>
    </MainLayout>
  );
}
