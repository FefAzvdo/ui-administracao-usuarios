import { useState, ChangeEvent } from "react";
import MainLayout from "../components/MainLayout";
import { Checkbox, Table, Radio, Label } from "flowbite-react";
import { mockColaboradores } from "./mock";
import { formatarCPF } from "../utils";
import { ColaboratorType } from "../types";

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
                <Table.Cell>aaa</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <button onClick={() => console.log(selectedColaboradores)}>ver</button>
      </div>
    </MainLayout>
  );
}
