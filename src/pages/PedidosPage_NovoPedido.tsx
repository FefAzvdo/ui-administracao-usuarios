import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { Button, Checkbox, Table } from "flowbite-react";
import { mockColaboradores } from "./mock";
import {
  formatCurrencyBrlToFloat,
  formatarCPF,
  formatarParaBRL,
} from "../utils";
import { ColaboratorType } from "../types";
import { RadioButtonTipoPedido } from "../components/RadioButtonTipoPedido";
import { CurrencyInput } from "../components/CurrencyInput";
import { useLocation, useNavigate } from "react-router-dom";

export default function PedidosPage_NovoPedido() {
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    ColaboratorType[]
  >([]);
  const navigate = useNavigate();
  const params = useLocation();

  useEffect(() => {
    if (params.state !== null) {
      const itensPedidoModified =
        params.state.pedidoSelecionado.itensPedido.map(
          (colab: { documento: string }) => {
            return { ...colab, numeroDocumento: colab.documento };
          }
        );

      itensPedidoModified.forEach((colab: ColaboratorType) =>
        handleChangeCheckbox(true, colab)
      );

      setSelectedColaboradores(itensPedidoModified);
    }
  }, []);

  function handleChangeCheckbox(
    isChecking: boolean,
    colaborador: ColaboratorType
  ) {
    const editedColab = {
      ...colaborador,
      valor:
        params.state !== null
          ? colaborador.valor
          : 22 * colaborador.valorUsoDiario,
      tipoDePedido: "recarga-na-conta",
    };

    if (isChecking) {
      setSelectedColaboradores([...selectedColaboradores, editedColab]);
    } else {
      const withoutColaboratorSelected = selectedColaboradores.filter(
        (colab) => {
          return colab.numeroDocumento !== colaborador.numeroDocumento;
        }
      );

      setSelectedColaboradores(withoutColaboratorSelected);
    }
  }

  function handleClickNextStep() {
    if (isWithoutErrors) {
      navigate("/novo-pedido/entrega", {
        state: {
          selectedColaboradores,
        },
      });
    }
  }

  const isWithoutErrors =
    selectedColaboradores.find(
      (colab) =>
        Number.parseFloat(colab.valor.toString()) < 23 ||
        Number.parseFloat(colab.valor.toString()) > 3000
    ) === undefined;

  return (
    <MainLayout
      pageTitle={params.state !== null ? "Editar pedido" : "Novo pedido"}
    >
      <div className="flex items-center justify-end">
        <p className="text-lg">
          Quantidade de colaboradores:{" "}
          <span className="font-semibold">{selectedColaboradores.length}</span>
        </p>
      </div>
      <div className="flex items-center justify-end mb-4">
        <p className="text-lg">
          Valor total do pedido:{" "}
          <span className="font-semibold">
            {formatarParaBRL(
              selectedColaboradores.reduce(
                (acumulador, item) =>
                  Number.parseFloat(acumulador.toString()) +
                  Number.parseFloat(item.valor.toString()),
                0
              )
            )}
          </span>
        </p>
      </div>
      <div className="flex justify-end mb-8">
        <Button
          onClick={handleClickNextStep}
          disabled={selectedColaboradores.length === 0 || !isWithoutErrors}
        >
          Próximo
        </Button>
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
                    checked={
                      selectedColaboradores.find(
                        (colab) =>
                          colab.numeroDocumento === colaborador.numeroDocumento
                      ) !== undefined
                    }
                    className="cursor-pointer"
                    onChange={(e) => {
                      //@ts-expect-error mock
                      handleChangeCheckbox(e.target.checked, colaborador);
                    }}
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
                        //@ts-expect-error mock
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
                        params.state !== null
                          ? colaborador.valor
                          : colaborador.valorUsoDiario * 22
                      )}
                      onChange={(valorInput) => {
                        const newSelectedColabs = selectedColaboradores.map(
                          (colabs) => {
                            return {
                              ...colabs,
                              valor:
                                colaborador.numeroDocumento ===
                                colabs.numeroDocumento
                                  ? formatCurrencyBrlToFloat(valorInput)
                                  : colabs.valor,
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
      </div>
    </MainLayout>
  );
}
