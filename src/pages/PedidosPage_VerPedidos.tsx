import MainLayout from "../components/MainLayout";
import { Table, Button, Modal, Datepicker, Spinner } from "flowbite-react";
import { mockStatusPedido } from "./mock";
import {
  Check,
  CopySimple,
  Eye,
  MagnifyingGlass,
  Pencil,
  PlusCircle,
  Receipt,
  Trash,
  Wrench,
  Article,
} from "@phosphor-icons/react";

import { useNavigate } from "react-router-dom";
import {
  formatDateFromYYYY_MM_DD_To_DD_MM_YYYY,
  formatCurrencyToBRL,
  getCurrentStatusPedido,
  formatDateFromDD_MM_YYYY_To_YYYY_MM_DD,
} from "../utils";
import { useEffect, useState } from "react";
import { PedidoType } from "../types";
import { inputStyle, labelStyle } from "../styles";
import { dadosEmpresa } from "../storage";
import { api } from "../api";

export default function PedidosPage_VerPedido() {
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoType>();
  const [inputSearch, setInputSearch] = useState({
    numeroPedido: "",
    statusPedido: "",
    periodoDe: new Date(),
    periodoAte: new Date(),
  });
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(false);

  const codigoEmpresa = dadosEmpresa.codigo;

  function fetchDataTodosOsPedidos(isOnUseEffect: boolean) {
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

    setIsLoadingPedidos(true);

    const body = {
      dataPagamento: false,
      idCliente: codigoEmpresa,
      numeroDocumento: "",
      numeroPedido: inputSearch.numeroPedido,
      periodo: {
        de: isOnUseEffect
          ? formatDateFromDD_MM_YYYY_To_YYYY_MM_DD(
              umAnoAtras.toLocaleDateString()
            ) + "T00:00:00"
          : formatDateFromDD_MM_YYYY_To_YYYY_MM_DD(
              inputSearch.periodoDe.toLocaleDateString()
            ) + "T00:00:00",
        ate:
          formatDateFromDD_MM_YYYY_To_YYYY_MM_DD(
            inputSearch.periodoAte.toLocaleDateString()
          ) + "T23:59:59",
      },
      status: inputSearch.statusPedido,
    };

    api
      .post(`/pedido/params`, body)
      .then((res) => {
        setPedidos(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPedidos(false);
      });
  }

  useEffect(() => {
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

    setInputSearch({
      ...inputSearch,
      periodoDe: umAnoAtras,
    });

    fetchDataTodosOsPedidos(true);
  }, []);

  function handleClickEditarPedido(pedidoSelecionado: PedidoType) {
    navigate("/novo-pedido", {
      state: {
        pedidoSelecionado,
      },
    });
  }

  function handleClickVisualizarPedido(pedidoSelecionado: PedidoType) {
    navigate("/detalhe-pedido", {
      state: {
        pedidoSelecionado,
      },
    });
  }

  return (
    <MainLayout pageTitle="Ver pedidos">
      <div className="flex justify-between md:items-center py-4 flex-col md:flex-row">
        <div className="flex justify-between md:items-center py-4 flex-col md:flex-row">
          <div className="flex gap-4 w-full md:max-w-3xl flex-col md:flex-row md:items-end">
            <div className="flex flex-col">
              <label htmlFor="numeroPedido" className={labelStyle}>
                Nº pedido:
              </label>
              <input
                id="numeroPedido"
                placeholder="0000"
                type="number"
                className={inputStyle}
                value={inputSearch.numeroPedido}
                onChange={(e) =>
                  setInputSearch({
                    ...inputSearch,
                    numeroPedido: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col md:w-1/2">
              <label htmlFor="statusPedido" className={labelStyle}>
                Status:
              </label>
              <select
                id="statusPedido"
                className={inputStyle}
                value={inputSearch.statusPedido}
                onChange={(e) =>
                  setInputSearch({
                    ...inputSearch,
                    statusPedido: e.target.value,
                  })
                }
              >
                {mockStatusPedido.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="periodoDe" className={labelStyle}>
                De:
              </label>
              <Datepicker
                maxDate={inputSearch.periodoAte}
                id="periodoDe"
                language="pt-BR"
                labelTodayButton="Hoje"
                labelClearButton="Limpar"
                value={new Date(inputSearch.periodoDe).toLocaleDateString()}
                onSelectedDateChanged={(date) => {
                  setInputSearch({
                    ...inputSearch,
                    periodoDe: date,
                  });
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="periodoAte" className={labelStyle}>
                Até:
              </label>
              <Datepicker
                minDate={inputSearch.periodoDe}
                maxDate={new Date()}
                id="periodoAte"
                language="pt-BR"
                labelTodayButton="Hoje"
                labelClearButton="Limpar"
                value={new Date(inputSearch.periodoAte).toLocaleDateString()}
                onSelectedDateChanged={(date) => {
                  console.log("🚀 ~ date:", date);
                  setInputSearch({
                    ...inputSearch,
                    periodoAte: date,
                  });
                }}
              />
            </div>
            <Button
              className="mt-2"
              onClick={() => fetchDataTodosOsPedidos(false)}
            >
              <MagnifyingGlass size={20} className="mx-2" /> Buscar
            </Button>
          </div>
        </div>
        <Button className="mt-2" onClick={() => navigate("/novo-pedido")}>
          <PlusCircle size={20} className="mx-2" /> Novo pedido
        </Button>
      </div>
      <Modal
        show={isModalOpened}
        onClose={() => setIsModalOpened(false)}
        size="4xl"
      >
        <Modal.Header>{"Nº Pedido: " + pedidoSelecionado?.numero}</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Wrench
              size={32}
              className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
            />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Escolha o que deseja fazer com o pedido
            </h3>
            <div className="flex flex-col justify-center gap-4 md:flex-row">
              {pedidoSelecionado?.statusPedido === "EM_PREPARO" && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    handleClickEditarPedido(pedidoSelecionado);
                  }}
                >
                  <Pencil size={20} className="mx-2" /> Editar
                </Button>
              )}
              <Button
                className="mt-2"
                onClick={() => {
                  //@ts-expect-error mock
                  handleClickVisualizarPedido(pedidoSelecionado);
                }}
              >
                <Eye size={20} className="mx-2" /> Visualizar
              </Button>
              <Button
                className="mt-2"
                onClick={() => {
                  alert("CHAMAR API DUPLICAR PEDIDO");
                }}
              >
                <CopySimple size={20} className="mx-2" /> Duplicar
              </Button>
              {pedidoSelecionado?.statusPedido === "EM_PREPARO" && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    alert("CHAMAR API FINALIZAR PEDIDO");
                  }}
                >
                  <Check size={20} className="mx-2" /> Finalizar
                </Button>
              )}
              {pedidoSelecionado?.statusPedido === "AGUARDANDO_PAGAMENTO" && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    alert("CHAMAR API GERAR BOLETO");
                  }}
                >
                  <Receipt size={20} className="mx-2" /> Boleto
                </Button>
              )}
              {pedidoSelecionado?.statusPedido === "PAGO" && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    alert("CHAMAR API GERAR RECIBO");
                  }}
                >
                  <Article size={20} className="mx-2" /> Recibo
                </Button>
              )}
              {pedidoSelecionado?.statusPedido === "EM_PREPARO" && (
                <Button
                  className="mt-2"
                  onClick={() => {
                    alert("CHAMAR API EXCLUIR PEDIDO");
                  }}
                  color="failure"
                >
                  <Trash size={20} className="mx-2" /> Excluir pedido
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="overflow-x-auto">
        {isLoadingPedidos ? (
          <div className="flex items-center justify-center h-72">
            <Spinner />
          </div>
        ) : (
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="text-center">Pedido</Table.HeadCell>
              <Table.HeadCell>Dt pedido</Table.HeadCell>
              <Table.HeadCell>Valor Pedido</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Valor Pago</Table.HeadCell>
              <Table.HeadCell>Dt. Pagamento</Table.HeadCell>
              <Table.HeadCell>Ações</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {pedidos.map((pedido) => (
                <Table.Row key={pedido.numero} className="font-semibold">
                  <Table.Cell className="text-center">
                    {pedido.numero}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateFromYYYY_MM_DD_To_DD_MM_YYYY(
                      pedido.dataInclusao
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {formatCurrencyToBRL(pedido.valorCalculadoPedido)}
                  </Table.Cell>
                  <Table.Cell
                    className={`${
                      getCurrentStatusPedido(pedido.statusPedido)?.color
                    }`}
                  >
                    {getCurrentStatusPedido(pedido.statusPedido)?.label}
                  </Table.Cell>
                  <Table.Cell>
                    {formatCurrencyToBRL(pedido.valorPago)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDateFromYYYY_MM_DD_To_DD_MM_YYYY(
                      pedido.dataPagamento ?? ""
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setIsModalOpened(true);
                        setPedidoSelecionado(pedido);
                      }}
                    >
                      Ações
                    </a>
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
