import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useEffect, useState } from "react";
import { ItensPedidoType, PedidoType } from "../types";
import {
  formatCurrencyToBRL,
  formatDateFromYYYY_MM_DD_To_DD_MM_YYYY,
  getCurrentStatusPedido,
} from "../utils";
import InfoPedido from "../components/InfoPedido";
import { Button, Table } from "flowbite-react";

export default function PedidoPage_DetalhePedido() {
  const [pedido, setPedido] = useState<PedidoType>();
  const params = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.state !== null) {
      setPedido(params.state.pedidoSelecionado);
    }
  }, [params.state]);

  const hasDeliveryItems = params.state.pedidoSelecionado.itensPedido.some(
    (item: ItensPedidoType) => item.idServico === 5
  );

  function handleClickEditarPedido(pedidoSelecionado: PedidoType | undefined) {
    if (pedidoSelecionado === undefined) return;
    navigate("/novo-pedido", {
      state: {
        pedidoSelecionado,
      },
    });
  }

  return (
    <MainLayout pageTitle={`Detalhes do pedido: ${pedido?.numero}`}>
      <div className="flex justify-between w-full">
        <InfoPedido
          label="Data do pedido: "
          value={formatDateFromYYYY_MM_DD_To_DD_MM_YYYY(pedido?.dataInclusao)}
        />
        <InfoPedido
          label="Status do pedido: "
          value={getCurrentStatusPedido(pedido?.statusPedido)?.label}
        />
        {pedido?.statusPedido === "EM_PREPARO" && (
          <InfoPedido
            label="Taxa de entrega: "
            //mockado pedir pro Carlos por no JSON
            value={formatCurrencyToBRL(hasDeliveryItems ? 20 : 0)}
          />
        )}
        <InfoPedido
          label="Valor do pedido: "
          value={formatCurrencyToBRL(pedido?.valorCalculadoPedido)}
        />
      </div>
      <div className="flex justify-end mt-4">
        {pedido?.statusPedido !== "AGUARDANDO_PAGAMENTO" &&
          pedido?.statusPedido !== "EM_PREPARO" && (
            <Button
              className="mr-2"
              onClick={() => alert("CHAMAR API GERAR RECIBO")}
            >
              Recibo do pedido
            </Button>
          )}
        {pedido?.statusPedido === "EM_PREPARO" && (
          <Button
            className="mr-2"
            onClick={() => handleClickEditarPedido(pedido)}
          >
            Editar pedido
          </Button>
        )}
        <Button onClick={() => window.print()}>Imprimir relatório</Button>
      </div>
      <div className="overflow-x-auto mt-8">
        <Table>
          <Table.Head>
            <Table.HeadCell>Item</Table.HeadCell>
            <Table.HeadCell>Nome</Table.HeadCell>
            <Table.HeadCell>Número cartão</Table.HeadCell>
            <Table.HeadCell>Valor</Table.HeadCell>
            <Table.HeadCell>Tipo de operação</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {pedido?.itensPedido.map((pedido, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100 font-semibold"
                key={pedido.numeroItem}
              >
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{pedido.usuario}</Table.Cell>
                <Table.Cell>
                  {pedido.cartao !== undefined ? pedido.cartao : "---"}
                </Table.Cell>
                <Table.Cell>{formatCurrencyToBRL(pedido.valor)}</Table.Cell>
                <Table.Cell>{pedido.servico}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </MainLayout>
  );
}
