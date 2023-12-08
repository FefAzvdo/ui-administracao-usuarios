import { House, Pencil } from "@phosphor-icons/react";
import { EnderecoType } from "../types";

export default function EnderecoContainerMeuPerfil({
  endereco,
  onClickEditar,
}: {
  endereco: EnderecoType;
  onClickEditar: () => void;
}) {
  const { cep, logradouro, numero, complemento, bairro, cidade, uf } = endereco;

  const enderecoArr = [
    { label: "Logradouro", value: logradouro },
    { label: "Número", value: numero },
    { label: "Complemento", value: complemento },
    { label: "Bairro", value: bairro },
    { label: "Cidade", value: cidade },
    { label: "Uf", value: uf },
  ];

  return (
    <div className="border-2 p-4 text-lg my-2" style={{ width: "33rem" }}>
      <div className="flex justify-between items-center">
        <div className="flex flex-row font-semibold">
          <div>
            <House size={25} className="mr-2" />
          </div>
          <div>CEP: {cep}</div>
        </div>
        <div>
          <Pencil
            size={25}
            className="cursor-pointer"
            onClick={() => onClickEditar()}
          />
        </div>
      </div>
      <hr className="my-2" />
      {enderecoArr.map((end) => {
        return (
          <div className="flex justify-between" key={end.value}>
            {end.label}: <span className="font-semibold">{end.value}</span>
          </div>
        );
      })}
    </div>
  );
}
