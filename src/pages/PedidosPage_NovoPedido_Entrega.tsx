import { useLocation } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useEffect, useState } from "react";
import { ColaboratorType } from "../types";
import { formatCurrencyBrlToFloat, formatarParaBRL } from "../utils";
import { Label, Radio } from "flowbite-react";
import { mockLojas } from "./mock";

export default function PedidosPage_NovoPedido_Entrega() {
  const params = useLocation();
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    ColaboratorType[]
  >([]);
  const [taxaDeEntrega, setTaxaDeEntrega] = useState(0);

  useEffect(() => {
    setSelectedColaboradores(params.state.selectedColaboradores);

    // if (
    //   params.state.selectedColaboradores.find(
    //     (colaborador: { tipoDePedido: string; }) => colaborador.tipoDePedido === "cartao-com-recarga"
    //   ) !== undefined
    // ) {
    //   setTaxaDeEntrega(20)
    // }
  }, []);

  const valorDosItens = formatarParaBRL(
    selectedColaboradores.reduce(
      (acumulador, item) =>
        Number.parseFloat(acumulador.toString()) +
        Number.parseFloat(item.valorDaRecarga.toString()),
      0
    )
  );

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
            {formatarParaBRL(taxaDeEntrega)}
          </span>
        </div>
        <div className="text-2xl font-semibold">
          Valor total:{" "}
          <span className="text-green-400">
            {formatarParaBRL(
              formatCurrencyBrlToFloat(valorDosItens) + taxaDeEntrega
            )}
          </span>
        </div>
      </div>
      <div className="mt-8 flex flex-row min-w-full flex-wrap">
        {mockLojas.map((loja) =>
          loja.enderecos.map((endereco) => (
            <Label
              htmlFor={endereco.nrSeqEndereco.toString()}
              className="flex justify-between items-center border rounded py-8 px-20 cursor-pointer w-full md:w-1/2 text-base"
            >
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">{loja.nome}</span>
                {endereco.logradouro + ", "}
                {endereco.numero + " - " + endereco.complemento}
              </div>
              <Radio
                id={endereco.nrSeqEndereco.toString()}
                name="endereco"
                value={endereco.nrSeqEndereco}
              />
            </Label>
          ))
        )}
      </div>
    </MainLayout>
  );
}
