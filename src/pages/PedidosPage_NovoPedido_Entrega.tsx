import { useLocation } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useEffect, useState } from "react";
import { ColaboratorType } from "../types";
import {
  convertPhosphorIcon,
  formatCurrencyBrlToFloat,
  formatCurrencyToBRL,
} from "../utils";
import { Tabs } from "flowbite-react";
import { mockLojas, mockUsuario } from "./mock";
import { House, Storefront } from "@phosphor-icons/react";
import EnderecoContainer from "../components/EnderecoContainer";

export default function PedidosPage_NovoPedido_Entrega() {
  const params = useLocation();
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    ColaboratorType[]
  >([]);
  const [valorTaxaDeEntrega, setValorTaxaDeEntrega] = useState(0);
  const [possuiTaxaDeEntrega, setPossuiTaxaDeEntrega] = useState<boolean>(true);
  const [selectedEndereco, setSelectedEndereco] = useState({
    ...mockUsuario.enderecos[0],
  });

  useEffect(() => {
    setSelectedColaboradores(params.state.selectedColaboradores);

    //calcular taxa de entrega via api
    setValorTaxaDeEntrega(20);
  }, []);

  const valorDosItens = formatCurrencyToBRL(
    selectedColaboradores.reduce(
      (acumulador, item) =>
        Number.parseFloat(acumulador.toString()) +
        Number.parseFloat(item.valor.toString()),
      0
    )
  );

  const hasDeliveryItems =
    selectedColaboradores.find(
      (colab) => colab.tipoDePedido === "cartao-com-recarga"
    ) !== undefined;

  return (
    <MainLayout pageTitle="Pedido 1452">
      <div className="flex justify-start items-center gap-8">
        <div className="text-2xl font-semibold">
          Valor dos itens:{" "}
          <span className="text-green-400">{valorDosItens}</span>
        </div>
        <div className="text-2xl font-semibold">
          Taxa de entrega:{" "}
          <span className="text-green-400">
            {formatCurrencyToBRL(
              possuiTaxaDeEntrega && hasDeliveryItems ? valorTaxaDeEntrega : 0
            )}
          </span>
        </div>
        <div className="text-2xl font-semibold">
          Valor total:{" "}
          <span className="text-green-400">
            {formatCurrencyToBRL(
              possuiTaxaDeEntrega && hasDeliveryItems
                ? formatCurrencyBrlToFloat(valorDosItens) + valorTaxaDeEntrega
                : formatCurrencyBrlToFloat(valorDosItens)
            )}
          </span>
        </div>
      </div>
      {hasDeliveryItems ? (
        <Tabs aria-label="Default tabs" style="default" className="mt-4">
          <Tabs.Item
            active
            title="Entrega em domicílio"
            icon={convertPhosphorIcon(<House size={25} />)}
          >
            <div className="mt-8 flex justify-between flex-row min-w-full flex-wrap">
              {mockUsuario.enderecos.map((endereco, index) => (
                <EnderecoContainer
                  key={endereco.nrSeqEndereco}
                  //@ts-expect-error mock
                  endereco={endereco}
                  isSelected={
                    selectedEndereco?.nrSeqEndereco === endereco.nrSeqEndereco
                  }
                  name={"Endereço " + index + 1}
                  onChange={() => {
                    setSelectedEndereco(endereco);
                    setPossuiTaxaDeEntrega(true);
                  }}
                />
              ))}
            </div>
          </Tabs.Item>
          <Tabs.Item
            title="Entrega em loja"
            icon={convertPhosphorIcon(<Storefront size={25} />)}
          >
            <div className="mt-8 flex justify-between flex-row min-w-full flex-wrap">
              {mockLojas.map((loja) =>
                loja.enderecos.map((endereco) => (
                  <EnderecoContainer
                    key={endereco.nrSeqEndereco}
                    //@ts-expect-error mock
                    endereco={endereco}
                    isSelected={
                      selectedEndereco?.nrSeqEndereco === endereco.nrSeqEndereco
                    }
                    name={loja.nome}
                    onChange={() => {
                      //@ts-expect-error mock
                      setSelectedEndereco(endereco);
                      setPossuiTaxaDeEntrega(false);
                    }}
                  />
                ))
              )}
            </div>
          </Tabs.Item>
        </Tabs>
      ) : (
        <p className="mt-8">Seu pedido não possui itens entregáveis</p>
      )}
    </MainLayout>
  );
}
