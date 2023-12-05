import { Label, Radio } from "flowbite-react";
import { EnderecoType } from "../types";

type EnderecoContainerType = {
  endereco: EnderecoType;
  isSelected: boolean;
  onChange: () => void;
  name: string;
};

export default function EnderecoContainer({
  endereco,
  isSelected,
  onChange,
  name,
}: EnderecoContainerType) {
  return (
    <Label
      htmlFor={endereco.nrSeqEndereco.toString()}
      className={`flex justify-between items-center border-2 rounded py-8 px-8 cursor-pointer w-full text-base m-4`}
      style={{
        width: window.innerWidth >= 768 ? "46%" : "100%",
        borderColor: isSelected ? "#0891b2" : "",
      }}
    >
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm">{name}</span>
        {endereco.logradouro + ", "}
        {endereco.numero +
          " " +
          endereco.complemento +
          " - " +
          endereco.bairro +
          ", " +
          endereco.cidade +
          " - " +
          endereco.uf}
      </div>
      <Radio
        checked={isSelected}
        id={endereco.nrSeqEndereco.toString()}
        name="endereco"
        value={endereco.nrSeqEndereco}
        onChange={() => {
          onChange();
        }}
      />
    </Label>
  );
}
