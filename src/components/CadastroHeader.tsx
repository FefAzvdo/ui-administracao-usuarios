type Props = {
  title: string;
  subtitle: string;
};

export default function CadastroHeader({ title, subtitle }: Props) {
  return (
    <div className="bg-black w-full h-auto flex justify-center items-center flex-col py-8">
      <h1 className="text-white font-black text-4xl mb-4">{title}</h1>
      <h2 className="text-zinc-500 font-semibold text-2xl">{subtitle}</h2>
    </div>
  );
}
