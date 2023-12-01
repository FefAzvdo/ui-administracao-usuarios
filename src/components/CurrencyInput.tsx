import { inputStyle } from "../styles";
import {
  formatCurrencyBrlToFloat,
  formatarValorInputParaMoedaBRL,
} from "../utils";
import { ChangeEvent, useState, useEffect } from "react";

export const CurrencyInput = ({
  valorDeUsoDiario,
  onChange,
}: {
  valorDeUsoDiario: string;
  onChange: (valorMensal: string) => void;
}) => {
  const [valor, setValor] = useState(valorDeUsoDiario);
  const [erros, setErros] = useState({
    minimo: false,
    maximo: false,
  });

  useEffect(() => {
    const valorEmFloat = formatCurrencyBrlToFloat(valor);

    if (valorEmFloat < 25) {
      setErros({ ...erros, minimo: true });
    } else if (valorEmFloat > 3000) {
      setErros({ ...erros, maximo: true });
    } else {
      setErros({
        minimo: false,
        maximo: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  const handleChangeValorUsoDiario = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const valorFormatado = formatarValorInputParaMoedaBRL(inputValue);

    if (valorFormatado === "R$ NaN") {
      setValor("R$ 0,00");
      onChange("R$ 0,00");
    } else {
      setValor(valorFormatado);
      onChange(valorFormatado);
    }
  };

  return (
    <div className="w-full">
      <input
        placeholder="R$ 0,00"
        id="valorDeUsoDiario"
        onChange={(e) => handleChangeValorUsoDiario(e)}
        value={valor}
        className={inputStyle}
        style={{ color: erros.minimo || erros.maximo ? "red" : "" }}
      />
      {erros.minimo && (
        <span className="text-red-500">
          O valor mínimo de recarga é R$ 25,00
        </span>
      )}
      {erros.maximo && (
        <span className="text-red-500">
          O valor máximo de recarga é R$ 3000,00
        </span>
      )}
    </div>
  );
};
