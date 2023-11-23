import Subtitle from "../components/Subtitle";
import Title from "../components/Title";
import { useForm, SubmitHandler } from "react-hook-form";
import MaskedInput from "react-input-mask";

type Inputs = {
  nome: string;
  cnpj: string;
  telefoneParaContato: string;
};

const inputStyle = "my-16 border-b-2  border-slate-400 p-3 text-xl";

function CadsatroPage_01() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black w-full h-56 flex justify-center items-center flex-col">
        <Title title="Abrir a conta empresa é muito simples" />
        <Subtitle subtitle="Comece preenchendo os dados da sua empresa" />
      </div>
      <div className="flex justify-center items-center h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-xl"
          style={{ minWidth: "50%" }}
        >
          {/* register your input into the hook by invoking the "register" function */}

          <input
            {...register("nome", { required: true })}
            placeholder="Nome da sua empresa"
            className={inputStyle}
          />

          <MaskedInput
            // mask options
            mask={"99.999.999/9999-99"}
            alwaysShowMask={false}
            // input options
            type={"text"}
            placeholder="CNPJ"
            // react hook form register
            {...register("cnpj", { required: true })}
            className={inputStyle}
          />

          <MaskedInput
            // mask options
            // mask={mask}
            mask={
              watch("telefoneParaContato", "").replace(/\D/g, "").length === 11
                ? "(99) 9999-9999" //10
                : "(99) 99999-9999" //11
            }
            alwaysShowMask={false}
            // input options
            type={"text"}
            placeholder="Telefone para contato"
            // react hook form register
            {...register("telefoneParaContato", {
              required: true,
              onChange: (e) => {
                const value = e.target.value.replace(/\D/g, "");
                // console.log(value);
                console.log(value.length);
                // if (value.length === 10) {
                //   setMask("(99) 99999-9999");
                // } else {
                //   setMask("(99) 9999-9999");
                // }
              },
            })}
            className={inputStyle}
          />

          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

export default CadsatroPage_01;
