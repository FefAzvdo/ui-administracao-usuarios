import { Label, Radio } from "flowbite-react";
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

export const RadioButtonTipoPedido = ({
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
