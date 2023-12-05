import MainLayout from "../components/MainLayout";
import { Table, Button, Modal, Datepicker } from "flowbite-react";
import { mockPedido, mockStatusPedido } from "./mock";
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
  formatDateFromYYYY_MM_DD_to_MMToDD_MM_YYYY,
  formatarParaBRL,
  getCurrentStatusPedido,
} from "../utils";
import { useState } from "react";
import { PedidoType } from "../types";
import { inputStyle, labelStyle } from "../styles";

export default function PedidosPage_VerPedido() {
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoType>();
  const [inputSearch, setInputSearch] = useState({
    numeroPedido: "",
    statusPedido: "AGUARDANDO_PAGAMENTO",
    periodoDe: new Date(),
    periodoAte: new Date(),
  });

  function handleClickEditarPedido(pedidoSelecionado: PedidoType) {
    navigate("/novo-pedido", {
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
                  setInputSearch({
                    ...inputSearch,
                    periodoAte: date,
                  });
                }}
              />
            </div>
            <Button className="mt-2" onClick={() => console.log(inputSearch)}>
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
              <Button className="mt-2" onClick={() => {}}>
                <Eye size={20} className="mx-2" /> Visualizar
              </Button>
              <Button className="mt-2" onClick={() => {}}>
                <CopySimple size={20} className="mx-2" /> Duplicar
              </Button>
              {pedidoSelecionado?.statusPedido === "EM_PREPARO" && (
                <Button className="mt-2" onClick={() => {}}>
                  <Check size={20} className="mx-2" /> Finalizar
                </Button>
              )}
              {pedidoSelecionado?.statusPedido === "AGUARDANDO_PAGAMENTO" && (
                <Button className="mt-2" onClick={() => {}}>
                  <Receipt size={20} className="mx-2" /> Boleto
                </Button>
              )}
              {pedidoSelecionado?.statusPedido === "PAGO" && (
                <Button className="mt-2" onClick={() => {}}>
                  <Article size={20} className="mx-2" /> Recibo
                </Button>
              )}
              {pedidoSelecionado?.statusPedido === "EM_PREPARO" && (
                <Button className="mt-2" onClick={() => {}} color="failure">
                  <Trash size={20} className="mx-2" /> Excluir pedido
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="overflow-x-auto">
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
            {mockPedido.map((pedido) => (
              <Table.Row key={pedido.numero} className="font-semibold">
                <Table.Cell className="text-center">{pedido.numero}</Table.Cell>
                <Table.Cell>
                  {formatDateFromYYYY_MM_DD_to_MMToDD_MM_YYYY(
                    pedido.dataInclusao
                  )}
                </Table.Cell>
                <Table.Cell>
                  {formatarParaBRL(pedido.valorCalculadoPedido)}
                </Table.Cell>
                <Table.Cell
                  className={`${
                    getCurrentStatusPedido(pedido.statusPedido)?.color
                  }`}
                >
                  {getCurrentStatusPedido(pedido.statusPedido)?.value}
                </Table.Cell>
                <Table.Cell>{formatarParaBRL(pedido.valorPago)}</Table.Cell>
                <Table.Cell>
                  {formatDateFromYYYY_MM_DD_to_MMToDD_MM_YYYY(
                    pedido.dataPagamento ?? ""
                  )}
                </Table.Cell>
                <Table.Cell>
                  <a
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setIsModalOpened(true);
                      //@ts-expect-error mock
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
      </div>
    </MainLayout>
  );
}
