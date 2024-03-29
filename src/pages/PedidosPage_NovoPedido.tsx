import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { Button, Checkbox, Spinner, Table } from "flowbite-react";
import {
  formatCurrencyBrlToFloat,
  formatarCPF,
  formatCurrencyToBRL,
  getIdTipoItemPedido,
} from "../utils";
import { ColaboratorType, ItensPedido, PedidoBody } from "../types";
import { RadioButtonTipoPedido } from "../components/RadioButtonTipoPedido";
import { CurrencyInput } from "../components/CurrencyInput";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { dadosEmpresa } from "../storage";

export default function PedidosPage_NovoPedido() {
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    ColaboratorType[]
  >([]);
  const [allColaboradores, setAllColaboradores] = useState<ColaboratorType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useLocation();

  const codigoEmpresa = dadosEmpresa.codigo;

  function fetchDataColaboradores() {
    setIsLoading(true);

    api
      .get(`/cliente/${codigoEmpresa}/favorecidos?page=1&size=500&idProduto=2`)
      .then((res) => {
        setAllColaboradores(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    console.log("params.state", params.state);

    if (params.state !== null) {
      const itensPedidoModified =
        params.state.pedidoSelecionado.itensPedido.map(
          (colab: ColaboratorType) => {
            return {
              ...colab,
              numeroDocumento: colab.documento,
              valor: colab.valorUsoDiario * 22,
              tipoDePedido:
                colab.idServico === 5
                  ? "cartao-com-recarga"
                  : "recarga-na-conta",
            };
          }
        );

      itensPedidoModified.forEach((colab: ColaboratorType) =>
        handleChangeCheckbox(true, colab)
      );

      setSelectedColaboradores(itensPedidoModified);
    }

    fetchDataColaboradores();
  }, []);

  function handleChangeCheckbox(
    isChecking: boolean,
    colaborador: ColaboratorType
  ) {
    const tipoDePedido =
      colaborador.idServico !== undefined
        ? colaborador.tipoDePedido
        : "recarga-na-conta";

    const editedColab = {
      ...colaborador,
      valor: 22 * colaborador.valorUsoDiario,
      tipoDePedido: params.state === null ? "recarga-na-conta" : tipoDePedido,
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

  function generatePedidoBody() {
    const itensPedido: ItensPedido[] = selectedColaboradores.map((item) => {
      return {
        excluir: false,
        idEmissorMidia: 0,
        valorProduto: 0,
        idItem: 0,
        idAplicacao: 30,
        idModeloProduto: 1,
        idMotivoCancelamento: 0,
        idCliente: item.idClienteFavorecido,
        idItemBeneficio: 0,
        idProduto: 2,
        idTipoPerfilCliente: "USUARIO",
        valorCredito: item.valor,
        idTipoItemPedido: getIdTipoItemPedido(item.tipoDePedido),
        numeroLogicoMidia: "",
      };
    });

    const body: PedidoBody = {
      comTaxaEntrega: false,
      idCliente: codigoEmpresa,
      idTipoPerfilCliente: "EMPRESA",
      itensPedido,
      nrSeqEndereco: 0,
      numero: 0,
      tipoPagamento: ["BOLETO"],
      valorCalculadoPedido: 0,
      valorPedido: 0,
      valorRefeicao: 0,
      valorAlimentacao: 0,
      valorCombustivel: 0,
    };

    return body;
  }

  function handleClickNextStep() {
    const pedidoSelecionado =
      params.state !== null ? { ...params.state.pedidoSelecionado } : null;

    const pedido = {
      pedidoSelecionado,
      itensPedido: selectedColaboradores,
    };

    if (isWithoutErrors) {
      api.post(`/pedido`, generatePedidoBody()).then(() => {
        navigate("/novo-pedido/entrega", {
          state: {
            selectedColaboradores,
            pedido,
          },
        });
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
      pageTitle={
        params.state !== null
          ? `Editar pedido ${params.state.pedidoSelecionado.numero}`
          : "Novo pedido"
      }
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
            {formatCurrencyToBRL(
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
        {isLoading ? (
          <div className="flex items-center justify-center h-72">
            <Spinner />
          </div>
        ) : (
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
              {allColaboradores.map((colaborador) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100"
                  key={colaborador.numeroDocumento}
                >
                  <Table.Cell className="w-10 text-center ">
                    <Checkbox
                      checked={
                        selectedColaboradores.find(
                          (colab) =>
                            colab.numeroDocumento ===
                            colaborador.numeroDocumento
                        ) !== undefined
                      }
                      className="cursor-pointer"
                      onChange={(e) => {
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
                        valorDeUsoDiario={formatCurrencyToBRL(
                          colaborador.valorUsoDiario * 22
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
        )}
      </div>
    </MainLayout>
  );
}
