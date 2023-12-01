import { useState, ChangeEvent } from "react";
import MainLayout from "../components/MainLayout";
import { Checkbox, Table, Radio, Label } from "flowbite-react";
import { mockColaboradores } from "./mock";
import {
  formatCurrencyBrlToFloat,
  formatarCPF,
  formatarParaBRL,
  formatarValorInputParaMoedaBRL,
} from "../utils";
import { ColaboratorType } from "../types";

const inputStyle =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

type RadioButtonTipoPedido = {
  labelName: string;
  labelHtmlFor: string;
  labelColor: string;
  radioId: string;
  radioValue: string;
  defaultChecked: boolean;
  colaborador: ColaboratorType;
  selectedColaboradores: ColaboratorType[];
  onChange: (colabs: ColaboratorType[]) => void;
};

const RadioButtonTipoPedido = ({
  labelName,
  labelHtmlFor,
  labelColor,
  radioId,
  radioValue,
  defaultChecked,
  colaborador,
  selectedColaboradores,
  onChange,
}: RadioButtonTipoPedido) => {
  return (
    <div className="flex items-center gap-2">
      <Radio
        defaultChecked={defaultChecked}
        name={colaborador.numeroDocumento}
        id={colaborador.numeroDocumento + radioId}
        value={radioValue}
        onChange={(e) => {
          const radioValue = e.target.value;

          const newSelectedColabs = selectedColaboradores.map((colabs) => {
            return {
              ...colabs,
              tipoDePedido:
                colaborador.numeroDocumento === colabs.numeroDocumento
                  ? radioValue
                  : colabs.tipoDePedido,
            };
          });

          onChange(newSelectedColabs);
        }}
      />
      <Label
        htmlFor={colaborador.numeroDocumento + labelHtmlFor}
        className={labelColor}
      >
        {labelName}
      </Label>
    </div>
  );
};

const CurrencyInput = ({
  valorDeUsoDiario,
  onChange,
}: {
  valorDeUsoDiario: string;
  onChange: (valorMensal: string) => void;
}) => {
  const [valor, setValor] = useState(valorDeUsoDiario);

  const handleChangeValorUsoDiario = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const valorFormatado = formatarValorInputParaMoedaBRL(inputValue);

    setValor(valorFormatado);

    onChange(valorFormatado);
  };

  return (
    <div className="w-full">
      <input
        placeholder="R$ 0,00"
        id="valorDeUsoDiario"
        onChange={(e) => handleChangeValorUsoDiario(e)}
        value={valor}
        className={inputStyle}
      />
    </div>
  );
};

export default function PedidosPage() {
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
                <Table.Cell className="w-10 text-center">
                  <Checkbox
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
        <button onClick={() => console.log(selectedColaboradores)}>ver</button>
      </div>
    </MainLayout>
  );
}
