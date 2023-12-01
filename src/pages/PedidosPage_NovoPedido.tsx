import { useState, ChangeEvent } from "react";
import MainLayout from "../components/MainLayout";
import { Checkbox, Table, Button } from "flowbite-react";
import { mockColaboradores } from "./mock";
import {
  formatCurrencyBrlToFloat,
  formatarCPF,
  formatarParaBRL,
} from "../utils";
import { ColaboratorType } from "../types";
import { PlusCircle } from "@phosphor-icons/react";
import { RadioButtonTipoPedido } from "../components/RadioButtonTipoPedido";
import { CurrencyInput } from "../components/CurrencyInput";

export default function PedidosPage_NovoPedido() {
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    ColaboratorType[]
  >([]);

  function handleChangeCheckbox(
    event: ChangeEvent<HTMLInputElement>,
    colaborador: ColaboratorType
  ) {
    const isChecking = event.target.checked;

    const editedColab = {
      ...colaborador,
      valorDaRecarga: 22 * colaborador.valorUsoDiario,
      tipoDePedido: "recarga-na-conta",
    };

    if (isChecking) {
      setSelectedColaboradores([...selectedColaboradores, editedColab]);
    } else {
      const withoutColaboratorSelected = selectedColaboradores.filter(
        (colab) => colab.numeroDocumento !== colaborador.numeroDocumento
      );

      setSelectedColaboradores(withoutColaboratorSelected);
    }
  }

  return (
    <MainLayout pageTitle="Pedidos">
      <div className="flex justify-end w-full mb-8">
        <Button className="mt-2" onClick={() => {}}>
          <PlusCircle size={20} className="mx-2" /> Novo pedido
        </Button>
      </div>
      <div className="flex items-center justify-end">
        <p className="text-lg">
          Quantidade de colaboradores:{" "}
          <span className="font-semibold">{selectedColaboradores.length}</span>
        </p>
      </div>
      <div className="flex items-center justify-end">
        <p className="text-lg">
          Valor total do pedido:{" "}
          <span className="font-semibold">
            {formatarParaBRL(
              selectedColaboradores.reduce(
                (acumulador, item) =>
                  Number.parseFloat(acumulador.toString()) +
                  Number.parseFloat(item.valorDaRecarga.toString()),
                0
              )
            )}
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="text-center">
              Selecionar colaborador
            </Table.HeadCell>
            <Table.HeadCell>CPF</Table.HeadCell>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell className="text-center">
              Já possui cartão
            </Table.HeadCell>
            <Table.HeadCell>Tipo de pedido</Table.HeadCell>
            <Table.HeadCell>Valor de uso mensal (22 dias)</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {mockColaboradores.map((colaborador) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100"
                key={colaborador.numeroDocumento}
              >
                <Table.Cell className="w-10 text-center ">
                  <Checkbox
                    className="cursor-pointer"
                    onChange={(e) => handleChangeCheckbox(e, colaborador)}
                  />
                </Table.Cell>
                <Table.Cell>
                  {formatarCPF(colaborador.numeroDocumento)}
                </Table.Cell>
                <Table.Cell>{colaborador.nome}</Table.Cell>
                <Table.Cell className="text-center w-10">
                  {colaborador.solicitarPrimeiraVia ? "Não" : "Sim"}
                </Table.Cell>
                <Table.Cell>
                  {selectedColaboradores.find(
                    (colab) =>
                      colab.numeroDocumento === colaborador.numeroDocumento
                  ) !== undefined ? (
                    <div className="flex gap-4 flex-col">
                      <RadioButtonTipoPedido
                        defaultChecked
                        colaborador={colaborador}
                        labelName="Recarga na Conta Jaé VT"
                        labelColor="text-green-500"
                        labelHtmlFor="recarga-na-conta"
                        radioId="recarga-na-conta"
                        radioValue="recarga-na-conta"
                        onChange={(colaboradores) =>
                          setSelectedColaboradores(colaboradores)
                        }
                        selectedColaboradores={selectedColaboradores}
                      />
                      {colaborador.solicitarPrimeiraVia && (
                        <RadioButtonTipoPedido
                          defaultChecked={false}
                          colaborador={colaborador}
                          labelName="Recarga + Cartão"
                          labelColor="text-blue-500"
                          labelHtmlFor="cartao-com-recarga"
                          radioId="cartao-com-recarga"
                          radioValue="cartao-com-recarga"
                          onChange={(colaboradores) =>
                            setSelectedColaboradores(colaboradores)
                          }
                          selectedColaboradores={selectedColaboradores}
                        />
                      )}
                    </div>
                  ) : (
                    "---"
                  )}
                </Table.Cell>
                <Table.Cell>
                  {selectedColaboradores.find(
                    (colab) =>
                      colab.numeroDocumento === colaborador.numeroDocumento
                  ) !== undefined ? (
                    <CurrencyInput
                      valorDeUsoDiario={formatarParaBRL(
                        colaborador.valorUsoDiario * 22
                      )}
                      onChange={(valorInput) => {
                        const newSelectedColabs = selectedColaboradores.map(
                          (colabs) => {
                            return {
                              ...colabs,
                              valorDaRecarga:
                                colaborador.numeroDocumento ===
                                colabs.numeroDocumento
                                  ? formatCurrencyBrlToFloat(valorInput)
                                  : colabs.valorDaRecarga,
                            };
                          }
                        );
                        setSelectedColaboradores(newSelectedColabs);
                      }}
                    />
                  ) : (
                    "---"
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <button
          onClick={() => {
            const isWithoutErrors =
              selectedColaboradores.find(
                (colab) =>
                  Number.parseFloat(colab.valorDaRecarga.toString()) < 23 ||
                  Number.parseFloat(colab.valorDaRecarga.toString()) > 3000
              ) === undefined;

            console.log("🚀 ~ isWithoutErrors:", isWithoutErrors);
          }}
        >
          VERRR
        </button>
      </div>
    </MainLayout>
  );
}
