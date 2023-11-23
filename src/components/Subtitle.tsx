type Props = {
  subtitle: string;
};

export default function Subtitle({ subtitle }: Props) {
  return <h2 className="text-zinc-500 font-semibold text-2xl">{subtitle}</h2>;
}
